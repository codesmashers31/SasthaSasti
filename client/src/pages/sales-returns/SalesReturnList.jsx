import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function SalesReturnList() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await api.get('/sales-returns');
      if (res && res.data) setReturns(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Sales Returns & Exchange Register</h1>
          <p className="text-xs text-slate-500">
            Record returned idol items, issue refund vouchers, and auto-restock physical showroom inventory
          </p>
        </div>
        <Link
          to="/sales-returns/create"
          className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <i className="fas fa-undo-alt"></i> Process New Return
        </Link>
      </div>

      {/* Returns Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Return No</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Original Invoice</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Refund Amount</th>
                <th className="py-3.5 px-4">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <i className="fas fa-spinner fa-spin text-2xl text-amber-600 mb-2"></i>
                    <p className="text-xs">Loading sales returns...</p>
                  </td>
                </tr>
              ) : returns.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <i className="fas fa-undo text-3xl mb-2 text-slate-300 block"></i>
                    <p className="font-bold text-slate-600 text-sm">No sales return records registered.</p>
                  </td>
                </tr>
              ) : (
                returns.map((r) => (
                  <tr key={r._id || r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {r.return_no}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {new Date(r.return_date || r.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-800">
                      {r.invoice_no}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {r.customer_name || 'Walk-in'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-rose-600 text-sm">
                      ₹{parseFloat(r.refund_amount || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[10px] font-bold text-slate-500">
                      {r.refund_mode || 'Cash'}
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
