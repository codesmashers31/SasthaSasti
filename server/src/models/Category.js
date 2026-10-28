import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  image: { type: String, default: null },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
