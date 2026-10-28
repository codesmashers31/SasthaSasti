import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  customer_code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  company_name: { type: String, default: '' },
  email: { type: String, default: '' },
  mobile: { type: String, required: true, index: true },
  gstin: { type: String, default: '' },
  address_line1: { type: String, default: '' },
  address_line2: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: 'Tamil Nadu' },
  pincode: { type: String, default: '' },
  customer_type: { type: String, default: 'retail' },
  credit_limit: { type: Number, default: 0 },
  opening_balance: { type: Number, default: 0 },
  current_balance: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

customerSchema.index({ name: 'text', mobile: 'text', customer_code: 'text' });

export default mongoose.model('Customer', customerSchema);
