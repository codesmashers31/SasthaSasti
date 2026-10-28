import Product from '../models/Product.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import ActivityLog from '../models/ActivityLog.js';

export const getInventory = async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.trim() : '';
    const low_stock = req.query.low_stock === 'true';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const filter = { status: 'active' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { god_name: { $regex: search, $options: 'i' } },
      ];
    }
    if (low_stock) {
      filter.$expr = { $lte: ['$current_stock', '$min_stock_alert'] };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ current_stock: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Summary calculations
    const allProducts = await Product.find({ status: 'active' });
    let totalStockUnits = 0;
    let totalStockValue = 0;
    let lowStockCount = 0;

    allProducts.forEach(p => {
      totalStockUnits += p.current_stock;
      totalStockValue += (p.current_stock * p.selling_price);
      if (p.current_stock <= p.min_stock_alert) lowStockCount++;
    });

    res.json({
      success: true,
      data: products,
      summary: {
        totalStockUnits,
        totalStockValue,
        lowStockCount,
        totalItems: allProducts.length,
      },
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

export const adjustStock = async (req, res) => {
  try {
    const { product_id, adjustment_type, quantity, notes = '' } = req.body;
    const adjQty = parseInt(quantity);
    if (!adjQty || adjQty === 0) {
      return res.status(400).json({ success: false, message: 'Valid adjustment quantity is required' });
    }

    const product = await Product.findOne({
      $or: [{ _id: product_id }, { legacyId: product_id }]
    });

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const prevStock = product.current_stock;
    let finalDelta = adjQty;
    if (['damage', 'write_off', 'reduction'].includes(adjustment_type)) {
      finalDelta = -Math.abs(adjQty);
    } else if (['addition', 'stock_in'].includes(adjustment_type)) {
      finalDelta = Math.abs(adjQty);
    }

    product.current_stock = Math.max(0, prevStock + finalDelta);
    await product.save();

    await InventoryTransaction.create({
      product_id: product.legacyId || product._id,
      product_name: product.name,
      transaction_type: adjustment_type || 'adjustment',
      quantity: finalDelta,
      previous_stock: prevStock,
      new_stock: product.current_stock,
      reference_type: 'manual_adjustment',
      reference_no: `ADJ-${Date.now().toString().slice(-6)}`,
      notes: notes || `Manual stock adjustment (${adjustment_type})`,
      created_by: req.user ? req.user.legacyId || 1 : 1,
    });

    await ActivityLog.create({
      user_id: req.user ? req.user.legacyId || 1 : 1,
      user_name: req.user ? req.user.name : 'System',
      action: 'adjust',
      module: 'inventory',
      reference_code: product.sku,
      description: `Stock adjusted for ${product.name}: ${finalDelta > 0 ? '+' : ''}${finalDelta} units (${prevStock} -> ${product.current_stock})`,
    });

    res.json({ success: true, message: 'Stock adjusted successfully', current_stock: product.current_stock });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const product_id = req.query.product_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;

    const filter = {};
    if (product_id) filter.product_id = Number(product_id);

    const total = await InventoryTransaction.countDocuments(filter);
    const transactions = await InventoryTransaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: transactions,
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
