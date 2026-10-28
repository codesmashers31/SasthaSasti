import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Search, Plus, Receipt, CheckCircle, Clock } from 'lucide-react';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    payee_name: '',
    category_name: 'Store Maintenance & Utilities',
    amount: 1500,
    payment_method: 'cash',
    status: 'approved',
    description: '',
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/expenses?search=${encodeURIComponent(search)}`);
      if (res.success) setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', formData);
      alert('Expense recorded successfully');
      setShowAddModal(false);
      setFormData({
        payee_name: '',
        category_name: 'Store Maintenance & Utilities',
        amount: 1500,
        payment_method: 'cash',
        status: 'approved',
        description: '',
      });
      fetchExpenses();
    } catch (err) {
      alert(err.message || 'Failed to save expense');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Operating Expenses & Vouchers</h2>
          <p className="text-xs text-slate-500">Showroom rent, packaging materials, brass polishing, and artisan transport vouchers</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchExpenses()}
              placeholder="Search Payee or Voucher #..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200/80">
            <tr>
              <th className="py-3.5 px-4">Voucher No</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Payee / Vendor</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Payment Mode</th>
              <th className="py-3.5 px-4 text-right">Approval</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400">Loading expenses...</td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400">No expenses recorded yet.</td>
              </tr>
            ) : (
              expenses.map((e) => (
                <tr key={e._id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-700">{e.expense_no}</td>
                  <td className="py-3.5 px-4 text-slate-600">{e.expense_date}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{e.payee_name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{e.category_name}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">₹{Number(e.total_amount).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 uppercase font-semibold text-slate-700">{e.payment_method}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 capitalize">
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-5 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Record Operating Expense</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Payee / Vendor Name *</label>
                <input
                  type="text"
                  required
                  value={formData.payee_name}
                  onChange={(e) => setFormData({ ...formData, payee_name: e.target.value })}
                  placeholder="e.g. Madurai Freight Movers or TNEB Electricity"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Expense Category</label>
                <select
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Store Maintenance & Utilities">Store Maintenance & Utilities</option>
                  <option value="Packaging & Bubble Wrap">Packaging & Bubble Wrap</option>
                  <option value="Transportation & Freight">Transportation & Freight</option>
                  <option value="Brass Polish & Chemicals">Brass Polish & Chemicals</option>
                  <option value="Staff Refreshments & Food">Staff Refreshments & Food</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-base text-amber-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="cash">Showroom Main Cash Drawer</option>
                  <option value="upi">SBI UPI Merchant Account</option>
                  <option value="bank_transfer">HDFC Bank Current Account</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Voucher Note</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Courier charges for Panchaloha Ganesha idol delivery to Bangalore"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md shadow-amber-600/20"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
