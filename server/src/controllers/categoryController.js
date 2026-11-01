import mongoose from 'mongoose';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: 'active' }).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.code) {
      body.code = `CAT-${(body.name || 'GEN').slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    }
    const cat = await Category.create(body);
    res.status(201).json({ success: true, data: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    
    // Also update category_name across subcategories if name changed
    if (req.body.name) {
      await SubCategory.updateMany(
        { $or: [{ category_id: cat._id }, { category_id: cat._id.toString() }, { category_id: cat.legacyId }] },
        { category_name: req.body.name }
      );
    }
    
    res.json({ success: true, data: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    
    await Category.findByIdAndUpdate(req.params.id, { status: 'inactive' });
    // Also inactivate associated subcategories
    await SubCategory.updateMany(
      { $or: [{ category_id: cat._id }, { category_id: cat._id.toString() }, { category_id: cat.legacyId }] },
      { status: 'inactive' }
    );
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSubCategories = async (req, res) => {
  try {
    const category_id = req.query.category_id;
    const filter = { status: 'active' };

    if (category_id) {
      const num = Number(category_id);
      if (!isNaN(num) && String(num) === String(category_id)) {
        filter.$or = [{ category_id: num }, { category_id: String(category_id) }];
      } else {
        filter.category_id = category_id;
      }
    }

    const subcats = await SubCategory.find(filter).sort({ name: 1 });
    res.json({ success: true, data: subcats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createSubCategory = async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.code) {
      body.code = `SUB-${(body.name || 'GEN').slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    }

    // Auto-resolve category_name if not provided
    if (!body.category_name && body.category_id) {
      let cat = null;
      if (mongoose.Types.ObjectId.isValid(body.category_id)) {
        cat = await Category.findById(body.category_id);
      }
      if (!cat) {
        cat = await Category.findOne({ $or: [{ legacyId: body.category_id }, { _id: body.category_id }] });
      }
      if (cat) {
        body.category_name = cat.name;
      }
    }

    const subcat = await SubCategory.create(body);
    res.status(201).json({ success: true, data: subcat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.category_id && !body.category_name) {
      let cat = null;
      if (mongoose.Types.ObjectId.isValid(body.category_id)) {
        cat = await Category.findById(body.category_id);
      }
      if (!cat) {
        cat = await Category.findOne({ $or: [{ legacyId: body.category_id }, { _id: body.category_id }] });
      }
      if (cat) {
        body.category_name = cat.name;
      }
    }

    const subcat = await SubCategory.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!subcat) return res.status(404).json({ success: false, message: 'Subcategory not found' });
    res.json({ success: true, data: subcat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    const subcat = await SubCategory.findByIdAndUpdate(req.params.id, { status: 'inactive' }, { new: true });
    if (!subcat) return res.status(404).json({ success: false, message: 'Subcategory not found' });
    res.json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
