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
    const body = req.body;
    if (!body.code) {
      body.code = `CAT-${body.name.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
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
    res.json({ success: true, data: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { status: 'inactive' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSubCategories = async (req, res) => {
  try {
    const category_id = req.query.category_id;
    const filter = { status: 'active' };
    if (category_id) filter.category_id = Number(category_id);

    const subcats = await SubCategory.find(filter).sort({ name: 1 });
    res.json({ success: true, data: subcats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createSubCategory = async (req, res) => {
  try {
    const body = req.body;
    if (!body.code) {
      body.code = `SUB-${body.name.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    }
    const subcat = await SubCategory.create(body);
    res.status(201).json({ success: true, data: subcat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
