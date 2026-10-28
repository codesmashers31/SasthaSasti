import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  user_id: { type: Number, default: null, index: true },
  user_name: { type: String, default: 'System' },
  action: { type: String, required: true },
  module: { type: String, required: true },
  reference_id: { type: Number, default: null },
  reference_code: { type: String, default: '' },
  description: { type: String, required: true },
  ip_address: { type: String, default: '' },
  user_agent: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model('ActivityLog', activityLogSchema);
