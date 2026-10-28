import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  payment_no: { type: String, required: true },
  payment_type: { type: String, default: 'customer' },
  customer_id: { type: mongoose.Schema.Types.Mixed, default: null, index: true },
  supplier_id: { type: mongoose.Schema.Types.Mixed, default: null, index: true },
  invoice_id: { type: mongoose.Schema.Types.Mixed, default: null },
  purchase_id: { type: mongoose.Schema.Types.Mixed, default: null },
  account_id: { type: mongoose.Schema.Types.Mixed, default: 1, index: true },
  account_name: { type: String, default: '' },
  amount: { type: Number, required: true },
  payment_method: { type: String, default: 'cash' },
  transaction_reference: { type: String, default: '' },
  payment_date: { type: String, required: true },
  notes: { type: String, default: '' },
  created_by: { type: mongoose.Schema.Types.Mixed, default: 1 },
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
