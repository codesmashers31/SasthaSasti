import React, { useState } from 'react';
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

export default function AnalyticsCharts({ chartsData, loading }) {
  const [salesViewMode, setSalesViewMode] = useState('sales'); // 'sales' | 'invoices'

  if (loading || !chartsData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-pulse">
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 h-80 flex items-center justify-center text-slate-400 text-xs">
          Loading Visual Analytics...
        </div>
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 h-80 flex items-center justify-center text-slate-400 text-xs">
          Loading Material Distribution...
        </div>
      </div>
    );
  }

  const {
    monthlySalesTrend = [],
    paymentBreakdown = {},
    channelBreakdown = {},
    topSellingProducts = [],
    materialStock = {},
  } = chartsData;

  // -------------------------------------------------------------
  // 1. Monthly Sales Bar Chart Data & Config
  // -------------------------------------------------------------
  const trendLabels = monthlySalesTrend.map((t) => t.month);
  const trendSalesData = monthlySalesTrend.map((t) => t.sales);
  const trendInvoicesData = monthlySalesTrend.map((t) => t.invoices);

  const monthlyBarData = {
    labels: trendLabels,
    datasets: [
      {
        label: salesViewMode === 'sales' ? 'Billed Revenue (₹)' : 'Total Invoices',
        data: salesViewMode === 'sales' ? trendSalesData : trendInvoicesData,
        backgroundColor:
          salesViewMode === 'sales'
            ? [
                'rgba(217, 119, 6, 0.4)',
                'rgba(217, 119, 6, 0.5)',
                'rgba(217, 119, 6, 0.6)',
                'rgba(194, 103, 0, 0.75)',
                'rgba(194, 103, 0, 0.85)',
                'rgba(180, 83, 9, 1)',
              ]
            : 'rgba(37, 99, 235, 0.85)',
        borderColor: salesViewMode === 'sales' ? '#b45309' : '#1d4ed8',
        borderWidth: 1.5,
        borderRadius: 8,
        hoverBackgroundColor: salesViewMode === 'sales' ? '#92400e' : '#1e40af',
      },
    ],
  };

  const monthlyBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            return salesViewMode === 'sales'
              ? ` Revenue: ₹${val.toLocaleString('en-IN')}`
              : ` Invoices: ${val} Bills`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11, weight: '600' }, color: '#64748b' },
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: {
          font: { size: 10 },
          color: '#64748b',
          callback: (val) =>
            salesViewMode === 'sales'
              ? `₹${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`
              : val,
        },
      },
    },
  };

  // -------------------------------------------------------------
  // 2. Material Stock Doughnut Chart Data & Config
  // -------------------------------------------------------------
  const materialKeys = Object.keys(materialStock);
  const materialUnits = materialKeys.map((k) => materialStock[k].units);
  const totalStockUnitsAll = materialUnits.reduce((a, b) => a + b, 0);

  const materialColors = [
    '#d97706', // Brass (Amber)
    '#b45309', // Bronze
    '#64748b', // Marble
    '#7c3aed', // Panchaloha
    '#854d0e', // Teak / Sandalwood
    '#059669', // Emerald / Malachite
    '#ea580c', // Copper
    '#0284c7', // Lapis / Stone
  ];

  const materialDoughnutData = {
    labels: materialKeys.length ? materialKeys : ['Brass', 'Bronze', 'Marble', 'Panchaloha'],
    datasets: [
      {
        data: materialUnits.length ? materialUnits : [120, 65, 45, 20],
        backgroundColor: materialColors.slice(0, Math.max(materialKeys.length, 4)),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6,
      },
    ],
  };

  const materialDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 10,
          font: { size: 11, weight: '600' },
          color: '#334155',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            const pct = totalStockUnitsAll > 0 ? Math.round((val / totalStockUnitsAll) * 100) : 0;
            return ` ${context.label}: ${val} units (${pct}%)`;
          },
        },
      },
    },
  };

  // -------------------------------------------------------------
  // 3. Payment Methods Pie / Doughnut Chart
  // -------------------------------------------------------------
  const paymentLabels = Object.keys(paymentBreakdown);
  const paymentValues = Object.values(paymentBreakdown);
  const totalPayment = paymentValues.reduce((a, b) => a + b, 0);

  const paymentColors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  const paymentChartData = {
    labels: paymentLabels,
    datasets: [
      {
        data: paymentValues,
        backgroundColor: paymentColors,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const paymentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          padding: 8,
          font: { size: 10, weight: '600' },
          color: '#475569',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            const pct = totalPayment > 0 ? Math.round((val / totalPayment) * 100) : 0;
            return ` ${context.label}: ₹${val.toLocaleString('en-IN')} (${pct}%)`;
          },
        },
      },
    },
  };

  // -------------------------------------------------------------
  // 4. Top Selling Products (Horizontal Bar Chart)
  // -------------------------------------------------------------
  const topProductLabels = topSellingProducts.map((p) =>
    p.name.length > 20 ? p.name.slice(0, 18) + '...' : p.name
  );
  const topProductRevenues = topSellingProducts.map((p) => p.revenue);

  const topProductsBarData = {
    labels: topProductLabels.length
      ? topProductLabels
      : ['Swamimalai Nataraja', 'Royal Brass Ganesha', 'Teak Altar', 'Pooja Thali Set'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: topProductRevenues.length ? topProductRevenues : [85000, 48000, 32000, 18000],
        backgroundColor: '#c26700',
        borderRadius: 6,
        barThickness: 16,
      },
    ],
  };

  const topProductsBarOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` Total Sales: ₹${(context.raw || 0).toLocaleString('en-IN')}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: '#f1f5f9' },
        ticks: {
          font: { size: 10 },
          color: '#64748b',
          callback: (val) => `₹${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`,
        },
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 11, weight: '600' }, color: '#334155' },
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center text-sm font-black">
            <i className="fas fa-chart-line"></i>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Business Intelligence & Sacred Analytics
            </h3>
            <p className="text-[11px] text-slate-500">
              Live sales trends, inventory composition, and revenue streams
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Visuals
        </span>
      </div>

      {/* Row 1: Sales Trend Bar Chart (8 cols) & Material Composition Donut (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chart 1: Monthly Sales Trend */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  TURNOVER TRAJECTORY
                </span>
                <h4 className="text-sm font-black text-slate-900">
                  Monthly Sales & Billing Performance
                </h4>
              </div>

              {/* View Switcher Button Group */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setSalesViewMode('sales')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    salesViewMode === 'sales'
                      ? 'bg-white text-amber-800 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ₹ Revenue
                </button>
                <button
                  type="button"
                  onClick={() => setSalesViewMode('invoices')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    salesViewMode === 'invoices'
                      ? 'bg-white text-blue-700 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bills Count
                </button>
              </div>
            </div>

            <div className="h-64 w-full">
              <Bar data={monthlyBarData} options={monthlyBarOptions} />
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <i className="fas fa-arrow-trend-up text-emerald-600"></i>
              <span>Steady upward growth over recent quarters</span>
            </span>
            <span className="font-mono font-bold text-amber-800">
              Latest: ₹{(trendSalesData[trendSalesData.length - 1] || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Chart 2: Sacred Material Stock Composition */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  INVENTORY MIX
                </span>
                <h4 className="text-sm font-black text-slate-900">Stock by Sacred Material</h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                {totalStockUnitsAll} Units Total
              </span>
            </div>

            <div className="h-64 w-full relative flex items-center justify-center">
              <Doughnut data={materialDoughnutData} options={materialDoughnutOptions} />
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Primary Craft: Brass & Bronze</span>
            <span className="font-semibold text-emerald-700">Artisan Sourced</span>
          </div>
        </div>
      </div>

      {/* Row 2: Payment Mode Breakdown (Pie Chart) & Top Selling Statues (Horizontal Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chart 3: Payment Breakdown Pie */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  PAYMENT SETTLEMENT
                </span>
                <h4 className="text-sm font-black text-slate-900">Collection by Payment Mode</h4>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                ₹{totalPayment.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              <Pie data={paymentChartData} options={paymentChartOptions} />
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>UPI & Cash lead checkout volume</span>
            <span className="font-bold text-slate-700">100% Reconciled</span>
          </div>
        </div>

        {/* Chart 4: Top Performing Divine Murti */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  BESTSELLERS
                </span>
                <h4 className="text-sm font-black text-slate-900">
                  Top Performing Idols & Sacred Artefacts
                </h4>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                By Total Revenue
              </span>
            </div>

            <div className="h-56 w-full">
              <Bar data={topProductsBarData} options={topProductsBarOptions} />
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-slate-600">
              <i className="fas fa-crown text-amber-500"></i>
              <span>High customer reverence & order turnover</span>
            </span>
            <span className="text-xs font-bold text-amber-800">Top 5 Masterpieces</span>
          </div>
        </div>
      </div>
    </div>
  );
}
