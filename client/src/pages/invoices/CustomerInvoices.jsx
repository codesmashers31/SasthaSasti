import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function CustomerInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [salesMode, setSalesMode] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  // Metrics
  const [metrics, setMetrics] = useState({
    total_sales: 0,
    total_paid: 0,
    total_due: 0,
    total_invoices: 0,
    paid_count: 0,
    due_count: 0,
  });

  useEffect(() => {
    setPage(1);
    fetchInvoices(1, limit);
  }, [salesMode, paymentStatus, paymentMethod]);

  const fetchInvoices = async (targetPage = page, targetLimit = limit) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: String(targetPage),
        limit: String(targetLimit),
        search: search.trim(),
        sales_mode: salesMode,
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        date_from: dateFrom,
        date_to: dateTo,
      });

      const res = await api.get(`/billing/invoices?${queryParams.toString()}`);
      if (res && res.data) {
        setInvoices(res.data);
        if (res.metrics) {
          setMetrics(res.metrics);
        } else {
          calculateMetrics(res.data);
        }
        if (res.pagination) {
          setPagination(res.pagination);
        } else {
          setPagination({
            page: targetPage,
            limit: targetLimit,
            total: res.data.length,
            totalPages: Math.ceil(res.data.length / targetLimit) || 1,
          });
        }
      }
    } catch (err) {
      console.error('Error loading customer invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages || newPage === page) return;
    setPage(newPage);
    fetchInvoices(newPage, limit);
    const mainEl = document.getElementById('main-content-scroll');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit) => {
    const l = parseInt(newLimit, 10) || 20;
    setLimit(l);
    setPage(1);
    fetchInvoices(1, l);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchInvoices(1, limit);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSalesMode('');
    setPaymentStatus('');
    setPaymentMethod('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
    // Fetch directly with empty filters
    try {
      setLoading(true);
      api.get(`/billing/invoices?page=1&limit=${limit}`).then((res) => {
        if (res && res.data) {
          setInvoices(res.data);
          if (res.metrics) setMetrics(res.metrics);
          if (res.pagination) setPagination(res.pagination);
        }
      }).finally(() => setLoading(false));
    } catch (err) {
      console.error(err);
    }
  };

  const getPageNumbers = () => {
    const totalPages = pagination.totalPages || 1;
    const current = pagination.page || 1;
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(current - 1);
        pages.push(current);
        pages.push(current + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const calculateMetrics = (data) => {
    let sales = 0;
    let paid = 0;
    let due = 0;
    let paidCnt = 0;
    let dueCnt = 0;

    data.forEach((inv) => {
      const gTotal = parseFloat(inv.grand_total) || 0;
      const pTotal = parseFloat(inv.paid_amount) || 0;
      const bDue = Math.max(0, gTotal - pTotal);

      sales += gTotal;
      paid += pTotal;
      due += bDue;

      if (bDue <= 0.01 && gTotal > 0) paidCnt++;
      else if (bDue > 0.01) dueCnt++;
    });

    setMetrics({
      total_sales: sales,
      total_paid: paid,
      total_due: due,
      total_invoices: data.length,
      paid_count: paidCnt,
      due_count: dueCnt,
    });
  };

  const handleCancelInvoice = async (id, invNo) => {
    const reason = prompt(`Please specify reason for cancelling Invoice #${invNo}:`);
    if (!reason) return;
    try {
      await api.post(`/billing/invoices/${id}/cancel`, { reason });
      alert(`Invoice #${invNo} cancelled successfully.`);
      fetchInvoices();
      setSelectedInvoice(null);
    } catch (err) {
      alert(err.message || 'Failed to cancel invoice');
    }
  };

  const printThermal = (inv) => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) return alert('Please allow popups to print receipt.');

    const dateStr = new Date(inv.invoice_date || inv.created_at).toLocaleString('en-IN');
    const itemsHtml = (inv.items || []).map((it) => `
      <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:12px;">
        <span style="font-weight:bold;">${it.name || it.product_name} x ${it.quantity}</span>
        <span>₹${parseFloat(it.total || (it.quantity * it.unit_price)).toFixed(2)}</span>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt ${inv.invoice_no}</title>
          <style>
            body { font-family: monospace; font-size: 12px; width: 280px; margin: 0 auto; padding: 10px; color: #000; }
            .text-center { text-align: center; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .bold { font-weight: bold; }
            .flex-between { display: flex; justify-content: space-between; }
            @media print { body { width: 100%; margin: 0; padding: 0; } }
          </style>
        </head>
        <body>
          <div class="text-center">
            <h2 style="margin:0; font-size:16px;">SASTHA SASTI ENTERPRISE</h2>
            <p style="margin:2px 0; font-size:11px;">DIVYA MURTI GOD STATUES</p>
            <p style="margin:2px 0; font-size:10px;">GSTIN: 33AABCG1234H1Z0</p>
          </div>
          <div class="divider"></div>
          <div class="flex-between"><span>Inv: <b>${inv.invoice_no}</b></span><span>${dateStr}</span></div>
          <div>Customer: <b>${inv.customer_name}</b></div>
          <div>Mobile: ${inv.customer_mobile || '—'}</div>
          <div class="divider"></div>
          ${itemsHtml}
          <div class="divider"></div>
          <div class="flex-between"><span>Subtotal:</span><span>₹${parseFloat(inv.subtotal).toFixed(2)}</span></div>
          <div class="flex-between"><span>Discount:</span><span>-₹${parseFloat(inv.discount_amount || 0).toFixed(2)}</span></div>
          <div class="flex-between"><span>GST Tax:</span><span>₹${parseFloat(inv.tax_amount || 0).toFixed(2)}</span></div>
          <div class="divider"></div>
          <div class="flex-between bold" style="font-size:14px;"><span>GRAND TOTAL:</span><span>₹${parseFloat(inv.grand_total).toFixed(2)}</span></div>
          <div class="flex-between"><span>Paid Amount:</span><span>₹${parseFloat(inv.paid_amount || inv.grand_total).toFixed(2)}</span></div>
          <div class="divider"></div>
          <div class="text-center" style="font-size:10px; margin-top:10px;">
            <p>Thank You For Choosing Divya Murti!</p>
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const printA4 = (inv) => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return alert('Please allow popups to print A4 invoice.');

    const dateStr = new Date(inv.invoice_date || inv.created_at).toLocaleDateString('en-IN');
    const itemsHtml = (inv.items || []).map((it, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 10px;">${idx + 1}</td>
        <td style="padding: 8px 10px; font-weight: bold;">${it.name || it.product_name}</td>
        <td style="padding: 8px 10px; text-align: center;">${it.quantity}</td>
        <td style="padding: 8px 10px; text-align: right;">₹${parseFloat(it.unit_price).toFixed(2)}</td>
        <td style="padding: 8px 10px; text-align: right; font-weight: bold;">₹${parseFloat(it.total || (it.quantity * it.unit_price)).toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Tax Invoice ${inv.invoice_no}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 13px; color: #1e293b; padding: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th { background: #f8fafc; font-size: 11px; text-transform: uppercase; color: #64748b; padding: 8px 10px; text-align: left; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #d97706; padding-bottom: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 style="color: #b45309; margin: 0; font-size: 22px;">SASTHA SASTI ENTERPRISE</h1>
              <p style="margin: 3px 0; font-size: 12px; color: #64748b;">Divya Murti God Statues & Pooja Artifacts</p>
              <p style="margin: 3px 0; font-size: 11px;">GSTIN: 33AABCG1234H1Z0</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; font-size: 18px; color: #0f172a;">TAX INVOICE</h2>
              <p style="margin: 3px 0; font-family: monospace; font-weight: bold; color: #b45309;">${inv.invoice_no}</p>
              <p style="margin: 3px 0; font-size: 11px;">Date: ${dateStr}</p>
            </div>
          </div>

          <div style="margin-top: 16px; display: flex; justify-content: space-between; background: #f8fafc; padding: 12px; border-radius: 8px;">
            <div>
              <span style="font-size: 10px; text-transform: uppercase; font-weight: bold; color: #94a3b8;">Billed To</span>
              <p style="margin: 3px 0; font-weight: bold; font-size: 14px;">${inv.customer_name}</p>
              <p style="margin: 2px 0; font-size: 12px; color: #64748b;">Phone: ${inv.customer_mobile || '—'}</p>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 10px; text-transform: uppercase; font-weight: bold; color: #94a3b8;">Payment Details</span>
              <p style="margin: 3px 0; font-weight: bold; text-transform: uppercase; color: #047857;">${inv.payment_status || 'Paid'}</p>
              <p style="margin: 2px 0; font-size: 12px; color: #64748b;">Mode: ${inv.payment_method || 'Cash'}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 40px;">#</th>
                <th>Item Description</th>
                <th style="text-align: center; width: 60px;">Qty</th>
                <th style="text-align: right; width: 120px;">Unit Rate</th>
                <th style="text-align: right; width: 120px;">Amount</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
            <div style="width: 260px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; padding: 4px 0;"><span>Subtotal:</span><span>₹${parseFloat(inv.subtotal).toFixed(2)}</span></div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #e11d48;"><span>Discount:</span><span>-₹${parseFloat(inv.discount_amount || 0).toFixed(2)}</span></div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #2563eb;"><span>GST Tax:</span><span>₹${parseFloat(inv.tax_amount || 0).toFixed(2)}</span></div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 16px; font-weight: bold; border-top: 2px solid #0f172a;"><span>Grand Total:</span><span>₹${parseFloat(inv.grand_total).toFixed(2)}</span></div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #047857; font-weight: bold;"><span>Amount Paid:</span><span>₹${parseFloat(inv.paid_amount || inv.grand_total).toFixed(2)}</span></div>
            </div>
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
              <i className="fas fa-file-invoice text-base"></i>
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Customer Invoice Details</h1>
              <p className="text-xs text-slate-500">
                Live sales register from POS Billing Terminal, customer order invoices, and settlement tracking.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/pos"
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <i className="fas fa-cash-register"></i> POS Terminal{' '}
            <span className="text-[9px] bg-white/20 px-1 py-0.2 rounded font-extrabold uppercase">F2</span>
          </Link>
        </div>
      </div>

      {/* Live KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoiced Sales */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Sales Billed
            </span>
            <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight">
              ₹{metrics.total_sales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">
              Across {metrics.total_invoices} customer bills
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center text-lg">
            <i className="fas fa-coins"></i>
          </div>
        </div>

        {/* Total Collected */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Collected
            </span>
            <span className="text-xl font-extrabold text-emerald-700 font-mono tracking-tight">
              ₹{metrics.total_paid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-emerald-600 block mt-0.5 font-medium">
              <i className="fas fa-check-circle text-[10px] mr-1"></i>
              {metrics.paid_count} fully settled
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
            <i className="fas fa-check-double"></i>
          </div>
        </div>

        {/* Outstanding Due Balance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Due / Pending Balance
            </span>
            <span className="text-xl font-extrabold text-rose-700 font-mono tracking-tight">
              ₹{metrics.total_due.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-rose-600 block mt-0.5 font-medium">
              <i className="fas fa-clock text-[10px] mr-1"></i>
              {metrics.due_count} with balance
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 flex items-center justify-center text-lg">
            <i className="fas fa-hand-holding-usd"></i>
          </div>
        </div>

        {/* Total Invoices Records */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Invoice Records
            </span>
            <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight">
              {metrics.total_invoices}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">
              Customer sales register
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center text-lg">
            <i className="fas fa-receipt"></i>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <form
          onSubmit={handleFilterSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5"
        >
          <div className="lg:col-span-2">
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Search Customer / Invoice
            </label>
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Invoice #, Customer Name, Mobile..."
                className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Sales Mode</label>
            <select
              value={salesMode}
              onChange={(e) => setSalesMode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 rounded-xl px-2.5 py-2 text-xs text-slate-900 outline-none cursor-pointer"
            >
              <option value="">All Modes</option>
              <option value="offline">Offline (Store)</option>
              <option value="online">Online</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid (Settled)</option>
              <option value="partial">Partially Paid</option>
              <option value="unpaid">Unpaid (Credit)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none cursor-pointer"
            >
              <option value="">All Methods</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI / QR</option>
              <option value="split">Split Payment</option>
              <option value="card">Card</option>
              <option value="credit">Credit / Ledger</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Date Range</label>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-[11px] text-slate-800 outline-none"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-[11px] text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 h-[35px] cursor-pointer"
            >
              <i className="fas fa-filter"></i> Apply
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 px-3 py-2 rounded-xl text-xs h-[35px] flex items-center justify-center cursor-pointer"
              title="Reset Filters"
            >
              <i className="fas fa-redo"></i>
            </button>
          </div>
        </form>
      </div>

      {/* Main Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold text-slate-700">Invoice No</th>
                <th className="py-3 px-4 font-bold text-slate-700">Date & Time</th>
                <th className="py-3 px-4 font-bold text-slate-700">Customer Details</th>
                <th className="py-3 px-4 font-bold text-slate-700">Sales Channel</th>
                <th className="py-3 px-4 font-bold text-slate-700">Payment Mode</th>
                <th className="py-3 px-4 font-bold text-slate-700">Amount Billed</th>
                <th className="py-3 px-4 font-bold text-slate-700">Settled Status</th>
                <th className="py-3 px-4 font-bold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <i className="fas fa-spinner fa-spin text-2xl text-amber-600 mb-2"></i>
                    <p className="text-xs">Loading sales invoices...</p>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <i className="fas fa-file-invoice text-3xl mb-2 text-slate-300 block"></i>
                    <p className="font-bold text-slate-600 text-sm">No customer invoices found</p>
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const gTotal = parseFloat(inv.grand_total) || 0;
                  const pTotal = parseFloat(inv.paid_amount) || 0;
                  const bDue = Math.max(0, gTotal - pTotal);
                  const status = inv.status === 'cancelled' ? 'cancelled' : bDue <= 0.01 ? 'paid' : pTotal > 0 ? 'partial' : 'unpaid';

                  return (
                    <tr key={inv._id || inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-800">
                        {inv.invoice_no}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(inv.invoice_date || inv.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{inv.customer_name || 'Walk-in'}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{inv.customer_mobile || '—'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inv.sales_mode === 'online'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {inv.sales_mode || 'offline'}
                        </span>
                      </td>
                      <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-600 font-mono">
                        {inv.payment_method || 'cash'}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="font-black text-slate-900 text-sm block">₹{gTotal.toFixed(2)}</span>
                        {bDue > 0 && (
                          <span className="text-[10px] text-rose-600 font-bold block">
                            Due: ₹{bDue.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : status === 'partial'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : status === 'cancelled'
                              ? 'bg-slate-100 text-slate-500 border-slate-300 line-through'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(inv)}
                          title="View Bill Details"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs cursor-pointer"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => printThermal(inv)}
                          title="Thermal 80mm Print"
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs cursor-pointer"
                        >
                          <i className="fas fa-receipt"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => printA4(inv)}
                          title="Print A4 Tax Invoice"
                          className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs cursor-pointer"
                        >
                          <i className="fas fa-print"></i>
                        </button>
                        {inv.customer_mobile && (
                          <a
                            href={`https://wa.me/91${inv.customer_mobile}?text=${encodeURIComponent(
                              `Hello ${inv.customer_name}, your Divya Murti invoice ${inv.invoice_no} for amount ₹${inv.grand_total} is ready.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Share on WhatsApp"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs inline-block cursor-pointer"
                          >
                            <i className="fab fa-whatsapp"></i>
                          </a>
                        )}
                        {status !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => handleCancelInvoice(inv._id || inv.id, inv.invoice_no)}
                            title="Cancel Invoice"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs cursor-pointer"
                          >
                            <i className="fas fa-ban"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3 flex-wrap">
            <span>
              Showing{' '}
              <strong className="text-slate-800">
                {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-slate-800">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </strong>{' '}
              of <strong className="text-slate-800">{pagination.total}</strong> customer invoices
            </span>

            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
              <span className="text-[11px] text-slate-400">Per page:</span>
              <select
                value={limit}
                onChange={(e) => handleLimitChange(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 outline-none focus:border-amber-500 font-medium cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* First Page Button */}
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              disabled={pagination.page <= 1}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold transition-all cursor-pointer"
              title="First Page"
            >
              <i className="fas fa-angle-double-left text-[11px]"></i>
            </button>

            {/* Prev Page Button */}
            <button
              type="button"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold transition-all flex items-center gap-1 cursor-pointer"
            >
              <i className="fas fa-chevron-left text-[10px]"></i> Prev
            </button>

            {/* Numeric Page Buttons */}
            {getPageNumbers().map((p, idx) =>
              p === '...' ? (
                <span key={`dots-${idx}`} className="px-2 py-1 text-slate-400">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p)}
                  className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    p === pagination.page
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {p}
                </button>
              )
            )}

            {/* Next Page Button */}
            <button
              type="button"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold transition-all flex items-center gap-1 cursor-pointer"
            >
              Next <i className="fas fa-chevron-right text-[10px]"></i>
            </button>

            {/* Last Page Button */}
            <button
              type="button"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold transition-all cursor-pointer"
              title="Last Page"
            >
              <i className="fas fa-angle-double-right text-[11px]"></i>
            </button>
          </div>
        </div>
      </div>

      {/* View Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  <i className="fas fa-receipt"></i>
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Invoice #{selectedInvoice.invoice_no}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Customer</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedInvoice.customer_name}</p>
                  <p className="text-slate-500 font-mono">{selectedInvoice.customer_mobile || '—'}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Invoice Date</span>
                  <p className="font-bold text-slate-900">
                    {new Date(selectedInvoice.invoice_date || selectedInvoice.created_at).toLocaleString('en-IN')}
                  </p>
                  <p className="text-emerald-700 font-bold uppercase">{selectedInvoice.sales_mode || 'Offline'}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Rate</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {(selectedInvoice.items || []).map((it, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 font-sans font-bold text-slate-900">
                          {it.name || it.product_name}
                        </td>
                        <td className="py-2 px-3 text-center">{it.quantity}</td>
                        <td className="py-2 px-3 text-right">₹{parseFloat(it.unit_price).toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-bold">
                          ₹{parseFloat(it.total || (it.quantity * it.unit_price)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-600">
                  <span className="font-sans">Subtotal:</span>
                  <span>₹{parseFloat(selectedInvoice.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span className="font-sans">Discount:</span>
                  <span>-₹{parseFloat(selectedInvoice.discount_amount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span className="font-sans">GST Tax:</span>
                  <span>₹{parseFloat(selectedInvoice.tax_amount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 text-base pt-2 border-t border-slate-200">
                  <span className="font-sans">Grand Total:</span>
                  <span>₹{parseFloat(selectedInvoice.grand_total).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span className="font-sans">Paid Amount:</span>
                  <span>₹{parseFloat(selectedInvoice.paid_amount || selectedInvoice.grand_total).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => printThermal(selectedInvoice)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  <i className="fas fa-receipt mr-1"></i> Thermal Print
                </button>
                <button
                  type="button"
                  onClick={() => printA4(selectedInvoice)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  <i className="fas fa-print mr-1"></i> A4 Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
