import Customer from '../models/Customer.js';
import Invoice from '../models/Invoice.js';

export const getCustomers = async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.trim() : '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const filter = { status: 'active' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { customer_code: { $regex: search, $options: 'i' } },
        { company_name: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Customer.countDocuments(filter);
    const customers = await Customer.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: customers,
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

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

    const invoices = await Invoice.find({
      $or: [{ customer_id: customer.legacyId }, { customer_name: customer.name }]
    }).sort({ createdAt: -1 }).limit(20);

    res.json({ success: true, data: customer, invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const body = req.body;
    if (!body.customer_code) {
      const count = await Customer.countDocuments();
      body.customer_code = `CUST-${String(count + 1).padStart(4, '0')}`;
    }

    const customer = await Customer.create(body);
    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, { status: 'inactive' }, { new: true });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, message: 'Customer marked inactive successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
