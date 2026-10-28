import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('today');

  // Today's formatted string in YYYY-MM-DD
  const getTodayISO = () => new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(getTodayISO());
  const [endDate, setEndDate] = useState(getTodayISO());

  const [stats, setStats] = useState({
    todaySales: 0,
    todayInvoicesCount: 0,
    monthSales: 123007.0,
    monthInvoicesCount: 18,
    monthName: 'October 2026',
    totalSales: 314980.0,
    totalInvoices: 35,
    stockValuationRetail: 3097134.68,
    totalProducts: 39,
    totalStockUnits: 446,
    productSourcingInvestment: 57666300.0,
    expectedProfit: 49306.64,
    achievedPercent: 98.6,
    targetGoal: 50000.0,
    targetDateRange: '30 Sep - 30 Oct 2026',
    remainingToGoal: 693.36,
    billedSalesMonth: 120806.64,
    billedBillsMonth: 13,
    onlineSales: 0.0,
    onlineOrdersCount: 0,
    onlinePercent: 0,
    periodSales: 0,
    periodInvoicesCount: 0,
  });

  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
  }, [period]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/dashboard/stats?period=${period}&start_date=${startDate}&end_date=${endDate}`
      );
      if (res && res.stats) {
        setStats((prev) => ({
          ...prev,
          todaySales: res.stats.todaySales ?? prev.todaySales,
          todayInvoicesCount: res.stats.todayInvoicesCount ?? prev.todayInvoicesCount,
          monthSales: res.stats.monthSales ?? prev.monthSales,
          monthInvoicesCount: res.stats.monthInvoicesCount ?? prev.monthInvoicesCount,
          monthName: res.stats.monthName ?? prev.monthName,
          totalSales: res.stats.totalSales ?? prev.totalSales,
          totalInvoices: res.stats.totalInvoices ?? prev.totalInvoices,
          stockValuationRetail: res.stats.stockValuationRetail ?? prev.stockValuationRetail,
          totalProducts: res.stats.totalProducts ?? prev.totalProducts,
          totalStockUnits: res.stats.totalStockUnits ?? prev.totalStockUnits,
          productSourcingInvestment:
            res.stats.productSourcingInvestment ?? prev.productSourcingInvestment,
          expectedProfit: res.stats.expectedProfit ?? prev.expectedProfit,
          achievedPercent: res.stats.achievedPercent ?? prev.achievedPercent,
          targetGoal: res.stats.targetGoal ?? prev.targetGoal,
          remainingToGoal: res.stats.remainingToGoal ?? prev.remainingToGoal,
          billedSalesMonth: res.stats.billedSalesMonth ?? prev.billedSalesMonth,
          billedBillsMonth: res.stats.billedBillsMonth ?? prev.billedBillsMonth,
          onlineSales: res.stats.onlineSales ?? prev.onlineSales,
          onlineOrdersCount: res.stats.onlineOrdersCount ?? prev.onlineOrdersCount,
          onlinePercent: res.stats.onlinePercent ?? prev.onlinePercent,
          periodSales: res.stats.periodSales ?? prev.periodSales,
          periodInvoicesCount: res.stats.periodInvoicesCount ?? prev.periodInvoicesCount,
        }));
        if (res.recentInvoices) setRecentInvoices(res.recentInvoices);
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (p) => {
    setPeriod(p);
    const today = new Date();
    if (p === 'today') {
      const dStr = today.toISOString().split('T')[0];
      setStartDate(dStr);
      setEndDate(dStr);
    } else if (p === 'week') {
      const prevWeek = new Date();
      prevWeek.setDate(today.getDate() - 7);
      setStartDate(prevWeek.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (p === 'month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    }
  };

  const applyCustomFilter = (e) => {
    e.preventDefault();
    setPeriod('custom');
    fetchDashboardStats();
  };

  // Human-readable date string for Active View
  const getActiveViewTitle = () => {
    if (period === 'today') return "Today's Sales";
    if (period === 'week') return 'Weekly Sales (Last 7 Days)';
    if (period === 'month') return 'Monthly Sales';
    return 'Custom Filter Sales';
  };

  const getActiveViewDateStr = () => {
    const d = new Date();
    const dayName = d.toLocaleDateString('en-IN', { weekday: 'long' });
    const day = d.getDate();
    const month = d.toLocaleDateString('en-IN', { month: 'short' });
    const year = d.getFullYear();
    return `${dayName}, ${day < 10 ? '0' + day : day} ${month} ${year}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* 1. Top Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Welcome, {user?.name || 'Shree Mahadev (System Master)'}
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#fef3c7] text-[#92400e] border border-amber-200/80 shadow-2xs">
              {user?.role_name || user?.role_slug || 'Super Admin'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Live business performance, inventory investment, margins, and sales metrics
          </p>
        </div>

        <div className="shrink-0">
          <Link
            to="/pos"
            className="bg-[#c26700] hover:bg-[#b05d00] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <i className="fas fa-cash-register"></i>
            <span>Open POS Terminal (F2)</span>
          </Link>
        </div>
      </div>

      {/* 2. Date Filter Bar Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left Filter Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <i className="fas fa-calendar-alt text-amber-600"></i> DATE FILTER:
          </span>
          <button
            type="button"
            onClick={() => handlePeriodChange('today')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              period === 'today'
                ? 'bg-[#d97706] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <i className="fas fa-cog text-[11px]"></i> Today
          </button>
          <button
            type="button"
            onClick={() => handlePeriodChange('week')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              period === 'week'
                ? 'bg-[#d97706] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <i className="fas fa-calendar-week text-[11px]"></i> Weekly (7 Days)
          </button>
          <button
            type="button"
            onClick={() => handlePeriodChange('month')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              period === 'month'
                ? 'bg-[#d97706] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <i className="fas fa-calendar text-[11px]"></i> Monthly
          </button>
        </div>

        {/* Right Date Range Inputs & Filter Button */}
        <form onSubmit={applyCustomFilter} className="flex items-center gap-2 flex-wrap justify-end">
          <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase">FROM:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-mono font-bold outline-none cursor-pointer"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase">TO:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-mono font-bold outline-none cursor-pointer"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <i className="fas fa-filter text-[10px]"></i> Filter
          </button>
        </form>
      </div>

      {/* 3. Active View Status Line */}
      <div className="flex items-center gap-2 text-xs text-slate-600 px-1 font-medium">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>
          Active View: <strong className="text-slate-900 font-bold">{getActiveViewTitle()}</strong>{' '}
          <span className="text-[#92400e] font-bold font-mono">({getActiveViewDateStr()})</span>
        </span>
      </div>

      {/* 4. Row 1: 4 Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Sales */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              TODAY'S SALES
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center text-xs">
              <i className="fas fa-coins"></i>
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            ₹{stats.todaySales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 font-medium">
            <span>{stats.todayInvoicesCount} invoices</span>
            <span className="text-amber-600 font-bold font-mono">Live Billed</span>
          </div>
        </div>

        {/* Card 2: This Month Sales */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-blue-400 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              THIS MONTH SALES
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center text-xs">
              <i className="fas fa-chart-line"></i>
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            ₹{stats.monthSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 font-medium">
            <span>{stats.monthInvoicesCount} orders this month</span>
            <span className="text-blue-600 font-bold">{stats.monthName || 'October 2026'}</span>
          </div>
        </div>

        {/* Card 3: Overall Sales */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-400 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              OVERALL SALES
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 flex items-center justify-center text-xs">
              <i className="fas fa-award"></i>
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            ₹{stats.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 font-medium">
            <span>{stats.totalInvoices} total sales bills</span>
            <span className="text-indigo-600 font-bold">Lifetime Turnover</span>
          </div>
        </div>

        {/* Card 4: Stock Valuation (Retail) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              STOCK VALUATION (RETAIL)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center text-xs">
              <i className="fas fa-gem"></i>
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            ₹{stats.stockValuationRetail.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 font-medium">
            <span>{stats.totalProducts} active items</span>
            <span className="text-emerald-600 font-bold">{stats.totalStockUnits} in stock</span>
          </div>
        </div>
      </div>

      {/* 5. Row 2: 3 Wide Cards (Product Sourcing, Expected Profit & Online Sales) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Card 1: Product Sourcing Investment */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-600">
                <i className="fas fa-seedling text-emerald-600"></i>
                <span>PRODUCT SOURCING INVESTMENT</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                Original Buy Cost
              </span>
            </div>
            <h3 className="text-2xl font-black text-emerald-700 font-mono tracking-tight my-2">
              ₹{stats.productSourcingInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Total purchase cost invested to buy and source all stocked products from artisans and suppliers.
            </p>
          </div>
        </div>

        {/* Card 2: Expected Inventory Profit */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                <i className="fas fa-bullseye text-blue-600"></i>
                <span>EXPECTED INVENTORY PROFIT</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const val = prompt('Enter Target Goal (₹):', stats.targetGoal);
                  if (val && !isNaN(val)) {
                    const newGoal = parseFloat(val);
                    const newRem = Math.max(0, newGoal - stats.expectedProfit);
                    const newAch = Math.round((stats.expectedProfit / newGoal) * 1000) / 10;
                    setStats((prev) => ({
                      ...prev,
                      targetGoal: newGoal,
                      remainingToGoal: newRem,
                      achievedPercent: newAch,
                    }));
                  }
                }}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
              >
                <i className="fas fa-edit text-[10px]"></i> Edit Target
              </button>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-2xl font-black text-blue-600 font-mono tracking-tight">
                ₹{stats.expectedProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                {stats.achievedPercent}% Achieved
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-1.5">
              <span>Target Goal: ₹{stats.targetGoal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              <span className="bg-slate-100 text-slate-500 text-[10px] font-mono px-2 py-0.5 rounded-md">
                {stats.targetDateRange || '30 Sep - 30 Oct 2026'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.achievedPercent)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-3">
              <span>Remaining to Goal:</span>
              <span className="text-amber-600 font-bold font-mono">
                ₹{stats.remainingToGoal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1.5">
              <i className="fas fa-shopping-cart text-slate-400"></i>
              <span>
                Billed Sales: <strong>₹{stats.billedSalesMonth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong> ({stats.billedBillsMonth} bills)
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                const add = prompt('Adjust target goal or extra profit addition:');
                if (add && !isNaN(add)) {
                  setStats((prev) => ({
                    ...prev,
                    expectedProfit: prev.expectedProfit + parseFloat(add),
                  }));
                }
              }}
              className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <i className="fas fa-cog text-[10px]"></i> Adjust
            </button>
          </div>
        </div>

        {/* Card 3: Online Sales */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                <i className="fas fa-globe text-blue-500"></i>
                <span>ONLINE SALES</span>
              </div>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                {stats.onlinePercent}% of Sales
              </span>
            </div>

            <h3 className="text-2xl font-black text-blue-600 font-mono tracking-tight my-2">
              ₹{stats.onlineSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <i className="fas fa-shopping-bag text-slate-400"></i>
              <span>{stats.onlineOrdersCount} online orders</span>
            </span>
            <span className="font-semibold text-slate-700 font-mono">
              Overall: ₹{stats.onlineSales.toFixed(2)} ({stats.onlineOrdersCount})
            </span>
          </div>
        </div>
      </div>

      {/* 6. Recent Customer Invoices Live Register */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Recent Customer Invoices</h3>
            <p className="text-xs text-slate-400">Live POS checkout stream</p>
          </div>
          <Link
            to="/customer-invoices"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <i className="fas fa-arrow-right text-[10px]"></i>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold text-slate-700">Invoice No</th>
                <th className="py-3 px-4 font-bold text-slate-700">Customer</th>
                <th className="py-3 px-4 font-bold text-slate-700">Sales Channel</th>
                <th className="py-3 px-4 font-bold text-slate-700">Grand Total</th>
                <th className="py-3 px-4 font-bold text-slate-700">Payment</th>
                <th className="py-3 px-4 font-bold text-slate-700 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No recent invoices yet.
                  </td>
                </tr>
              ) : (
                recentInvoices.slice(0, 6).map((inv) => (
                  <tr key={inv._id || inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-800">
                      {inv.invoice_no}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {inv.customer_name || 'Walk-in'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inv.sales_mode === 'online'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {inv.sales_mode || 'offline'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-slate-900">
                      ₹{parseFloat(inv.grand_total || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {inv.payment_method || 'Cash'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/customer-invoices"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs inline-block cursor-pointer"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
