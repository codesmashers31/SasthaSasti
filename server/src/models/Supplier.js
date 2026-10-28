import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  supplier_code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  contact_person: { type: String, default: '' },
  mobile: { type: String, required: true },
  email: { type: String, default: '' },
  gstin: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: 'Tamil Nadu' },
  pincode: { type: String, default: '' },
  total_purchased: { type: Number, default: 0 },
  total_paid: { type: Number, default: 0 },
  balance_due: { type: Number, default: 0 },
  payment_status: { type: String, enum: ['Paid', 'Partially Paid', 'Unpaid'], default: 'Unpaid' },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  products_supplied: [{ type: String }],
}, { timestamps: true });

supplierSchema.index({ name: 'text', contact_person: 'text', supplier_code: 'text' });

export default mongoose.model('Supplier', supplierSchema);
