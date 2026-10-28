import Invoice from '../models/Invoice.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';
import Account from '../models/Account.js';
import ActivityLog from '../models/ActivityLog.js';

export const getDashboardStats = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

    // Sales Aggregations
    const allInvoices = await Invoice.find({ status: { $ne: 'cancelled' } });
    
    let totalSales = 0;
    let todaySales = 0;
    let monthSales = 0;
    let totalTax = 0;
    let todayInvoicesCount = 0;

    allInvoices.forEach(inv => {
      const gTotal = Number(inv.grand_total) || 0;
      totalSales += gTotal;
      totalTax += Number(inv.tax_total) || 0;

      if (inv.invoice_date === todayStr) {
        todaySales += gTotal;
        todayInvoicesCount++;
      }
      if (inv.invoice_date >= firstDayOfMonth) {
        monthSales += gTotal;
      }
    });

    // Low stock count
    const products = await Product.find({ status: 'active' });
    let totalInventoryValue = 0;
    let lowStockProducts = [];

    products.forEach(p => {
      totalInventoryValue += (p.current_stock * p.selling_price);
      if (p.current_stock <= p.min_stock_alert) {
        lowStockProducts.push({
          id: p._id,
          sku: p.sku,
          name: p.name,
          current_stock: p.current_stock,
          min_stock_alert: p.min_stock_alert,
          selling_price: p.selling_price,
        });
      }
    });

    // Accounts balance
    const accounts = await Account.find({ status: 'active' });
    let cashBalance = 0;
    let bankBalance = 0;
    accounts.forEach(a => {
      if (a.type === 'cash') cashBalance += (Number(a.current_balance) || 0);
      if (a.type === 'bank') bankBalance += (Number(a.current_balance) || 0);
    });

    // Receivables & Payables
    const customers = await Customer.find({ status: 'active' });
    let totalReceivables = customers.reduce((sum, c) => sum + (Number(c.current_balance) || 0), 0);

    const suppliers = await Supplier.find({ status: 'active' });
    let totalPayables = suppliers.reduce((sum, s) => sum + (Number(s.balance_due) || 0), 0);

    // Recent Invoices
    const recentInvoices = await Invoice.find().sort({ createdAt: -1 }).limit(8);

    // Recent Activities
    const recentActivities = await ActivityLog.find().sort({ created_at: -1 }).limit(8);

    res.json({
      success: true,
      stats: {
        todaySales,
        todayInvoicesCount,
        monthSales,
        totalSales,
        totalTax,
        totalProducts: products.length,
        lowStockCount: lowStockProducts.length,
        lowStockProducts: lowStockProducts.slice(0, 5),
        totalInventoryValue,
        cashBalance,
        bankBalance,
        totalLiquidFunds: cashBalance + bankBalance,
        totalReceivables,
        totalPayables,
      },
      recentInvoices,
      recentActivities,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
