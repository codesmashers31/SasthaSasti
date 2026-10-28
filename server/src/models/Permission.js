import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  module: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Permission', permissionSchema);
