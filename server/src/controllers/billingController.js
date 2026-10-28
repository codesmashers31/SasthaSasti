import mongoose from 'mongoose';
import Invoice from '../models/Invoice.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Account from '../models/Account.js';
import AccountTransaction from '../models/AccountTransaction.js';
import Payment from '../models/Payment.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import ActivityLog from '../models/ActivityLog.js';

export const checkout = async (req, res) => {
  try {
    const {
      customer_id,
      customer_name,
      customer_mobile,
      items,
      overall_discount_percent = 0,
      overall_discount_amount = 0,
      bill_gst_percent = null,
      payment_method = 'cash',
      account_id = 1,
      paid_amount = 0,
      notes = '',
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Billing cart is empty. Please add items.' });
    }

    // Customer handling
    let finalCustomerName = customer_name ? customer_name.trim() : 'Walk-in Retail Customer';
    let finalCustomerMobile = customer_mobile ? customer_mobile.trim() : '';
    let customerDoc = null;

    const isMongoId = (id) => typeof id === 'string' && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);

    if (customer_id) {
      if (isMongoId(customer_id)) {
        customerDoc = await Customer.findById(customer_id);
      } else if (!isNaN(customer_id)) {
        customerDoc = await Customer.findOne({ legacyId: Number(customer_id) });
      }
    } else if (finalCustomerMobile) {
      customerDoc = await Customer.findOne({ mobile: finalCustomerMobile });
    }

    if (!customerDoc) {
      const custCount = await Customer.countDocuments();
      const custCode = `CUST-${String(custCount + 1).padStart(4, '0')}`;
      customerDoc = await Customer.create({
        customer_code: custCode,
        name: finalCustomerName,
        mobile: finalCustomerMobile || '0000000000',
        customer_type: 'retail',
        status: 'active',
      });
    }

    // Generate Invoice Number
    const count = await Invoice.countDocuments();
    const invoiceNo = `DIVYA-${1000 + count + 1}`;
    const today = new Date().toISOString().slice(0, 10);
    const nowTime = new Date().toTimeString().slice(0, 8);

    let subtotal = 0;
    let itemDiscountTotal = 0;
    let taxTotal = 0;
    const validatedItems = [];

    const hasBillGst = (bill_gst_percent !== null && bill_gst_percent !== '' && !isNaN(bill_gst_percent));

    for (const item of items) {
      let prod = null;
      if (item.product_id && isMongoId(item.product_id)) {
        prod = await Product.findById(item.product_id);
      } else if (item.product_id && !isNaN(item.product_id)) {
        prod = await Product.findOne({ legacyId: Number(item.product_id) });
      } else if (item.sku) {
        prod = await Product.findOne({ sku: item.sku });
      }

      if (!prod) continue;

      const qty = parseInt(item.quantity) || 1;
      const unitPrice = parseFloat(item.unit_price) || prod.selling_price;
      const itemDiscPct = parseFloat(item.discount_percent) || 0;

      const gross = qty * unitPrice;
      const discAmt = (gross * itemDiscPct) / 100;
      const netItem = gross - discAmt;

      // Tax priority: Bill-level > Item-level > Product-level > Default 12%
      let taxPct = 12;
      if (hasBillGst) {
        taxPct = parseFloat(bill_gst_percent);
      } else if (item.tax_percent !== undefined && item.tax_percent !== '') {
        taxPct = parseFloat(item.tax_percent);
      } else {
        taxPct = prod.gst_percent || 12;
      }

      const taxAmt = Math.round(((netItem * taxPct) / 100) * 100) / 100;
      const itemTotal = netItem + taxAmt;

      subtotal += gross;
      itemDiscountTotal += discAmt;
      taxTotal += taxAmt;

      validatedItems.push({
        product_id: prod.legacyId || prod._id,
        product_name: prod.name,
        product_code: prod.sku,
        god_name: prod.god_name,
        material: prod.material,
        hsn_code: prod.hsn_code || '9701',
        quantity: qty,
        unit_price: unitPrice,
        discount_percent: itemDiscPct,
        discount_amount: discAmt,
        tax_percent: taxPct,
        tax_amount: taxAmt,
        total_amount: itemTotal,
      });

      // Stock deduction & ledger
      const prevStock = prod.current_stock;
      prod.current_stock = Math.max(0, prod.current_stock - qty);
      await prod.save();

      await InventoryTransaction.create({
        product_id: prod.legacyId || prod._id,
        product_name: prod.name,
        transaction_type: 'sale',
        quantity: -qty,
        previous_stock: prevStock,
        new_stock: prod.current_stock,
        reference_type: 'invoice',
        reference_no: invoiceNo,
        notes: `POS Sale invoice #${invoiceNo}`,
        created_by: req.user ? req.user.legacyId || 1 : 1,
      });
    }

    // Bill-level discount calculation
    const netSubtotalForDisc = Math.max(0, subtotal - itemDiscountTotal);
    let finalDiscountAmount = parseFloat(overall_discount_amount) || 0;
    let finalDiscountPercent = parseFloat(overall_discount_percent) || 0;

    if (finalDiscountAmount > 0) {
      finalDiscountPercent = netSubtotalForDisc > 0 ? (finalDiscountAmount / netSubtotalForDisc) * 100 : 0;
    } else if (finalDiscountPercent > 0) {
      finalDiscountAmount = (netSubtotalForDisc * finalDiscountPercent) / 100;
    }

    const rawTotal = (subtotal - itemDiscountTotal - finalDiscountAmount) + taxTotal;
    const grandTotal = Math.round(rawTotal);
    const roundOff = Math.round((grandTotal - rawTotal) * 100) / 100;

    const actualPaid = parseFloat(paid_amount) || grandTotal;
    const balanceAmount = Math.max(0, grandTotal - actualPaid);
    const paymentStatus = balanceAmount === 0 ? 'paid' : (actualPaid > 0 ? 'partial' : 'unpaid');

    const invoice = await Invoice.create({
      invoice_no: invoiceNo,
      invoice_date: today,
      invoice_time: nowTime,
      customer_id: customerDoc.legacyId || customerDoc._id,
      customer_name: customerDoc.name,
      customer_mobile: customerDoc.mobile,
      customer_type: customerDoc.customer_type,
      subtotal,
      item_discount_total: itemDiscountTotal,
      overall_discount_percent: finalDiscountPercent,
      overall_discount_amount: finalDiscountAmount,
      taxable_amount: netSubtotalForDisc - finalDiscountAmount,
      tax_total: taxTotal,
      round_off: roundOff,
      grand_total: grandTotal,
      paid_amount: actualPaid,
      balance_amount: balanceAmount,
      payment_status: paymentStatus,
      payment_method,
      account_id: account_id || 1,
      notes,
      status: 'completed',
      created_by: req.user ? req.user.legacyId || 1 : 1,
      created_by_name: req.user ? req.user.name : 'Billing Staff',
      items: validatedItems,
    });

    // Account transaction & Payment recording if paid > 0
    if (actualPaid > 0) {
      let account = null;
      if (account_id && isMongoId(account_id)) {
        account = await Account.findById(account_id);
      } else if (account_id && !isNaN(account_id)) {
        account = await Account.findOne({ legacyId: Number(account_id) });
      }
      if (!account) {
        account = await Account.findOne({ type: payment_method === 'cash' ? 'cash' : 'bank' });
      }

      if (account) {
        account.current_balance = (Number(account.current_balance) || 0) + actualPaid;
        await account.save();

        await AccountTransaction.create({
          account_id: account.legacyId || account._id,
          account_name: account.name,
          transaction_type: 'debit',
          amount: actualPaid,
          balance_after: account.current_balance,
          reference_type: 'invoice',
          reference_no: invoiceNo,
          description: `Sales receipt ${invoiceNo} (${customerDoc.name})`,
          transaction_date: today,
          created_by: req.user ? req.user.legacyId || 1 : 1,
        });
      }

      await Payment.create({
        payment_no: `PAY-${Date.now().toString().slice(-6)}`,
        payment_type: 'customer',
        customer_id: customerDoc.legacyId || customerDoc._id,
        invoice_id: invoice._id,
        account_id: account ? account.legacyId || account._id : 1,
        amount: actualPaid,
        payment_method,
        payment_date: today,
        notes: `POS receipt for ${invoiceNo}`,
        created_by: req.user ? req.user.legacyId || 1 : 1,
      });
    }

    // Customer balance update if credit / outstanding balance
    if (balanceAmount > 0) {
      customerDoc.current_balance = (customerDoc.current_balance || 0) + balanceAmount;
      await customerDoc.save();
    }

    // WhatsApp Message URL creation
    const cleanPhone = customerDoc.mobile.replace(/\D/g, '');
    let whatsappUrl = null;
    if (cleanPhone && cleanPhone.length >= 10) {
      const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone.slice(-10)}`;
      const message = `🙏 *Divya Murti - Sacred God Statues*\nThank you for your purchase, *${customerDoc.name}*!\n\n🧾 *Invoice:* ${invoiceNo}\n📅 *Date:* ${today}\n💰 *Total Amount:* ₹${grandTotal.toLocaleString('en-IN')}\n💳 *Paid:* ₹${actualPaid.toLocaleString('en-IN')}\n${balanceAmount > 0 ? `⚠️ *Due Balance:* ₹${balanceAmount.toLocaleString('en-IN')}\n` : ''}\nMay divine blessings be with you and your family! ✨`;
      whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    }

    await ActivityLog.create({
      user_id: req.user ? req.user.legacyId || 1 : 1,
      user_name: req.user ? req.user.name : 'Billing Staff',
      action: 'create',
      module: 'billing',
      reference_code: invoiceNo,
      description: `Generated POS bill ${invoiceNo} for ₹${grandTotal} (${customerDoc.name})`,
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully!',
      invoice,
      whatsappUrl,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);
    const search = req.query.search ? req.query.search.trim() : '';
    const status = req.query.status;
    const payment_status = req.query.payment_status;
    const sales_mode = req.query.sales_mode;
    const payment_method = req.query.payment_method;
    const start_date = req.query.start_date || req.query.date_from;
    const end_date = req.query.end_date || req.query.date_to;

    const filter = {};
    if (search) {
      filter.$or = [
        { invoice_no: { $regex: search, $options: 'i' } },
        { customer_name: { $regex: search, $options: 'i' } },
        { customer_mobile: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) filter.status = status;
    if (payment_status) filter.payment_status = payment_status;
    if (sales_mode) filter.sales_mode = sales_mode;
    if (payment_method) filter.payment_method = payment_method;
    if (start_date && end_date) {
      filter.invoice_date = { $gte: start_date, $lte: end_date };
    } else if (start_date) {
      filter.invoice_date = { $gte: start_date };
    } else if (end_date) {
      filter.invoice_date = { $lte: end_date };
    }

    const total = await Invoice.countDocuments(filter);
    const invoices = await Invoice.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Compute KPI metrics across the matched filter
    const summaryAgg = await Invoice.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total_sales: { $sum: '$grand_total' },
          total_paid: { $sum: '$paid_amount' },
          total_count: { $sum: 1 },
          paid_count: {
            $sum: {
              $cond: [{ $gte: ['$paid_amount', '$grand_total'] }, 1, 0]
            }
          },
          due_count: {
            $sum: {
              $cond: [{ $lt: ['$paid_amount', '$grand_total'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const metrics = summaryAgg.length > 0 ? {
      total_sales: summaryAgg[0].total_sales || 0,
      total_paid: summaryAgg[0].total_paid || 0,
      total_due: Math.max(0, (summaryAgg[0].total_sales || 0) - (summaryAgg[0].total_paid || 0)),
      total_invoices: summaryAgg[0].total_count || 0,
      paid_count: summaryAgg[0].paid_count || 0,
      due_count: summaryAgg[0].due_count || 0
    } : {
      total_sales: 0,
      total_paid: 0,
      total_due: 0,
      total_invoices: 0,
      paid_count: 0,
      due_count: 0
    };

    res.json({
      success: true,
      data: invoices,
      metrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const cancelInvoice = async (req, res) => {
  try {
    const { reason = 'Customer request' } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    if (invoice.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Invoice is already cancelled' });
    }

    // Revert inventory
    for (const item of invoice.items) {
      const prod = await Product.findOne({
        $or: [{ legacyId: item.product_id }, { name: item.product_name }]
      });
      if (prod) {
        const prevStock = prod.current_stock;
        prod.current_stock += item.quantity;
        await prod.save();

        await InventoryTransaction.create({
          product_id: prod.legacyId || prod._id,
          product_name: prod.name,
          transaction_type: 'adjustment',
          quantity: item.quantity,
          previous_stock: prevStock,
          new_stock: prod.current_stock,
          reference_type: 'invoice_cancellation',
          reference_no: invoice.invoice_no,
          notes: `Restored stock from cancelled invoice ${invoice.invoice_no}`,
          created_by: req.user ? req.user.legacyId || 1 : 1,
        });
      }
    }

    invoice.status = 'cancelled';
    invoice.notes = invoice.notes ? `${invoice.notes} | Cancelled: ${reason}` : `Cancelled: ${reason}`;
    await invoice.save();

    await ActivityLog.create({
      user_id: req.user ? req.user.legacyId || 1 : 1,
      user_name: req.user ? req.user.name : 'System',
      action: 'cancel',
      module: 'billing',
      reference_code: invoice.invoice_no,
      description: `Cancelled invoice ${invoice.invoice_no}: ${reason}`,
    });

    res.json({ success: true, message: 'Invoice cancelled successfully and stock restored' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
