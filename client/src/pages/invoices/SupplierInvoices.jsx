import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function SupplierInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    additional_amount: '',
    payment_status: 'Paid',
    payment_method: 'bank_transfer',
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchInvoices();
  }, [paymentStatus]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/billing/supplier-invoices');
      if (res && res.data) {
        setInvoices(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPaymentModal = (inv) => {
    setSelectedInvoice(inv);
    setPaymentForm({
      additional_amount: '',
      payment_status: inv.payment_status || 'Unpaid',
      payment_method: 'bank_transfer',
      payment_date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowPaymentModal(true);
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/billing/supplier-invoices/update-payment', {
        supplier_id: selectedInvoice.supplier_id || selectedInvoice.id,
        amount: parseFloat(paymentForm.additional_amount) || 0,
        payment_status: paymentForm.payment_status,
        payment_method: paymentForm.payment_method,
        payment_date: paymentForm.payment_date,
        notes: paymentForm.notes,
      });
      alert('Payment updated successfully');
      setShowPaymentModal(false);
      fetchInvoices();
    } catch (err) {
      alert(err.message || 'Payment update failed');
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      !search ||
      inv.supplier_name?.toLowerCase().includes(search.toLowerCase()) ||
      String(inv.supplier_id)?.includes(search) ||
      inv.mobile?.includes(search);
    const matchesStatus = !paymentStatus || inv.payment_status === paymentStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Supplier Invoices & Payment Register</h1>
          <p className="text-xs text-slate-500">
            Manage supplier purchase amounts, track payments, and update settlement status.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/suppliers"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <i className="fas fa-hammer text-amber-600"></i> Manage Suppliers
          </Link>
          <Link
            to="/products"
            className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transform hover:-translate-y-0.5 transition-all"
          >
            <i className="fas fa-boxes"></i> Product Entries
          </Link>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchInvoices();
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          <div className="lg:col-span-3">
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Search Supplier Invoices
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Supplier ID, Name, or Mobile..."
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none cursor-pointer"
            >
              <option value="">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 h-[35px] cursor-pointer"
            >
              <i className="fas fa-search"></i> Filter
            </button>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setPaymentStatus('');
                fetchInvoices();
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 px-3 py-2 rounded-xl text-xs h-[35px] flex items-center justify-center cursor-pointer"
              title="Reset Filters"
            >
              <i className="fas fa-redo"></i>
            </button>
          </div>
        </form>
      </div>

      {/* Main Table: Strictly the 5 requested columns */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold text-slate-700">Supplier ID</th>
                <th className="py-3.5 px-4 font-bold text-slate-700">Supplier Name</th>
                <th className="py-3.5 px-4 font-bold text-slate-700">Amount</th>
                <th className="py-3.5 px-4 font-bold text-slate-700">Payment Status</th>
                <th className="py-3.5 px-4 font-bold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <i className="fas fa-spinner fa-spin text-2xl text-amber-600 mb-2"></i>
                    <p className="text-xs">Loading supplier invoices...</p>
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-14 text-center text-slate-400">
                    <i className="fas fa-truck-loading text-3xl mb-2 text-slate-300 block"></i>
                    <p className="font-bold text-slate-600 text-sm">No supplier invoices found</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Suppliers and their associated product purchases will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id || inv.supplier_id} className="hover:bg-slate-50 transition-colors">
                    {/* 1. Supplier ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {inv.supplier_id}
                    </td>

                    {/* 2. Supplier Name */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 text-sm block">{inv.supplier_name}</span>
                      {inv.company_name && (
                        <span className="text-[11px] text-slate-400 block">{inv.company_name}</span>
                      )}
                    </td>

                    {/* 3. Amount */}
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">
                      ₹{parseFloat(inv.amount || 0).toFixed(2)}
                    </td>

                    {/* 4. Payment Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          inv.payment_status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : inv.payment_status === 'Partially Paid'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {inv.payment_status || 'Unpaid'}
                      </span>
                    </td>

                    {/* 5. Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenPaymentModal(inv)}
                        title="Edit / Update Payment"
                        className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold inline-flex items-center gap-1.5 border border-amber-200 transition-colors cursor-pointer"
                      >
                        <i className="fas fa-edit text-xs"></i> Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Update Supplier Payment</h3>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Supplier</span>
                <span className="font-bold text-slate-900 text-sm block">{selectedInvoice.supplier_name}</span>
                <div className="flex justify-between font-mono pt-1 text-xs">
                  <span className="text-slate-500 font-sans">Total Invoiced:</span>
                  <strong className="text-slate-900">₹{parseFloat(selectedInvoice.amount || 0).toFixed(2)}</strong>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentForm.additional_amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, additional_amount: e.target.value })}
                  placeholder="Enter amount to disburse..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={paymentForm.payment_status}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                >
                  <option value="Paid">Paid (Settled)</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Disbursement Method</label>
                <select
                  value={paymentForm.payment_method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                >
                  <option value="bank_transfer">Bank Transfer / NEFT</option>
                  <option value="cash">Cash Voucher</option>
                  <option value="upi">UPI / QR</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / UTR</label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  placeholder="Bank ref or cheque number..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
