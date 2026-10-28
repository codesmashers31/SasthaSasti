import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export default function InventoryList() {
  const [stockList, setStockList] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form State
  const [productId, setProductId] = useState('');
  const [adjType, setAdjType] = useState('addition');
  const [adjQty, setAdjQty] = useState(1);
  const [adjNotes, setAdjNotes] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const [invRes, txRes] = await Promise.all([
        api.get(`/inventory?search=${encodeURIComponent(search)}`),
        api.get('/inventory/transactions'),
      ]);
      if (invRes && invRes.data) setStockList(invRes.data);
      if (txRes && txRes.data) setRecentTransactions(txRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!productId) return alert('Please select a product');
    try {
      await api.post('/inventory/adjust', {
        product_id: productId,
        adjustment_type: adjType,
        quantity: parseInt(adjQty) || 1,
        notes: adjNotes,
      });
      alert('Stock adjustment recorded successfully');
      setShowAdjustModal(false);
      setAdjQty(1);
      setAdjNotes('');
      loadInventory();
    } catch (err) {
      alert(err.message || 'Failed to adjust stock');
    }
  };

  const filteredStock = stockList.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Header with Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Inventory & Stock Control Register</h1>
          <p className="text-xs text-slate-500">
            Strict physical stock auditing, damage records, showroom intake, and movement trails
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (stockList.length > 0 && !productId) {
              setProductId(stockList[0]._id || stockList[0].id || stockList[0].legacyId);
            }
            setShowAdjustModal(true);
          }}
          className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <i className="fas fa-sliders-h"></i> Stock Adjustment / Damage Entry
        </button>
      </div>

      {/* Stock Levels & History Split (Exact 2:1 layout from PHP) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Stock Levels Table (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Current Physical Stock Levels</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search statue..."
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Statue Item</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Stock Level</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      Loading physical inventory...
                    </td>
                  </tr>
                ) : filteredStock.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      No matching products.
                    </td>
                  </tr>
                ) : (
                  filteredStock.map((p) => {
                    const current = parseInt(p.current_stock) || 0;
                    const min = parseInt(p.min_stock_alert || p.min_stock) || 3;
                    return (
                      <tr key={p._id || p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[10px] text-amber-700 font-semibold">{p.material || 'Brass'}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-500">{p.sku || p.code}</td>
                        <td className="py-3 px-3 font-mono">
                          {current <= min ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[11px] border border-rose-200">
                              {current} units (Low)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                              {current} units
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">
                          {p.location || p.stock_location || 'Showroom'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setProductId(p._id || p.id || p.legacyId);
                              setShowAdjustModal(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
                          >
                            Adjust
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent Stock Movements (1 col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <i className="fas fa-history text-amber-600"></i> Recent Stock Movements
            </h3>
            <p className="text-xs text-slate-400 mb-4">Every physical alteration recorded with user stamp</p>

            <div className="space-y-2.5 max-h-[65vh] overflow-y-auto pr-1">
              {recentTransactions.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No recent stock movements.</div>
              ) : (
                recentTransactions.slice(0, 15).map((tx, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase text-amber-800 text-[10px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                        {(tx.transaction_type || 'adjustment').replace('_', ' ')}
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          tx.quantity > 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {tx.quantity > 0 ? '+' : ''}{tx.quantity} units
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-1">
                      {tx.product_name}
                    </h5>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between font-medium">
                      <span>Ref: {tx.reference_no || 'Manual'}</span>
                      <span>By: {tx.user_name || 'System'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Stock Adjustment */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Stock Adjustment & Damage</h3>
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select God Statue *</label>
                <select
                  required
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none cursor-pointer"
                >
                  {stockList.map((p) => (
                    <option key={p._id || p.id} value={p._id || p.id || p.legacyId}>
                      {p.name} (Cur: {p.current_stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Adjustment Type *</label>
                <select
                  value={adjType}
                  onChange={(e) => setAdjType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none cursor-pointer"
                >
                  <option value="addition">Physical Stock Addition (+)</option>
                  <option value="damage">Foundry Transport Damage (-)</option>
                  <option value="theft">Discrepancy / Shortage (-)</option>
                  <option value="correction">Audit Balance Correction (=)</option>
                  <option value="internal_use">Temple Showroom Consecration (-)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity (Units) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjQty}
                  onChange={(e) => setAdjQty(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Audit Notes / Reason</label>
                <input
                  type="text"
                  value={adjNotes}
                  onChange={(e) => setAdjNotes(e.target.value)}
                  placeholder="e.g. Scratched during temple procession packing..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Commit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
