import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function PurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await api.get('/purchases');
      if (res && res.data) setPurchases(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Sourcing Purchases & Artisan Orders</h1>
          <p className="text-xs text-slate-500">
            Record intake orders from sthapathis, auto-restock physical showroom inventory, and manage payables
          </p>
        </div>
        <Link
          to="/purchases/create"
          className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <i className="fas fa-cart-plus"></i> New Sourcing Purchase
        </Link>
      </div>

      {/* Purchases Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Purchase No</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Sthapathi / Foundry</th>
                <th className="py-3.5 px-4">Grand Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <i className="fas fa-spinner fa-spin text-2xl text-amber-600 mb-2"></i>
                    <p className="text-xs">Loading sourcing purchase records...</p>
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <i className="fas fa-truck-loading text-3xl mb-2 text-slate-300 block"></i>
                    <p className="font-bold text-slate-600 text-sm">No purchase records registered.</p>
                  </td>
                </tr>
              ) : (
                purchases.map((p) => (
                  <tr key={p._id || p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {p.purchase_no}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {new Date(p.purchase_date || p.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {p.supplier_name || 'Artisan Foundry'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">
                      ₹{parseFloat(p.grand_total || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          p.status === 'received'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {(p.status || 'received').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => setSelectedPurchase(p)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs cursor-pointer"
                        title="View Purchase Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Purchase Details Modal */}
      {selectedPurchase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  <i className="fas fa-truck-loading"></i>
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Purchase #{selectedPurchase.purchase_no}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPurchase(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Sthapathi / Foundry</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedPurchase.supplier_name}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Purchase Date</span>
                  <p className="font-bold text-slate-900">
                    {new Date(selectedPurchase.purchase_date || selectedPurchase.created_at).toLocaleDateString('en-IN')}
                  </p>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    {(selectedPurchase.status || 'Received').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">God Statue / Item</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Cost</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {(selectedPurchase.items || []).map((it, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 font-sans font-bold text-slate-900">
                          {it.product_name || it.name}
                        </td>
                        <td className="py-2 px-3 text-center">{it.quantity}</td>
                        <td className="py-2 px-3 text-right">₹{parseFloat(it.unit_cost || it.unit_price || 0).toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-bold">
                          ₹{parseFloat(it.total || (it.quantity * (it.unit_cost || it.unit_price || 0))).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center font-mono">
                <span className="font-sans font-bold uppercase text-slate-500">Grand Total:</span>
                <span className="text-xl font-black text-slate-900">
                  ₹{parseFloat(selectedPurchase.grand_total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
