import Supplier from '../models/Supplier.js';
import Product from '../models/Product.js';
import Payment from '../models/Payment.js';
import Account from '../models/Account.js';
import AccountTransaction from '../models/AccountTransaction.js';
import ActivityLog from '../models/ActivityLog.js';

export const getSuppliers = async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.trim() : '';
    const payment_status = req.query.payment_status;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const filter = { status: 'active' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contact_person: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { supplier_code: { $regex: search, $options: 'i' } },
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
      $or: [{ supplier_id: supplier.legacyId }, { supplier_name: supplier.name }]
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
    const body = req.body;
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
    const body = req.body;
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
