import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';

export default function PurchaseCreate() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [supplierId, setSupplierId] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('received');
  const [items, setItems] = useState([
    { product_id: '', product_name: '', quantity: 1, unit_cost: 0, total: 0 },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sRes, pRes] = await Promise.all([
        api.get('/suppliers'),
        api.get('/products?limit=200'),
      ]);
      if (sRes && sRes.data) setSuppliers(sRes.data);
      if (pRes && pRes.data) setProducts(pRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProductSelect = (idx, prodId) => {
    const prod = products.find((p) => String(p._id || p.id || p.legacyId) === String(prodId));
    setItems((prev) =>
      prev.map((it, i) => {
        if (i === idx) {
          const cost = prod ? parseFloat(prod.purchase_price) || 0 : 0;
          return {
            ...it,
            product_id: prodId,
            product_name: prod ? prod.name : '',
            unit_cost: cost,
            total: cost * it.quantity,
          };
        }
        return it;
      })
    );
  };

  const handleQtyChange = (idx, qty) => {
    const parsedQty = Math.max(1, parseInt(qty) || 1);
    setItems((prev) =>
      prev.map((it, i) =>
        i === idx ? { ...it, quantity: parsedQty, total: parsedQty * it.unit_cost } : it
      )
    );
  };

  const handleCostChange = (idx, cost) => {
    const parsedCost = parseFloat(cost) || 0;
    setItems((prev) =>
      prev.map((it, i) =>
        i === idx ? { ...it, unit_cost: parsedCost, total: it.quantity * parsedCost } : it
      )
    );
  };

  const addRow = () => {
    setItems([...items, { product_id: '', product_name: '', quantity: 1, unit_cost: 0, total: 0 }]);
  };

  const removeRow = (idx) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const grandTotal = items.reduce((sum, it) => sum + (it.total || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplierId) return alert('Please select a supplier/sthapathi');
    if (!items.some((it) => it.product_id)) return alert('Please select at least one god statue/item');

    try {
      setLoading(true);
      const supplier = suppliers.find((s) => String(s._id || s.id) === String(supplierId));
      const payload = {
        supplier_id: supplierId,
        supplier_name: supplier ? supplier.name : 'Artisan Foundry',
        purchase_date: purchaseDate,
        status,
        items: items.filter((it) => it.product_id),
        subtotal: grandTotal,
        grand_total: grandTotal,
      };

      await api.post('/purchases', payload);
      alert('Sourcing Purchase Order created successfully! Physical stock updated.');
      navigate('/purchases');
    } catch (err) {
      alert(err.message || 'Failed to create purchase order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Create Sourcing Purchase Order</h1>
          <p className="text-xs text-slate-500">
            Record intake order from sthapathis. Completing will automatically increase live stock.
          </p>
        </div>
        <Link
          to="/purchases"
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-xl text-xs font-bold shadow-sm cursor-pointer"
        >
          <i className="fas fa-arrow-left mr-1"></i> Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier Info Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Sthapathi / Foundry <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none cursor-pointer"
              >
                <option value="">Choose Supplier...</option>
                {suppliers.map((s) => (
                  <option key={s._id || s.id} value={s.legacyId || s.id || s._id}>
                    {s.name} {s.city ? `(${s.city})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Purchase Date</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none cursor-pointer"
              >
                <option value="received">Received (Auto-Restock Stock Now)</option>
                <option value="ordered">Ordered (Pending Delivery)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Line Items Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Idol Line Items</h3>
            <button
              type="button"
              onClick={addRow}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold cursor-pointer"
            >
              <i className="fas fa-plus mr-1"></i> Add Row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">God Statue / Item</th>
                  <th className="py-2.5 px-3 text-center w-28">Qty</th>
                  <th className="py-2.5 px-3 text-right w-36">Unit Cost (₹)</th>
                  <th className="py-2.5 px-3 text-right w-36">Total (₹)</th>
                  <th className="py-2.5 px-3 text-right w-16">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 font-sans">
                      <select
                        required
                        value={item.product_id}
                        onChange={(e) => handleProductSelect(idx, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 outline-none cursor-pointer"
                      >
                        <option value="">Select Statue...</option>
                        {products.map((p) => (
                          <option key={p._id || p.id} value={p.legacyId || p.id || p._id}>
                            {p.name} ({p.code || p.sku})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQtyChange(idx, e.target.value)}
                        className="w-20 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-center font-bold text-slate-900 outline-none"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        value={item.unit_cost}
                        onChange={(e) => handleCostChange(idx, e.target.value)}
                        className="w-28 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-right font-bold text-slate-900 outline-none"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      ₹{item.total.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeRow(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grand Total */}
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-mono">
            <span className="text-slate-500 font-sans font-bold uppercase">Grand Total Amount:</span>
            <span className="text-2xl font-black text-slate-900">₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="gold-btn px-8 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
          >
            <i className="fas fa-check"></i> {loading ? 'Saving...' : 'Save Sourcing Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
