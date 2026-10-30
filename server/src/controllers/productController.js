import Product from '../models/Product.js';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';
import Supplier from '../models/Supplier.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import ActivityLog from '../models/ActivityLog.js';

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search ? req.query.search.trim() : '';
    const category_id = req.query.category_id;
    const material = req.query.material;
    const low_stock = req.query.low_stock === 'true';

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { god_name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } },
      ];
    }
    if (category_id) filter.category_id = Number(category_id);
    if (material) filter.material = material;
    if (low_stock) {
      filter.$expr = { $lte: ['$current_stock', '$min_stock_alert'] };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const searchForPos = async (req, res) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';
    const category_id = req.query.category_id;

    const filter = { status: 'active' };
    if (category_id) filter.category_id = Number(category_id);

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { god_name: { $regex: q, $options: 'i' } },
        { sku: { $regex: q, $options: 'i' } },
        { barcode: { $regex: q, $options: 'i' } },
        { material: { $regex: q, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter)
      .select('sku barcode name god_name material finish_type height_inches weight_kg selling_price mrp current_stock gst_percent hsn_code images')
      .limit(80);

    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const scanBarcode = async (req, res) => {
  try {
    const code = req.body.code ? req.body.code.trim() : '';
    if (!code) return res.status(400).json({ success: false, message: 'Barcode is required' });

    const product = await Product.findOne({
      $or: [{ barcode: code }, { sku: code }]
    });

    if (!product) {
      return res.status(404).json({ success: false, message: `No statue found for Barcode/SKU: ${code}` });
    }

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.name.trim()) {
      return res.status(400).json({ success: false, message: 'Product Name is mandatory.' });
    }
    
    // Auto-generate SKU if not provided
    if (!body.sku) {
      const count = await Product.countDocuments();
      body.sku = `SKU-${Date.now().toString().slice(-5)}${count + 1}`;
    }
    if (!body.barcode) {
      body.barcode = body.sku;
    }

    // Resolve category/subcategory names
    if (body.category_id) {
      const cat = await Category.findOne({ legacyId: body.category_id });
      if (cat) body.category_name = cat.name;
    }
    if (body.subcategory_id) {
      const sub = await SubCategory.findOne({ legacyId: body.subcategory_id });
      if (sub) body.subcategory_name = sub.name;
    }
    if (body.supplier_id) {
      const sup = await Supplier.findOne({ legacyId: body.supplier_id });
      if (sup) body.supplier_name = sup.name;
    }

    const product = await Product.create(body);

    // Initial stock transaction if stock > 0
    if (product.current_stock > 0) {
      await InventoryTransaction.create({
        product_id: product.legacyId || product._id,
        product_name: product.name,
        transaction_type: 'stock_in',
        quantity: product.current_stock,
        unit_price: product.purchase_price,
        previous_stock: 0,
        new_stock: product.current_stock,
        reference_type: 'initial_stock',
        reference_no: product.sku,
        notes: 'Initial catalogue stock creation',
        created_by: req.user ? req.user.legacyId || 1 : 1,
      });
    }

    await ActivityLog.create({
      user_id: req.user ? req.user.legacyId || 1 : 1,
      user_name: req.user ? req.user.name : 'System',
      action: 'create',
      module: 'products',
      reference_code: product.sku,
      description: `Created new statue/product: ${product.name} (${product.sku})`,
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    await ActivityLog.create({
      user_id: req.user ? req.user.legacyId || 1 : 1,
      user_name: req.user ? req.user.name : 'System',
      action: 'update',
      module: 'products',
      reference_code: product.sku,
      description: `Updated product specs: ${product.name}`,
    });

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveProductDetail = async (req, res) => {
  try {
    const {
      prod_supplier_id,
      supplier_id,
      prod_supply_date,
      supply_date,
      products: productsList,
      prod_payment_methods,
      prod_payment_amount_cash,
      prod_payment_amount_card,
      prod_payment_amount_upi,
      prod_payment_amount_bank,
      prod_payment_amount_credit,
      prod_total_amount_purchased,
      prod_total_amount_paid,
      prod_balance_amount,
      prod_status,
      prod_gst,
      prod_tax_inclusive,
      prod_offer_available,
      prod_offer_type,
      prod_offer_amount,
      prod_offer_start,
      prod_offer_end,
    } = req.body;

    const suppId = supplier_id || prod_supplier_id;
    let supplier = null;
    if (suppId) {
      supplier = await Supplier.findById(suppId).catch(() => null);
      if (!supplier) {
        supplier = await Supplier.findOne({ $or: [{ legacyId: Number(suppId) || 0 }, { name: suppId }] });
      }
    }

    if (!supplier) {
      supplier = await Supplier.findOne({ status: 'active' });
    }

    if (!supplier) {
      const count = await Supplier.countDocuments();
      supplier = await Supplier.create({
        legacyId: count + 1,
        supplier_code: `SUP-${String(count + 1).padStart(4, '0')}`,
        name: 'Direct Sourcing',
        mobile: '9999999999',
        city: 'Swamimalai',
        state: 'Tamil Nadu',
        status: 'active',
      });
    }

    let itemsToProcess = [];
    if (Array.isArray(productsList)) {
      itemsToProcess = productsList;
    } else if (Array.isArray(req.body.ap_product_name)) {
      const names = req.body.ap_product_name;
      const cats = req.body.ap_product_category || [];
      const subcats = req.body.ap_product_subcategory || [];
      const units = req.body.ap_unit || [];
      const pieceRates = req.body.ap_piece_rate || [];
      const purchases = req.body.ap_purchase_price || [];
      const margins = req.body.ap_margin_percentage || [];
      const sellings = req.body.ap_selling_price || [];
      const gsts = req.body.ap_gst || [];
      const barcodes = req.body.ap_barcode || [];
      const ids = req.body.ap_product_id || [];

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

    if (!itemsToProcess.length) {
      return res.status(400).json({ success: false, message: 'At least one product entry is required.' });
    }

    const savedProducts = [];
    let batchPurchaseTotal = 0;

    for (const item of itemsToProcess) {
      const pName = (item.name || '').trim();
      if (!pName) {
        return res.status(400).json({ success: false, message: 'Product Name is mandatory for all products.' });
      }

      // 1. Resolve or create Category
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

      // 2. Resolve or create Subcategory
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
      batchPurchaseTotal += purchasePrice;

      // Margin & Selling Price
      const margin = parseFloat(item.margin_percentage !== undefined && item.margin_percentage !== '' ? item.margin_percentage : 60);
      let sellingPrice = parseFloat(item.selling_price || 0);
      if (pieceRate > 0) {
        sellingPrice = Math.round((pieceRate + pieceRate * (margin / 100)) * 100) / 100;
      } else if (sellingPrice <= 0 && purchasePrice > 0) {
        sellingPrice = Math.round((purchasePrice + purchasePrice * (margin / 100)) * 100) / 100;
      }

      const gst = parseFloat(item.gst || item.gst_percent || prod_gst || 12);
      const barcode = item.barcode ? item.barcode.trim() : `890${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      // Check if product already exists for this supplier
      let existingProd = null;
      if (item.product_id) {
        existingProd = await Product.findById(item.product_id);
      }
      if (!existingProd) {
        existingProd = await Product.findOne({
          $or: [
            { supplier_id: supplier.legacyId, name: { $regex: new RegExp(`^${pName}$`, 'i') } },
            { supplier_name: supplier.name, name: { $regex: new RegExp(`^${pName}$`, 'i') } },
          ]
        });
      }

      if (existingProd) {
        const prevStock = existingProd.current_stock || 0;
        const newStock = prevStock + units;

        existingProd.name = pName;
        existingProd.category_id = category.legacyId || 1;
        existingProd.category_name = category.name;
        if (subcategory) {
          existingProd.subcategory_id = subcategory.legacyId || 1;
          existingProd.subcategory_name = subcategory.name;
        }
        existingProd.piece_rate = pieceRate;
        existingProd.purchase_price = purchasePrice;
        existingProd.margin_percentage = margin;
        existingProd.selling_price = sellingPrice;
        existingProd.gst_percent = gst;
        existingProd.current_stock = newStock;
        existingProd.total_purchased_qty = (existingProd.total_purchased_qty || 0) + units;
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
        const prodCount = await Product.countDocuments();
        const sku = `SKU-${Date.now().toString().slice(-4)}${prodCount + 1}`;
        const newProd = await Product.create({
          legacyId: prodCount + 1,
          code: sku,
          sku,
          barcode,
          name: pName,
          category_id: category.legacyId || 1,
          category_name: category.name,
          subcategory_id: subcategory ? subcategory.legacyId || 1 : null,
          subcategory_name: subcategory ? subcategory.name : '',
          supplier_id: supplier.legacyId || supplier._id,
          supplier_name: supplier.name,
          brand: 'Divine Heritage',
          material: 'Brass',
          piece_rate: pieceRate,
          purchase_price: purchasePrice,
          margin_percentage: margin,
          selling_price: sellingPrice,
          gst_percent: gst,
          current_stock: units,
          total_purchased_qty: units,
          status: units > 0 ? (prod_status ? prod_status.toLowerCase() : 'active') : 'out_of_stock',
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
            notes: `Product Details entry opening stock from supplier ${supplier.name}`,
            created_by: req.user ? req.user.legacyId || 1 : 1,
          });
        }
        savedProducts.push(newProd);
      }
    }

    // 3. Update Supplier Ledger & Payments
    const totalPurchased = parseFloat(prod_total_amount_purchased) || batchPurchaseTotal;
    const cashAmt = parseFloat(prod_payment_amount_cash) || 0;
    const cardAmt = parseFloat(prod_payment_amount_card) || 0;
    const upiAmt = parseFloat(prod_payment_amount_upi) || 0;
    const bankAmt = parseFloat(prod_payment_amount_bank) || 0;
    const creditAmt = parseFloat(prod_payment_amount_credit) || 0;
    const totalPaidNow = parseFloat(prod_total_amount_paid) || (cashAmt + cardAmt + upiAmt + bankAmt + creditAmt);

    supplier.total_purchased = (supplier.total_purchased || 0) + totalPurchased;
    supplier.total_paid = (supplier.total_paid || 0) + totalPaidNow;
    supplier.balance_due = Math.max(0, supplier.total_purchased - supplier.total_paid);
    supplier.outstanding_balance = supplier.balance_due;
    supplier.payment_status = supplier.balance_due <= 0 ? 'Paid' : supplier.total_paid > 0 ? 'Partially Paid' : 'Unpaid';
    await supplier.save();

    await ActivityLog.create({
      user_id: req.user ? req.user.legacyId || 1 : 1,
      user_name: req.user ? req.user.name : 'System',
      action: 'create',
      module: 'products',
      reference_code: supplier.supplier_code || 'SUP',
      description: `Added ${savedProducts.length} product(s) under supplier ${supplier.name}`,
    });

    res.status(201).json({
      success: true,
      message: 'Product(s) added successfully!',
      data: savedProducts,
      supplier,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save products: ' + err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    await ActivityLog.create({
      user_id: req.user ? req.user.legacyId || 1 : 1,
      user_name: req.user ? req.user.name : 'System',
      action: 'delete',
      module: 'products',
      reference_code: product.sku,
      description: `Deleted product: ${product.name}`,
    });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
