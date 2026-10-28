import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

export default function ReportsPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('sales'); // 'sales', 'inventory', 'financial'
  const [salesData, setSalesData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.pathname.includes('/inventory')) {
      setActiveTab('inventory');
    } else if (location.pathname.includes('/financial')) {
      setActiveTab('financial');
    } else {
      setActiveTab('sales');
    }
  }, [location.pathname]);

  useEffect(() => {
    fetchActiveReport();
  }, [activeTab]);

  const fetchActiveReport = async () => {
    try {
      setLoading(true);
      if (activeTab === 'sales') {
        const res = await api.get('/reports/sales');
        if (res.success) setSalesData(res);
      } else if (activeTab === 'inventory') {
        const res = await api.get('/reports/inventory');
        if (res.success) setInventoryData(res);
      } else if (activeTab === 'financial') {
        const res = await api.get('/reports/financial');
        if (res.success) setFinancialData(res.financials);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // 1. Sales Tab Chart Data
  // -----------------------------------------------------------------
  const topProducts = salesData?.topProducts || [];
  const salesBarData = {
    labels: topProducts.slice(0, 6).map((p) => (p.name.length > 18 ? p.name.slice(0, 16) + '...' : p.name)),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: topProducts.slice(0, 6).map((p) => p.revenue),
        backgroundColor: '#c26700',
        borderRadius: 8,
      },
    ],
  };

  const paymentMethodsObj = salesData?.summary?.paymentMethods || {};
  const paymentLabels = Object.keys(paymentMethodsObj);
  const paymentValues = Object.values(paymentMethodsObj);
  const salesPaymentPieData = {
    labels: paymentLabels.length ? paymentLabels.map((l) => l.toUpperCase()) : ['CASH', 'UPI', 'CARD'],
    datasets: [
      {
        data: paymentValues.length ? paymentValues : [150000, 80000, 20000],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // -----------------------------------------------------------------
  // 2. Inventory Tab Chart Data
  // -----------------------------------------------------------------
  const matEntries = Object.entries(inventoryData?.materialBreakdown || {});
  const inventoryDoughnutData = {
    labels: matEntries.map(([mat]) => mat),
    datasets: [
      {
        data: matEntries.map(([, count]) => count),
        backgroundColor: [
          '#d97706',
          '#b45309',
          '#64748b',
          '#7c3aed',
          '#854d0e',
          '#059669',
          '#ea580c',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const costVal = Number(inventoryData?.summary?.totalCostValuation || 0);
  const retailVal = Number(inventoryData?.summary?.totalSellingValuation || 0);
  const profitVal = Number(inventoryData?.summary?.projectedGrossProfit || 0);

  const inventoryComparisonBarData = {
    labels: ['Cost (Buy)', 'Retail (Sell)', 'Projected Profit'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [costVal, retailVal, profitVal],
        backgroundColor: ['#64748b', '#10b981', '#f59e0b'],
        borderRadius: 8,
      },
    ],
  };

  // -----------------------------------------------------------------
  // 3. Financial Tab Chart Data
  // -----------------------------------------------------------------
  const finRevenue = Number(financialData?.totalRevenue || 0);
  const finCogs = Number(financialData?.costOfGoodsSold || 0);
  const finExpenses = Number(financialData?.totalExpenses || 0);
  const finNetProfit = Number(financialData?.netProfit || 0);

  const financialBarData = {
    labels: ['Gross Revenue', 'COGS', 'Expenses', 'Net Profit'],
    datasets: [
      {
        label: 'Value (₹)',
        data: [finRevenue, finCogs, finExpenses, finNetProfit],
        backgroundColor: ['#3b82f6', '#ef4444', '#f97316', '#10b981'],
        borderRadius: 8,
      },
    ],
  };

  const marginPct = Number(financialData?.netMarginPercent || 0);
  const financialMarginDonutData = {
    labels: ['Net Profit Margin', 'Costs & Expenses'],
    datasets: [
      {
        data: [marginPct, Math.max(0, 100 - marginPct)],
        backgroundColor: ['#10b981', '#e2e8f0'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Business Analytics & Reports</h2>
          <p className="text-xs text-slate-500">
            Interactive charts, sales performance, inventory valuation, and real-time Profit & Loss statement
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'sales'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sales Analytics
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Inventory Valuation
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'financial'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Profit & Loss (P&L)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <i className="fas fa-spinner fa-spin text-amber-600"></i>
          <span>Computing visual analytics report...</span>
        </div>
      ) : activeTab === 'sales' ? (
        /* Sales Analytics View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase">Gross Sales Revenue</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1 font-mono">
                ₹{Number(salesData?.summary?.totalRevenue || 0).toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {salesData?.summary?.totalOrders || 0} Total Orders
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase">Total GST Collected</p>
              <h3 className="text-2xl font-black text-amber-700 mt-1 font-mono">
                ₹{Number(salesData?.summary?.totalTax || 0).toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Tax liability output</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase">Discounts Granted</p>
              <h3 className="text-2xl font-black text-red-600 mt-1 font-mono">
                ₹{Number(salesData?.summary?.totalDiscount || 0).toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Item & Bill discounts</p>
            </div>
          </div>

          {/* Interactive Sales Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart: Top Idols Revenue Bar Chart */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      PERFORMANCE
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm">
                      Top God Statues by Revenue (₹)
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    Bestselling Idols
                  </span>
                </div>
                <div className="h-64 w-full">
                  <Bar
                    data={salesBarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: {
                          ticks: {
                            callback: (v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Chart: Payment Methods Pie Chart */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      SETTLEMENT
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm">Sales by Payment Mode</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Live Split
                  </span>
                </div>
                <div className="h-64 w-full flex items-center justify-center">
                  <Pie
                    data={salesPaymentPieData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top Selling Statues List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Top Selling God Statues Table</h3>
            <div className="space-y-3">
              {(salesData?.topProducts || []).map((tp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">{tp.name}</p>
                      <p className="text-[11px] text-slate-400">{tp.quantity} units sold</p>
                    </div>
                  </div>
                  <p className="font-black text-slate-900 font-mono">
                    ₹{Number(tp.revenue).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'inventory' ? (
        /* Inventory Valuation View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Cost Valuation (Purchase)
              </p>
              <h3 className="text-2xl font-black text-slate-800 mt-1 font-mono">
                ₹{costVal.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Retail Valuation (Selling)
              </p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1 font-mono">
                ₹{retailVal.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Potential Gross Margin
              </p>
              <h3 className="text-2xl font-black text-amber-600 mt-1 font-mono">
                ₹{profitVal.toLocaleString('en-IN')}
              </h3>
            </div>
          </div>

          {/* Interactive Inventory Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart: Stock Material Doughnut */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      DISTRIBUTION
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm">
                      Stock Composition by Material
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    Units Distribution
                  </span>
                </div>
                <div className="h-64 w-full flex items-center justify-center">
                  <Doughnut
                    data={inventoryDoughnutData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: '65%',
                      plugins: {
                        legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Chart: Cost vs Retail Valuation Comparison Bar Chart */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      VALUATION COMPARISON
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm">
                      Cost vs Retail vs Potential Profit
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Financial Value (₹)
                  </span>
                </div>
                <div className="h-64 w-full">
                  <Bar
                    data={inventoryComparisonBarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: {
                          ticks: {
                            callback: (v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Material Breakdown Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Stock Composition Cards</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {matEntries.map(([mat, count]) => (
                <div key={mat} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-500 font-semibold">{mat}</p>
                  <h4 className="text-xl font-bold text-slate-800 mt-1">{count} Units</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Financial P&L Statement */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Financial Comparison Bar Chart */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      FINANCIAL METRICS
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm">
                      Revenue vs COGS vs Expenses vs Net Profit
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                    P&L Breakdown
                  </span>
                </div>
                <div className="h-72 w-full">
                  <Bar
                    data={financialBarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: {
                          ticks: {
                            callback: (v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Net Margin Gauge Donut */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      MARGIN HEALTH
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm">Net Profit Margin Ratio</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {marginPct}% Net Margin
                  </span>
                </div>
                <div className="h-72 w-full flex items-center justify-center relative">
                  <Doughnut
                    data={financialMarginDonutData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: '75%',
                      plugins: {
                        legend: { position: 'bottom', labels: { font: { size: 11 } } },
                      },
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                    <span className="text-3xl font-black text-emerald-700 font-mono">
                      {marginPct}%
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Net Return</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statement of P&L Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 max-w-2xl mx-auto space-y-6">
            <div className="text-center border-b border-slate-100 pb-5">
              <h3 className="text-lg font-black text-slate-800">Statement of Profit & Loss</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time accounting gross and net margin audit
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 font-semibold text-slate-700">
                <span>Gross Sales Revenue:</span>
                <span className="font-bold text-slate-900 font-mono">
                  ₹{finRevenue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100 text-red-600 font-semibold">
                <span>Less: Cost of Goods Sourced (COGS):</span>
                <span className="font-mono">- ₹{finCogs.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between py-3 bg-amber-50 px-4 rounded-xl font-black text-sm text-amber-900">
                <span>Gross Profit:</span>
                <span className="font-mono">
                  ₹{Number(financialData?.grossProfit || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100 text-red-600 font-semibold">
                <span>Less: Operating Expenses (Utilities, Logistics, Maintenance):</span>
                <span className="font-mono">- ₹{finExpenses.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between py-4 bg-emerald-50 px-4 rounded-xl font-black text-base text-emerald-900 border border-emerald-200/70">
                <div>
                  <span>Net Business Profit:</span>
                  <p className="text-xs font-medium text-emerald-700 mt-0.5">
                    Margin: {marginPct}%
                  </p>
                </div>
                <span className="font-mono">₹{finNetProfit.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
