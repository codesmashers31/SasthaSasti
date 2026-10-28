import mongoose from 'mongoose';

const expenseCategorySchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const ExpenseCategory = mongoose.model('ExpenseCategory', expenseCategorySchema);

const expenseSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true },
  expense_no: { type: String, required: true, unique: true },
  expense_date: { type: String, required: true },
  category_id: { type: Number, default: null },
  category_name: { type: String, default: '' },
  account_id: { type: Number, default: 1 },
  amount: { type: Number, required: true },
  tax_amount: { type: Number, default: 0 },
  total_amount: { type: Number, required: true },
  payee_name: { type: String, required: true },
  payment_method: { type: String, default: 'cash' },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending' },
  reference_no: { type: String, default: '' },
  description: { type: String, default: '' },
  created_by: { type: Number, default: 1 },
  approved_by: { type: Number, default: null },
}, { timestamps: true });

export const Expense = mongoose.model('Expense', expenseSchema);
