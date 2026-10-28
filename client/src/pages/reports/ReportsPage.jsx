import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/client';
import { BarChart3, TrendingUp, Boxes, IndianRupee, PieChart, ArrowUpRight } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Business Analytics & Reports</h2>
          <p className="text-xs text-slate-500">Sales performance, inventory valuation, and real-time Profit & Loss statement</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'sales' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sales Analytics
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'inventory' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Inventory Valuation
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'financial' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Profit & Loss (P&L)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Computing analytics report...</div>
      ) : activeTab === 'sales' ? (
        /* Sales Analytics View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase">Gross Sales Revenue</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                ₹{Number(salesData?.summary?.totalRevenue || 0).toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{salesData?.summary?.totalOrders || 0} Total Orders</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase">Total GST Collected</p>
              <h3 className="text-2xl font-black text-amber-700 mt-1">
                ₹{Number(salesData?.summary?.totalTax || 0).toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Tax liability output</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase">Discounts Granted</p>
              <h3 className="text-2xl font-black text-red-600 mt-1">
                ₹{Number(salesData?.summary?.totalDiscount || 0).toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Item & Bill discounts</p>
            </div>
          </div>

          {/* Top Selling Statues */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Top Selling God Statues</h3>
            <div className="space-y-3">
              {(salesData?.topProducts || []).map((tp, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">{tp.name}</p>
                      <p className="text-[11px] text-slate-400">{tp.quantity} units sold</p>
                    </div>
                  </div>
                  <p className="font-black text-slate-900">₹{Number(tp.revenue).toLocaleString('en-IN')}</p>
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
              <p className="text-xs font-semibold text-slate-500 uppercase">Cost Valuation (Purchase)</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                ₹{Number(inventoryData?.summary?.totalCostValuation || 0).toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase">Retail Valuation (Selling)</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">
                ₹{Number(inventoryData?.summary?.totalSellingValuation || 0).toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase">Potential Gross Margin</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">
                ₹{Number(inventoryData?.summary?.projectedGrossProfit || 0).toLocaleString('en-IN')}
              </h3>
            </div>
          </div>

          {/* Material Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Stock Composition by Material</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {Object.entries(inventoryData?.materialBreakdown || {}).map(([mat, count]) => (
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 max-w-2xl mx-auto space-y-6">
          <div className="text-center border-b border-slate-100 pb-5">
            <h3 className="text-lg font-black text-slate-800">Statement of Profit & Loss</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time accounting gross and net margin audit</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 font-semibold text-slate-700">
              <span>Gross Sales Revenue:</span>
              <span className="font-bold text-slate-900">₹{Number(financialData?.totalRevenue || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100 text-red-600 font-semibold">
              <span>Less: Cost of Goods Sourced (COGS):</span>
              <span>- ₹{Number(financialData?.costOfGoodsSold || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-3 bg-amber-50 px-4 rounded-xl font-black text-sm text-amber-900">
              <span>Gross Profit:</span>
              <span>₹{Number(financialData?.grossProfit || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100 text-red-600 font-semibold">
              <span>Less: Operating Expenses (Utilities, Logistics, Maintenance):</span>
              <span>- ₹{Number(financialData?.totalExpenses || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between py-4 bg-emerald-50 px-4 rounded-xl font-black text-base text-emerald-900 border border-emerald-200/70">
              <div>
                <span>Net Business Profit:</span>
                <p className="text-xs font-medium text-emerald-700 mt-0.5">Margin: {financialData?.netMarginPercent || 0}%</p>
              </div>
              <span>₹{Number(financialData?.netProfit || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
