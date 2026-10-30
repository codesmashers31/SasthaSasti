import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.Mixed, index: true },
  product_name: { type: String, required: true },
  product_code: { type: String, default: '' },
  god_name: { type: String, default: '' },
  material: { type: String, default: '' },
  hsn_code: { type: String, default: '9701' },
  quantity: { type: Number, required: true, min: 1 },
  unit_price: { type: Number, required: true },
  discount_percent: { type: Number, default: 0 },
  discount_amount: { type: Number, default: 0 },
  tax_percent: { type: Number, default: 0 },
  tax_amount: { type: Number, default: 0 },
  total_amount: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  invoice_no: { type: String, required: true, unique: true },
  invoice_date: { type: String, required: true },
  invoice_time: { type: String, default: '' },
  customer_id: { type: mongoose.Schema.Types.Mixed, index: true },
  customer_name: { type: String, default: 'Anonymous User' },
  customer_mobile: { type: String, default: '' },
  customer_type: { type: String, default: 'retail' },
  subtotal: { type: Number, required: true, default: 0 },
  item_discount_total: { type: Number, default: 0 },
  overall_discount_percent: { type: Number, default: 0 },
  overall_discount_amount: { type: Number, default: 0 },
  taxable_amount: { type: Number, default: 0 },
  tax_total: { type: Number, default: 0 },
  round_off: { type: Number, default: 0 },
  grand_total: { type: Number, required: true, default: 0 },
  paid_amount: { type: Number, default: 0 },
  balance_amount: { type: Number, default: 0 },
  payment_status: { type: String, default: 'paid' },
  payment_method: { type: String, default: 'cash' },
  sales_mode: { type: String, default: 'offline' },
  account_id: { type: mongoose.Schema.Types.Mixed, default: 1 },
  notes: { type: String, default: '' },
  status: { type: String, default: 'completed' },
  created_by: { type: mongoose.Schema.Types.Mixed, default: 1 },
  created_by_name: { type: String, default: 'Admin' },
  items: [invoiceItemSchema],
}, { timestamps: true });

invoiceSchema.index({ invoice_no: 'text', customer_name: 'text', customer_mobile: 'text' });

export default mongoose.model('Invoice', invoiceSchema);
