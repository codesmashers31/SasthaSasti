import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  category_id: { type: Number, index: true },
  category_name: { type: String, default: '' },
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('SubCategory', subCategorySchema);
