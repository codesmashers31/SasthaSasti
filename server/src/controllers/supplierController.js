import Supplier from '../models/Supplier.js';
import Product from '../models/Product.js';
import Payment from '../models/Payment.js';
import Account from '../models/Account.js';
import AccountTransaction from '../models/AccountTransaction.js';
import ActivityLog from '../models/ActivityLog.js';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';
import InventoryTransaction from '../models/InventoryTransaction.js';

export const getSuppliers = async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.trim() : '';
    const payment_status = req.query.payment_status;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;

    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status.toLowerCase();
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contact_person: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { supplier_code: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { gstin: { $regex: search, $options: 'i' } },
        { gst_number: { $regex: search, $options: 'i' } },
      ];
    }
    if (payment_status) filter.payment_status = payment_status;

    const total = await Supplier.countDocuments(filter);
    const suppliers = await Supplier.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: suppliers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });

    const products = await Product.find({
      $or: [{ supplier_id: supplier.legacyId }, { supplier_id: supplier._id }, { supplier_name: supplier.name }]
    });

    const payments = await Payment.find({
      supplier_id: supplier.legacyId || supplier._id
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: supplier, products, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.supplier_name && !body.name) body.name = body.supplier_name;
    if (!body.name || !body.name.trim()) body.name = 'General Supplier';
    if (body.mobile_number && !body.mobile) body.mobile = body.mobile_number;
    if (body.gst_number && !body.gstin) body.gstin = body.gst_number;
    if (body.gstin && !body.gst_number) body.gst_number = body.gstin;
    if (body.status) {
      body.status = body.status.toLowerCase();
    }
    if (!body.supplier_code) {
      const count = await Supplier.countDocuments();
      body.supplier_code = `SUP-${String(count + 1).padStart(4, '0')}`;
    }

    const supplier = await Supplier.create(body);

    // If initial products are attached
    if (body.products && Array.isArray(body.products)) {
      for (const prodData of body.products) {
        if (!prodData.name) continue;
        const pCount = await Product.countDocuments();
        await Product.create({
          sku: prodData.sku || `SKU-${Date.now().toString().slice(-4)}${pCount + 1}`,
          barcode: prodData.barcode || prodData.sku,
          name: prodData.name,
          god_name: prodData.god_name || '',
          material: prodData.material || 'Brass',
          supplier_id: supplier.legacyId || supplier._id,
          supplier_name: supplier.name,
          purchase_price: parseFloat(prodData.purchase_price) || 0,
          selling_price: parseFloat(prodData.selling_price) || 0,
          current_stock: parseInt(prodData.stock) || 1,
          status: 'active',
        });
      }
    }

    res.status(201).json({ success: true, data: supplier });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.supplier_name && !body.name) body.name = body.supplier_name;
    if (body.mobile_number && !body.mobile) body.mobile = body.mobile_number;
    if (body.gst_number && !body.gstin) body.gstin = body.gst_number;
    if (body.gstin && !body.gst_number) body.gst_number = body.gstin;
    if (body.status) {
      body.status = body.status.toLowerCase();
    }
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
    res.json({ success: true, data: supplier });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveWithProducts = async (req, res) => {
  try {
    const name = (req.body.supplier_name || req.body.name || '').trim() || 'General Supplier';
    const mobile = (req.body.mobile_number || req.body.mobile || '').trim();

    const supplierId = req.body.supplier_id || req.body.id;
    let supplier = null;

    if (supplierId) {
      supplier = await Supplier.findById(supplierId);
      if (!supplier) {
        supplier = await Supplier.findOne({ $or: [{ legacyId: Number(supplierId) }, { supplier_code: supplierId }] });
      }
    }

    if (!supplier) {
      supplier = await Supplier.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${name}$`, 'i') } },
          { mobile: mobile }
        ]
      });
    }

    const suppStatus = req.body.status ? req.body.status.toLowerCase() : 'active';
    const gstVal = (req.body.gst_number || req.body.gstin || '').trim().toUpperCase();

    if (supplier) {
      supplier.name = name;
      supplier.mobile = mobile;
      if (req.body.contact_person) supplier.contact_person = req.body.contact_person;
      if (req.body.company_name) supplier.company_name = req.body.company_name;
      if (req.body.email) supplier.email = req.body.email;
      if (req.body.address) supplier.address = req.body.address;
      if (req.body.city) supplier.city = req.body.city;
      if (req.body.state) supplier.state = req.body.state;
      if (gstVal) {
        supplier.gstin = gstVal;
        supplier.gst_number = gstVal;
      }
      if (req.body.purchase_date) supplier.purchase_date = req.body.purchase_date;
      supplier.status = suppStatus;
    } else {
      const count = await Supplier.countDocuments();
      const code = `SUP-${String(count + 1).padStart(4, '0')}`;
      supplier = new Supplier({
        legacyId: count + 1,
        supplier_code: code,
        name,
        mobile,
        contact_person: req.body.contact_person || '',
        company_name: req.body.company_name || '',
        email: req.body.email || '',
        address: req.body.address || '',
        city: req.body.city || '',
        state: req.body.state || 'Tamil Nadu',
        gstin: gstVal,
        gst_number: gstVal,
        purchase_date: req.body.purchase_date || new Date().toISOString().split('T')[0],
        status: suppStatus,
      });
    }

    // Process Products Supplied
    let itemsToProcess = [];
    if (Array.isArray(req.body.products)) {
      itemsToProcess = req.body.products;
    } else if (Array.isArray(req.body.sp_product_name)) {
      const names = req.body.sp_product_name;
      const cats = req.body.sp_product_category || [];
      const subcats = req.body.sp_product_subcategory || [];
      const units = req.body.sp_unit || [];
      const pieceRates = req.body.sp_piece_rate || [];
      const purchases = req.body.sp_purchase_price || [];
      const margins = req.body.sp_margin_percentage || [];
      const sellings = req.body.sp_selling_price || [];
      const gsts = req.body.sp_gst || [];
      const barcodes = req.body.sp_barcode || [];
      const ids = req.body.sp_product_id || [];

      for (let i = 0; i < names.length; i++) {
        itemsToProcess.push({
          product_id: ids[i],
          name: names[i],
          category: cats[i],
          subcategory: subcats[i],
          units: units[i],
          piece_rate: pieceRates[i],
          purchase_price: purchases[i],
          margin_percentage: margins[i],
          selling_price: sellings[i],
          gst: gsts[i],
          barcode: barcodes[i],
        });
      }
    }

    const savedProducts = [];
    let calculatedProductPurchaseTotal = 0;

    for (const item of itemsToProcess) {
      const pName = (item.name || '').trim();
      if (!pName) continue;

      const catName = (item.category || item.category_name || 'General').trim();
      let category = await Category.findOne({ name: { $regex: new RegExp(`^${catName}$`, 'i') } });
      if (!category) {
        const catCount = await Category.countDocuments();
        category = await Category.create({
          legacyId: catCount + 1,
          name: catName,
          slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          status: 'active',
        });
      }

      const subcatName = (item.subcategory || item.subcategory_name || '').trim();
      let subcategory = null;
      if (subcatName) {
        subcategory = await SubCategory.findOne({
          name: { $regex: new RegExp(`^${subcatName}$`, 'i') },
          category_id: category.legacyId || category._id
        });
        if (!subcategory) {
          const subCount = await SubCategory.countDocuments();
          subcategory = await SubCategory.create({
            legacyId: subCount + 1,
            category_id: category.legacyId || 1,
            name: subcatName,
            slug: subcatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            status: 'active',
          });
        }
      }

      const units = Math.max(0, parseInt(item.units || item.current_stock || 1));
      const pieceRate = Math.max(0, parseFloat(item.piece_rate || 0));
      let purchasePrice = parseFloat(item.purchase_price || 0);
      if (purchasePrice <= 0) {
        purchasePrice = units > 0 && pieceRate > 0 ? units * pieceRate : pieceRate;
      }
      calculatedProductPurchaseTotal += purchasePrice;

      const margin = item.margin_percentage !== undefined && item.margin_percentage !== '' 
        ? Math.max(0, parseFloat(item.margin_percentage)) 
        : 60;
      let sellingPrice = parseFloat(item.selling_price || 0);
      if (sellingPrice <= 0 && pieceRate > 0) {
        sellingPrice = Math.round((pieceRate * (1 + margin / 100)) * 100) / 100;
      }

      const gst = Math.max(0, parseFloat(item.gst || item.gst_percent || 12));

      let existingProd = null;
      if (item.product_id) {
        existingProd = await Product.findById(item.product_id);
      }
      if (!existingProd) {
        existingProd = await Product.findOne({
          name: { $regex: new RegExp(`^${pName}$`, 'i') },
          $or: [{ supplier_id: supplier._id }, { supplier_id: supplier.legacyId }]
        });
      }

      if (existingProd) {
        const prevStock = existingProd.current_stock || 0;
        const newStock = prevStock + units;
        existingProd.current_stock = newStock;
        existingProd.piece_rate = pieceRate || existingProd.piece_rate;
        existingProd.purchase_price = purchasePrice || existingProd.purchase_price;
        existingProd.margin_percentage = margin;
        existingProd.selling_price = sellingPrice || existingProd.selling_price;
        existingProd.gst_percent = gst;
        existingProd.status = newStock > 0 ? 'active' : 'out_of_stock';
        await existingProd.save();

        if (units > 0) {
          await InventoryTransaction.create({
            product_id: existingProd.legacyId || existingProd._id,
            product_name: existingProd.name,
            transaction_type: 'stock_in',
            quantity: units,
            unit_price: pieceRate,
            previous_stock: prevStock,
            new_stock: newStock,
            reference_type: 'restock',
            reference_no: `RESTOCK-${existingProd.sku || existingProd._id}`,
            notes: `Restocked ${units} units from supplier ${supplier.name}`,
            created_by: req.user ? req.user.legacyId || 1 : 1,
          });
        }
        savedProducts.push(existingProd);
      } else {
        const pCount = await Product.countDocuments();
        const sku = `SKU-${Date.now().toString().slice(-4)}${pCount + 1}`;
        const barcode = (item.barcode || '').trim() || `${Date.now().toString().slice(-8)}${Math.floor(1000 + Math.random() * 9000)}`;

        const newProd = await Product.create({
          legacyId: pCount + 1,
          sku,
          code: sku,
          barcode,
          name: pName,
          category_id: category.legacyId || category._id,
          subcategory_id: subcategory ? (subcategory.legacyId || subcategory._id) : null,
          supplier_id: supplier._id,
          supplier_name: supplier.name,
          piece_rate: pieceRate,
          purchase_price: purchasePrice,
          margin_percentage: margin,
          selling_price: sellingPrice,
          gst_percent: gst,
          current_stock: units,
          total_purchased_qty: units,
          status: units > 0 ? 'active' : 'out_of_stock',
        });

        if (units > 0) {
          await InventoryTransaction.create({
            product_id: newProd.legacyId || newProd._id,
            product_name: newProd.name,
            transaction_type: 'stock_in',
            quantity: units,
            unit_price: pieceRate,
            previous_stock: 0,
            new_stock: units,
            reference_type: 'opening_stock',
            reference_no: `INIT-${sku}`,
            notes: `Initial stock from supplier ${supplier.name}`,
            created_by: req.user ? req.user.legacyId || 1 : 1,
          });
        }
        savedProducts.push(newProd);
      }

      if (!supplier.products_supplied) supplier.products_supplied = [];
      if (!supplier.products_supplied.includes(pName)) {
        supplier.products_supplied.push(pName);
      }
    }

    // Ledger calculation
    const totalPurchased = parseFloat(req.body.total_amount_purchased) || calculatedProductPurchaseTotal || 0;
    const cashAmt = parseFloat(req.body.payment_amount_cash) || 0;
    const cardAmt = parseFloat(req.body.payment_amount_card) || 0;
    const upiAmt = parseFloat(req.body.payment_amount_upi) || 0;
    const bankAmt = parseFloat(req.body.payment_amount_bank) || 0;
    const creditAmt = parseFloat(req.body.payment_amount_credit) || 0;
    const totalPaidNow = parseFloat(req.body.total_amount_paid) || (cashAmt + cardAmt + upiAmt + bankAmt + creditAmt);

    supplier.payment_methods = Array.isArray(req.body.payment_methods) 
      ? req.body.payment_methods.join(', ') 
      : (req.body.payment_methods || 'Cash');
    supplier.payment_amount_cash = cashAmt;
    supplier.payment_amount_card = cardAmt;
    supplier.payment_amount_upi = upiAmt;
    supplier.payment_amount_bank = bankAmt;
    supplier.payment_amount_credit = creditAmt;

    if (totalPurchased > 0) {
      supplier.total_purchased = (supplier.total_purchased || 0) + totalPurchased;
    }
    if (totalPaidNow > 0) {
      supplier.total_paid = (supplier.total_paid || 0) + totalPaidNow;
    }
    supplier.balance_due = Math.max(0, (supplier.total_purchased || 0) - (supplier.total_paid || 0));
    supplier.outstanding_balance = supplier.balance_due;
    supplier.payment_status = supplier.balance_due <= 0 
      ? 'Paid' 
      : (supplier.total_paid > 0 ? 'Partially Paid' : 'Unpaid');

    await supplier.save();

    await ActivityLog.create({
      user_id: req.user ? req.user.legacyId || 1 : 1,
      user_name: req.user ? req.user.name : 'System',
      action: supplierId ? 'update' : 'create',
      module: 'suppliers',
      reference_code: supplier.supplier_code,
      description: `${supplierId ? 'Updated' : 'Registered'} supplier ${supplier.name} with ${savedProducts.length} product(s)`,
    });

    res.status(201).json({
      success: true,
      message: 'Supplier saved successfully!',
      data: supplier,
      products: savedProducts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save supplier: ' + err.message });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const id = req.params.id;
    let supplier = await Supplier.findById(id);
    if (!supplier) {
      supplier = await Supplier.findOne({ $or: [{ legacyId: Number(id) }, { supplier_code: id }] });
    }
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    const suppLegacyId = supplier.legacyId || supplier._id;

    // Delete associated products & transactions
    await Product.deleteMany({ $or: [{ supplier_id: supplier._id }, { supplier_id: suppLegacyId }] });
    await Supplier.findByIdAndDelete(supplier._id);

    await ActivityLog.create({
      user_id: req.user ? req.user.legacyId || 1 : 1,
      user_name: req.user ? req.user.name : 'System',
      action: 'delete',
      module: 'suppliers',
      reference_code: supplier.supplier_code,
      description: `Deleted supplier ${supplier.name}`,
    });

    res.json({ success: true, message: 'Supplier deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete supplier: ' + err.message });
  }
};

export const getSupplierInvoices = async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.trim() : '';
    const payment_status = req.query.payment_status;

    const filter = { status: 'active' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { supplier_code: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ];
    }
    if (payment_status) filter.payment_status = payment_status;

    const suppliers = await Supplier.find(filter).sort({ createdAt: -1 });

    const invoices = suppliers.map(s => ({
      id: s._id,
      supplier_id: s.supplier_code,
      supplier_name: s.name,
      amount: s.total_purchased || s.balance_due || 0,
      paid_amount: s.total_paid || 0,
      balance_due: s.balance_due || 0,
      payment_status: s.payment_status || 'Unpaid',
      mobile: s.mobile,
      notes: s.notes,
    }));

    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSupplierPayment = async (req, res) => {
  try {
    const {
      supplier_id,
      paid_amount,
      additional_amount = 0,
      payment_status = 'Unpaid',
      payment_method = 'Cash',
      payment_date = new Date().toISOString().slice(0, 10),
      notes = ''
    } = req.body;

    const supplier = await Supplier.findOne({
      $or: [{ _id: supplier_id }, { supplier_code: supplier_id }, { legacyId: supplier_id }]
    });

    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });

    const currentPaid = parseFloat(paid_amount) || 0;
    const addAmt = parseFloat(additional_amount) || 0;
    const totalNewPaid = currentPaid + addAmt;

    supplier.total_paid = totalNewPaid;
    supplier.balance_due = Math.max(0, (supplier.total_purchased || 0) - totalNewPaid);
    supplier.payment_status = payment_status;
    supplier.notes = notes;
    await supplier.save();

    // Deduct from account if additional amount > 0
    if (addAmt > 0) {
      const account = await Account.findOne({
        type: payment_method.toLowerCase() === 'cash' ? 'cash' : 'bank'
      });
      if (account) {
        account.current_balance = (Number(account.current_balance) || 0) - addAmt;
        await account.save();

        await AccountTransaction.create({
          account_id: account.legacyId || account._id,
          account_name: account.name,
          transaction_type: 'credit',
          amount: addAmt,
          balance_after: account.current_balance,
          reference_type: 'supplier_payment',
          reference_no: supplier.supplier_code,
          description: `Disbursement to artisan ${supplier.name}: ₹${addAmt}`,
          transaction_date: payment_date,
          created_by: req.user ? req.user.legacyId || 1 : 1,
        });
      }

      await Payment.create({
        payment_no: `SPAY-${Date.now().toString().slice(-6)}`,
        payment_type: 'supplier',
        supplier_id: supplier.legacyId || supplier._id,
        amount: addAmt,
        payment_method,
        payment_date,
        notes: notes || `Disbursement for ${supplier.name}`,
        created_by: req.user ? req.user.legacyId || 1 : 1,
      });
    }

    await ActivityLog.create({
      user_id: req.user ? req.user.legacyId || 1 : 1,
      user_name: req.user ? req.user.name : 'System',
      action: 'update',
      module: 'suppliers',
      reference_code: supplier.supplier_code,
      description: `Updated payment for ${supplier.name}: Status ${payment_status}, Total Paid ₹${totalNewPaid}`,
    });

    res.json({
      success: true,
      message: 'Supplier payment updated successfully!',
      data: {
        id: supplier._id,
        supplier_id: supplier.supplier_code,
        supplier_name: supplier.name,
        paid_amount: supplier.total_paid,
        balance_due: supplier.balance_due,
        payment_status: supplier.payment_status,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const recordPayment = async (req, res) => {
  try {
    const { amount, payment_method = 'bank_transfer', account_id = 2, notes = '' } = req.body;
    const payAmount = parseFloat(amount);
    if (!payAmount || payAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount is required' });
    }

    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });

    supplier.total_paid = (supplier.total_paid || 0) + payAmount;
    supplier.balance_due = Math.max(0, (supplier.balance_due || 0) - payAmount);
    supplier.payment_status = supplier.balance_due === 0 ? 'Paid' : 'Partially Paid';
    await supplier.save();

    res.json({ success: true, message: 'Payment recorded successfully', supplier });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
