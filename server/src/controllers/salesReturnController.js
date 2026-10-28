import SalesReturn from '../models/SalesReturn.js';
import Invoice from '../models/Invoice.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Account from '../models/Account.js';
import AccountTransaction from '../models/AccountTransaction.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import ActivityLog from '../models/ActivityLog.js';

export const lookupInvoice = async (req, res) => {
  try {
    const { invoiceNo } = req.params;
    if (!invoiceNo) return res.status(400).json({ success: false, message: 'Invoice number required' });

    const invoice = await Invoice.findOne({ invoice_no: invoiceNo.trim() });
    if (!invoice) {
      return res.status(404).json({ success: false, message: `Invoice #${invoiceNo} not found.` });
    }

    if (invoice.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'This invoice is already cancelled.' });
    }

    res.json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSalesReturns = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;

    const total = await SalesReturn.countDocuments();
    const returns = await SalesReturn.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: returns,
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

export const createSalesReturn = async (req, res) => {
  try {
    const { invoice_id, items, refund_method = 'cash', account_id = 1, reason = '' } = req.body;

    const invoice = await Invoice.findOne({
      $or: [{ _id: invoice_id }, { invoice_no: invoice_id }]
    });

    if (!invoice) return res.status(404).json({ success: false, message: 'Original invoice not found' });

    const count = await SalesReturn.countDocuments();
    const returnNo = `RET-${Date.now().toString().slice(-4)}${count + 1}`;
    let totalRefund = 0;
    const validatedItems = [];

    for (const item of items) {
      const returnQty = parseInt(item.return_quantity) || 0;
      if (returnQty <= 0) continue;

      const unitPrice = parseFloat(item.unit_price) || 0;
      const refundAmt = returnQty * unitPrice;
      totalRefund += refundAmt;

      validatedItems.push({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: returnQty,
        unit_price: unitPrice,
        tax_percent: item.tax_percent || 0,
        refund_amount: refundAmt,
      });

      // Restock physical showroom inventory
      const prod = await Product.findOne({
        $or: [{ _id: item.product_id }, { legacyId: item.product_id }, { name: item.product_name }]
      });

      if (prod) {
        const prevStock = prod.current_stock;
        prod.current_stock += returnQty;
        await prod.save();

        await InventoryTransaction.create({
          product_id: prod.legacyId || prod._id,
          product_name: prod.name,
          transaction_type: 'return',
          quantity: returnQty,
          previous_stock: prevStock,
          new_stock: prod.current_stock,
          reference_type: 'sales_return',
          reference_no: returnNo,
          notes: `Sales return against #${invoice.invoice_no}: ${reason}`,
          created_by: req.user ? req.user.legacyId || 1 : 1,
        });
      }
    }

    if (!validatedItems.length) {
      return res.status(400).json({ success: false, message: 'Please select at least one item and quantity to return.' });
    }

    // Record refund disbursement from Cash/Bank Account if cash/bank refund
    if (totalRefund > 0 && ['cash', 'bank', 'upi'].includes(refund_method)) {
      const account = await Account.findOne({
        $or: [{ _id: account_id }, { legacyId: account_id }, { type: 'cash' }]
      });
      if (account) {
        account.current_balance = (Number(account.current_balance) || 0) - totalRefund;
        await account.save();

        await AccountTransaction.create({
          account_id: account.legacyId || account._id,
          account_name: account.name,
          transaction_type: 'credit',
          amount: totalRefund,
          balance_after: account.current_balance,
          reference_type: 'sales_return',
          reference_no: returnNo,
          description: `Customer refund for returned idols (Bill #${invoice.invoice_no})`,
          transaction_date: new Date().toISOString().slice(0, 10),
          created_by: req.user ? req.user.legacyId || 1 : 1,
        });
      }
    }

    const salesReturn = await SalesReturn.create({
      return_no: returnNo,
      invoice_id: invoice.legacyId || invoice._id,
      invoice_no: invoice.invoice_no,
      customer_id: invoice.customer_id,
      customer_name: invoice.customer_name,
      return_date: new Date().toISOString().slice(0, 10),
      refund_amount: totalRefund,
      refund_method,
      account_id: account_id || 1,
      reason,
      status: 'completed',
      created_by: req.user ? req.user.legacyId || 1 : 1,
      items: validatedItems,
    });

    await ActivityLog.create({
      user_id: req.user ? req.user.legacyId || 1 : 1,
      user_name: req.user ? req.user.name : 'System',
      action: 'create',
      module: 'sales_return',
      reference_code: returnNo,
      description: `Processed return ${returnNo} for invoice ${invoice.invoice_no} (Refund: ₹${totalRefund})`,
    });

    res.status(201).json({ success: true, message: 'Sales return processed successfully & stock restocked!', data: salesReturn });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
