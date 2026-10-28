import { Expense, ExpenseCategory } from '../models/Expense.js';
import Account from '../models/Account.js';
import AccountTransaction from '../models/AccountTransaction.js';

export const getExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search ? req.query.search.trim() : '';

    const filter = {};
    if (search) {
      filter.$or = [
        { expense_no: { $regex: search, $options: 'i' } },
        { payee_name: { $regex: search, $options: 'i' } },
        { category_name: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Expense.countDocuments(filter);
    const expenses = await Expense.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: expenses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const body = req.body;
    if (!body.expense_no) {
      const count = await Expense.countDocuments();
      body.expense_no = `EXP-${Date.now().toString().slice(-4)}${count + 1}`;
    }
    body.expense_date = body.expense_date || new Date().toISOString().slice(0, 10);
    body.total_amount = Number(body.amount) + (Number(body.tax_amount) || 0);

    const expense = await Expense.create(body);

    // If auto-approved, deduct from selected account
    if (body.status === 'approved') {
      const account = await Account.findOne({
        $or: [{ _id: body.account_id }, { legacyId: body.account_id }, { type: 'cash' }]
      });
      if (account) {
        account.current_balance = (Number(account.current_balance) || 0) - expense.total_amount;
        await account.save();

        await AccountTransaction.create({
          account_id: account.legacyId || account._id,
          account_name: account.name,
          transaction_type: 'credit',
          amount: expense.total_amount,
          balance_after: account.current_balance,
          reference_type: 'expense',
          reference_no: expense.expense_no,
          description: `Operating Expense: ${expense.payee_name} - ${expense.description}`,
          transaction_date: expense.expense_date,
          created_by: req.user ? req.user.legacyId || 1 : 1,
        });
      }
    }

    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getExpenseCategories = async (req, res) => {
  try {
    const categories = await ExpenseCategory.find({ status: 'active' });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
