import Purchase from '../models/Purchase.js';
import Product from '../models/Product.js';
import Supplier from '../models/Supplier.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import ActivityLog from '../models/ActivityLog.js';

export const getPurchases = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const search = req.query.search ? req.query.search.trim() : '';

    const filter = {};
    if (search) {
      filter.$or = [
        { purchase_no: { $regex: search, $options: 'i' } },
        { supplier_name: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Purchase.countDocuments(filter);
    const purchases = await Purchase.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: purchases,
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

export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ success: false, message: 'Purchase order not found' });
    res.json({ success: true, data: purchase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createPurchase = async (req, res) => {
  try {
    const { supplier_id, purchase_date, items, notes = '', status = 'received' } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Purchase items required' });
    }

    const supplier = await Supplier.findOne({
      $or: [{ _id: supplier_id }, { legacyId: supplier_id }]
    });

    const count = await Purchase.countDocuments();
    const purchaseNo = `PO-${Date.now().toString().slice(-4)}${count + 1}`;
    let subtotal = 0;
    let taxAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const prod = await Product.findOne({
        $or: [{ _id: item.product_id }, { legacyId: item.product_id }, { sku: item.sku }]
      });

      const qty = parseInt(item.quantity) || 1;
      const price = parseFloat(item.unit_price || item.purchase_price) || (prod ? prod.purchase_price : 0);
      const taxPct = parseFloat(item.tax_percent) || 0;
      const lineTax = (qty * price * taxPct) / 100;
      const lineTotal = (qty * price) + lineTax;

      subtotal += (qty * price);
      taxAmount += lineTax;

      validatedItems.push({
        product_id: prod ? prod.legacyId || prod._id : item.product_id,
        product_name: prod ? prod.name : item.product_name,
        quantity: qty,
        unit_price: price,
        tax_percent: taxPct,
        tax_amount: lineTax,
        total_amount: lineTotal,
      });

      // If status is 'received' or 'approved', auto-restock physical inventory!
      if (['received', 'approved'].includes(status) && prod) {
        const prevStock = prod.current_stock;
        prod.current_stock += qty;
        await prod.save();

        await InventoryTransaction.create({
          product_id: prod.legacyId || prod._id,
          product_name: prod.name,
          transaction_type: 'purchase',
          quantity: qty,
          unit_price: price,
          previous_stock: prevStock,
          new_stock: prod.current_stock,
          reference_type: 'purchase_order',
          reference_no: purchaseNo,
          notes: `Intake order from ${supplier ? supplier.name : 'Artisan'}`,
          created_by: req.user ? req.user.legacyId || 1 : 1,
        });
      }
    }

    const grandTotal = subtotal + taxAmount;

    // Update supplier total purchased & balance due
    if (supplier) {
      supplier.total_purchased = (supplier.total_purchased || 0) + grandTotal;
      supplier.balance_due = (supplier.balance_due || 0) + grandTotal;
      supplier.payment_status = supplier.total_paid >= supplier.total_purchased ? 'Paid' : (supplier.total_paid > 0 ? 'Partially Paid' : 'Unpaid');
      await supplier.save();
    }

    const purchase = await Purchase.create({
      purchase_no: purchaseNo,
      supplier_id: supplier ? supplier.legacyId || supplier._id : 1,
      supplier_name: supplier ? supplier.name : 'Artisan',
      purchase_date: purchase_date || new Date().toISOString().slice(0, 10),
      subtotal,
      tax_amount: taxAmount,
      grand_total: grandTotal,
      paid_amount: 0,
      balance_amount: grandTotal,
      status,
      payment_status: 'unpaid',
      notes,
      created_by: req.user ? req.user.legacyId || 1 : 1,
      items: validatedItems,
    });

    await ActivityLog.create({
      user_id: req.user ? req.user.legacyId || 1 : 1,
      user_name: req.user ? req.user.name : 'System',
      action: 'create',
      module: 'purchases',
      reference_code: purchaseNo,
      description: `Created sourcing purchase ${purchaseNo} for ₹${grandTotal} from ${supplier ? supplier.name : 'Artisan'}`,
    });

    res.status(201).json({ success: true, message: 'Purchase order recorded & stock updated successfully', data: purchase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
