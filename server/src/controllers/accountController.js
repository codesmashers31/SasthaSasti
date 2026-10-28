import Account from '../models/Account.js';
import AccountTransaction from '../models/AccountTransaction.js';
import Payment from '../models/Payment.js';

export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ status: 'active' }).sort({ type: 1, name: 1 });
    res.json({ success: true, data: accounts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAccountLedger = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ success: false, message: 'Account not found' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;

    const filter = {
      $or: [{ account_id: account.legacyId }, { account_id: account._id }]
    };

    const total = await AccountTransaction.countDocuments(filter);
    const transactions = await AccountTransaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      account,
      data: transactions,
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

export const createAccount = async (req, res) => {
  try {
    const body = req.body;
    if (!body.account_code) {
      body.account_code = `ACC-${Date.now().toString().slice(-4)}`;
    }
    body.current_balance = body.opening_balance || 0;
    const account = await Account.create(body);
    res.status(201).json({ success: true, data: account });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const type = req.query.type;

    const filter = {};
    if (type) filter.payment_type = type;

    const total = await Payment.countDocuments(filter);
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: payments,
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

export const recordPayment = async (req, res) => {
  try {
    const { payment_type, party_name, account_id, amount, payment_method, payment_date, notes } = req.body;
    const numAmount = parseFloat(amount) || 0;
    if (numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    const paymentNo = `PAY-${Date.now().toString().slice(-6)}`;
    
    // Find account to get its name
    let accountName = 'Cash Drawer';
    if (account_id) {
      const acc = await Account.findOne({ $or: [{ _id: account_id }, { legacyId: account_id }] });
      if (acc) {
        accountName = acc.name;
        if (payment_type === 'received') {
          acc.current_balance = (acc.current_balance || 0) + numAmount;
        } else {
          acc.current_balance = (acc.current_balance || 0) - numAmount;
        }
        await acc.save();
      }
    }

    const payment = await Payment.create({
      payment_no: paymentNo,
      payment_date: payment_date || new Date(),
      payment_type: payment_type || 'received',
      party_name: party_name || (payment_type === 'received' ? 'Customer' : 'Supplier'),
      account_id: account_id || 1,
      account_name: accountName,
      amount: numAmount,
      payment_method: payment_method || 'cash',
      notes: notes || '',
    });

    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
