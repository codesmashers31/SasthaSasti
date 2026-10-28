import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  sku: { type: String, required: true, unique: true },
  barcode: { type: String, index: true },
  name: { type: String, required: true },
  god_name: { type: String, default: '', index: true },
  category_id: { type: Number, index: true },
  category_name: { type: String, default: '' },
  subcategory_id: { type: Number, index: true },
  subcategory_name: { type: String, default: '' },
  supplier_id: { type: Number, index: true },
  supplier_name: { type: String, default: '' },
  material: { type: String, default: 'Brass' },
  finish_type: { type: String, default: 'Antique' },
  height_inches: { type: Number, default: 0 },
  width_inches: { type: Number, default: 0 },
  depth_inches: { type: Number, default: 0 },
  weight_kg: { type: Number, default: 0 },
  purchase_price: { type: Number, default: 0 },
  selling_price: { type: Number, required: true, default: 0 },
  mrp: { type: Number, default: 0 },
  gst_percent: { type: Number, default: 12 },
  hsn_code: { type: String, default: '9701' },
  current_stock: { type: Number, default: 0 },
  min_stock_alert: { type: Number, default: 5 },
  location: { type: String, default: '' },
  description: { type: String, default: '' },
  images: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive', 'discontinued', 'out_of_stock'], default: 'active' },
}, { timestamps: true });

productSchema.index({ name: 'text', god_name: 'text', sku: 'text', barcode: 'text' });

export default mongoose.model('Product', productSchema);
