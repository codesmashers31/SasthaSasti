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
