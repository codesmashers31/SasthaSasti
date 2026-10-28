import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Department', departmentSchema);
