import mongoose from 'mongoose';

const inventoryTransactionSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  product_id: { type: mongoose.Schema.Types.Mixed, required: true, index: true },
  product_name: { type: String, default: '' },
  transaction_type: { 
    type: String, 
    required: true 
  },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, default: 0 },
  previous_stock: { type: Number, required: true },
  new_stock: { type: Number, required: true },
  reference_type: { type: String, default: '' },
  reference_id: { type: Number, default: null },
  reference_no: { type: String, default: '' },
  notes: { type: String, default: '' },
  created_by: { type: Number, default: 1 },
  transaction_date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('InventoryTransaction', inventoryTransactionSchema);
