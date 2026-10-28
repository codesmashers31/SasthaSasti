import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  is_system: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  permissions: [{ type: String }], // Array of permission slugs
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);
