import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';

export default function SalesReturnCreate() {
  const navigate = useNavigate();
  const [invoiceLookupNo, setInvoiceLookupNo] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [refundMode, setRefundMode] = useState('cash');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!invoiceLookupNo.trim()) return alert('Please enter an invoice number');
    try {
      setLoading(true);
      const res = await api.get(`/sales-returns/lookup/${encodeURIComponent(invoiceLookupNo.trim())}`);
      if (res && res.invoice) {
        setInvoice(res.invoice);
        setReturnItems(
          (res.items || []).map((it) => ({
            invoice_item_id: it._id || it.id,
            product_id: it.product_id,
            product_name: it.product_name || it.name,
            billed_qty: it.quantity,
            return_qty: 0,
            unit_price: parseFloat(it.unit_price) || 0,
          }))
        );
      } else {
        alert('Invoice not found');
      }
    } catch (err) {
      alert(err.message || 'Invoice lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnQtyChange = (idx, qty) => {
    const item = returnItems[idx];
    const parsed = Math.min(item.billed_qty, Math.max(0, parseInt(qty) || 0));
    setReturnItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, return_qty: parsed } : it))
    );
  };

  const totalRefund = returnItems.reduce((sum, it) => sum + it.return_qty * it.unit_price, 0);

  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    const activeItems = returnItems.filter((it) => it.return_qty > 0);
    if (!activeItems.length) {
      return alert('Please select return quantity for at least one item');
    }

    try {
      setLoading(true);
      const payload = {
        invoice_id: invoice._id || invoice.id,
        invoice_no: invoice.invoice_no,
        customer_id: invoice.customer_id,
        customer_name: invoice.customer_name,
        refund_amount: totalRefund,
        refund_mode: refundMode,
        reason,
        items: activeItems,
      };

      await api.post('/sales-returns', payload);
      alert('Sales return processed successfully! Stock has been restocked.');
      navigate('/sales-returns');
    } catch (err) {
      alert(err.message || 'Failed to process return');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Process Sales Return</h1>
          <p className="text-xs text-slate-500">
            Lookup original invoice, select items to return, and issue customer refund
          </p>
        </div>
        <Link
          to="/sales-returns"
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-xl text-xs font-bold shadow-sm cursor-pointer"
        >
          <i className="fas fa-arrow-left mr-1"></i> Back
        </Link>
      </div>

      {/* Step 1: Invoice Lookup */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <i className="fas fa-search text-amber-600"></i> Step 1: Lookup Original Sales Invoice
        </h3>

        <form onSubmit={handleLookup} className="flex gap-3">
          <input
            type="text"
            value={invoiceLookupNo}
            onChange={(e) => setInvoiceLookupNo(e.target.value)}
            placeholder="Enter invoice number (e.g. INV-202608-0001)..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 font-mono focus:border-amber-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="gold-btn px-5 py-2 rounded-xl text-xs font-bold shadow-sm cursor-pointer"
          >
            {loading ? 'Searching...' : 'Lookup Invoice'}
          </button>
        </form>
      </div>

      {/* Step 2 & 3: Return Form (Displayed once invoice is found) */}
      {invoice && (
        <form onSubmit={handleSubmitReturn} className="space-y-6">
          {/* Step 2: Return Items */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <i className="fas fa-boxes text-amber-600"></i> Step 2: Select Items to Return
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between text-xs">
              <span>Customer: <strong className="text-slate-900">{invoice.customer_name}</strong></span>
              <span>Invoice Total: <strong className="font-mono text-slate-900">₹{parseFloat(invoice.grand_total).toFixed(2)}</strong></span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">God Statue Item</th>
                    <th className="py-2.5 px-3 text-center w-28">Billed Qty</th>
                    <th className="py-2.5 px-3 text-center w-32">Return Qty</th>
                    <th className="py-2.5 px-3 text-right w-36">Unit Rate (₹)</th>
                    <th className="py-2.5 px-3 text-right w-36">Refund (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {returnItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                        {item.product_name}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                        {item.billed_qty}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max={item.billed_qty}
                          value={item.return_qty}
                          onChange={(e) => handleReturnQtyChange(idx, e.target.value)}
                          className="w-20 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-center font-bold text-slate-900 outline-none"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right">₹{item.unit_price.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-black text-rose-600">
                        ₹{(item.return_qty * item.unit_price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Step 3: Refund Settlement */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <i className="fas fa-money-bill-wave text-amber-600"></i> Step 3: Refund Settlement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Refund Settlement Mode</label>
                <select
                  value={refundMode}
                  onChange={(e) => setRefundMode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none cursor-pointer"
                >
                  <option value="cash">Cash Refund</option>
                  <option value="credit">Store Credit / Customer Ledger</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Return</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Size exchange / Customer requested Panchaloha upgrade..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex justify-between items-center font-mono">
              <span className="font-sans font-bold text-rose-900">Total Refund Payable:</span>
              <span className="text-xl font-black text-rose-700">₹{totalRefund.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || totalRefund <= 0}
              className="gold-btn px-8 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-check"></i> Process Return & Restock
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
