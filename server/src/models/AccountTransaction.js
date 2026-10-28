import mongoose from 'mongoose';

const accountTransactionSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  account_id: { type: mongoose.Schema.Types.Mixed, required: true, index: true },
  account_name: { type: String, default: '' },
  transaction_type: { type: String, enum: ['debit', 'credit'], required: true },
  amount: { type: Number, required: true },
  balance_after: { type: Number, required: true },
  reference_type: { type: String, default: '' },
  reference_id: { type: mongoose.Schema.Types.Mixed, default: null },
  reference_no: { type: String, default: '' },
  description: { type: String, required: true },
  transaction_date: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.Mixed, default: 1 },
}, { timestamps: true });

export default mongoose.model('AccountTransaction', accountTransactionSchema);
