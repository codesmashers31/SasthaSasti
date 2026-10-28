import Invoice from '../models/Invoice.js';
import Product from '../models/Product.js';
import { Expense } from '../models/Expense.js';

export const getSalesReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const filter = { status: { $ne: 'cancelled' } };

    if (start_date && end_date) {
      filter.invoice_date = { $gte: start_date, $lte: end_date };
    }

    const invoices = await Invoice.find(filter).sort({ invoice_date: -1 });

    let totalRevenue = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    const paymentMethods = {};
    const productSales = {};

    invoices.forEach(inv => {
      totalRevenue += (Number(inv.grand_total) || 0);
      totalDiscount += (Number(inv.overall_discount_amount) || 0) + (Number(inv.item_discount_total) || 0);
      totalTax += (Number(inv.tax_total) || 0);

      const method = inv.payment_method || 'cash';
      paymentMethods[method] = (paymentMethods[method] || 0) + (Number(inv.paid_amount) || 0);

      inv.items.forEach(it => {
        if (!productSales[it.product_name]) {
          productSales[it.product_name] = { quantity: 0, revenue: 0 };
        }
        productSales[it.product_name].quantity += it.quantity;
        productSales[it.product_name].revenue += it.total_amount;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    res.json({
      success: true,
      summary: {
        totalOrders: invoices.length,
        totalRevenue,
        totalDiscount,
        totalTax,
        paymentMethods,
      },
      topProducts,
      invoices: invoices.slice(0, 50),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getInventoryReport = async (req, res) => {
  try {
    const products = await Product.find({ status: 'active' });

    let totalStockUnits = 0;
    let totalCostValuation = 0;
    let totalSellingValuation = 0;
    const materialBreakdown = {};
    const lowStockItems = [];

    products.forEach(p => {
      totalStockUnits += p.current_stock;
      totalCostValuation += (p.current_stock * p.purchase_price);
      totalSellingValuation += (p.current_stock * p.selling_price);

      const mat = p.material || 'Brass';
      materialBreakdown[mat] = (materialBreakdown[mat] || 0) + p.current_stock;

      if (p.current_stock <= p.min_stock_alert) {
        lowStockItems.push({
          id: p._id,
          sku: p.sku,
          name: p.name,
          current_stock: p.current_stock,
          min_stock_alert: p.min_stock_alert,
          selling_price: p.selling_price,
        });
      }
    });

    res.json({
      success: true,
      summary: {
        totalItems: products.length,
        totalStockUnits,
        totalCostValuation,
        totalSellingValuation,
        projectedGrossProfit: totalSellingValuation - totalCostValuation,
        lowStockCount: lowStockItems.length,
      },
      materialBreakdown,
      lowStockItems,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFinancialReport = async (req, res) => {
  try {
    const invoices = await Invoice.find({ status: { $ne: 'cancelled' } });
    const expenses = await Expense.find();

    let totalRevenue = 0;
    let costOfGoodsSold = 0;

    invoices.forEach(inv => {
      totalRevenue += (Number(inv.grand_total) || 0);
      inv.items.forEach(it => {
        // approx 60% of unit price as COGS if purchase price not stored in invoice
        costOfGoodsSold += (it.unit_price * 0.6 * it.quantity);
      });
    });

    let totalExpenses = 0;
    expenses.forEach(e => {
      totalExpenses += (Number(e.total_amount) || 0);
    });

    const grossProfit = totalRevenue - costOfGoodsSold;
    const netProfit = grossProfit - totalExpenses;
    const netMarginPercent = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    res.json({
      success: true,
      financials: {
        totalRevenue,
        costOfGoodsSold,
        grossProfit,
        totalExpenses,
        netProfit,
        netMarginPercent: Math.round(netMarginPercent * 10) / 10,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
