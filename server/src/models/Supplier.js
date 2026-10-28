import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  supplier_code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  company_name: { type: String, default: '' },
  contact_person: { type: String, default: '' },
  mobile: { type: String, required: true },
  email: { type: String, default: '' },
  gstin: { type: String, default: '' },
  gst_number: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: 'Tamil Nadu' },
  pincode: { type: String, default: '' },
  purchase_date: { type: String, default: '' },
  total_purchased: { type: Number, default: 0 },
  total_paid: { type: Number, default: 0 },
  balance_due: { type: Number, default: 0 },
  payment_status: { type: String, enum: ['Paid', 'Partially Paid', 'Unpaid', 'paid', 'partially paid', 'unpaid'], default: 'Unpaid' },
  payment_methods: { type: String, default: 'Cash' },
  payment_amount_cash: { type: Number, default: 0 },
  payment_amount_card: { type: Number, default: 0 },
  payment_amount_upi: { type: Number, default: 0 },
  payment_amount_bank: { type: Number, default: 0 },
  payment_amount_credit: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'Active', 'Inactive'], 
    default: 'active',
    set: (v) => (v ? v.toLowerCase() : 'active')
  },
  outstanding_balance: { type: Number, default: 0 },
  products_supplied: [{ type: String }],
}, { timestamps: true });

supplierSchema.index({ name: 'text', contact_person: 'text', supplier_code: 'text' });

export default mongoose.model('Supplier', supplierSchema);
