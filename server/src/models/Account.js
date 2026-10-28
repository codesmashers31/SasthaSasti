import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  account_code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['cash', 'bank', 'income', 'expense', 'asset', 'liability', 'equity'], 
    required: true 
  },
  bank_name: { type: String, default: null },
  account_number: { type: String, default: null },
  ifsc_code: { type: String, default: null },
  opening_balance: { type: Number, default: 0 },
  current_balance: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Account', accountSchema);
