import mongoose from 'mongoose';

const purchaseItemSchema = new mongoose.Schema({
  product_id: { type: Number, index: true },
  product_name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit_price: { type: Number, required: true },
  tax_percent: { type: Number, default: 0 },
  tax_amount: { type: Number, default: 0 },
  total_amount: { type: Number, required: true },
});

const purchaseSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  purchase_no: { type: String, required: true, unique: true },
  supplier_id: { type: Number, required: true, index: true },
  supplier_name: { type: String, default: '' },
  purchase_date: { type: String, required: true },
  subtotal: { type: Number, required: true, default: 0 },
  tax_amount: { type: Number, default: 0 },
  grand_total: { type: Number, required: true, default: 0 },
  paid_amount: { type: Number, default: 0 },
  balance_amount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'cancelled'], default: 'pending' },
  payment_status: { type: String, enum: ['paid', 'partial', 'unpaid'], default: 'unpaid' },
  notes: { type: String, default: '' },
  created_by: { type: Number, default: 1 },
  items: [purchaseItemSchema],
}, { timestamps: true });

export default mongoose.model('Purchase', purchaseSchema);
