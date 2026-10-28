import mongoose from 'mongoose';

const salesReturnItemSchema = new mongoose.Schema({
  product_id: { type: Number, index: true },
  product_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true },
  tax_percent: { type: Number, default: 0 },
  refund_amount: { type: Number, required: true },
});

const salesReturnSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  return_no: { type: String, required: true, unique: true },
  invoice_id: { type: Number, required: true, index: true },
  invoice_no: { type: String, required: true },
  customer_id: { type: Number, default: null },
  customer_name: { type: String, default: '' },
  return_date: { type: String, required: true },
  subtotal: { type: Number, default: 0 },
  tax_total: { type: Number, default: 0 },
  refund_amount: { type: Number, required: true },
  refund_method: { type: String, default: 'cash' },
  account_id: { type: Number, default: 1 },
  reason: { type: String, default: '' },
  status: { type: String, enum: ['completed', 'cancelled'], default: 'completed' },
  created_by: { type: Number, default: 1 },
  items: [salesReturnItemSchema],
}, { timestamps: true });

export default mongoose.model('SalesReturn', salesReturnSchema);
