import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    customer_type: 'retail',
    gst_number: '',
    address: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    credit_limit: 50000,
  });

  useEffect(() => {
    fetchCustomers();
  }, [typeFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/customers?search=${encodeURIComponent(search)}&type=${typeFilter}`);
      if (res && res.data) setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      mobile: '',
      email: '',
      customer_type: 'retail',
      gst_number: '',
      address: '',
      city: 'Chennai',
      state: 'Tamil Nadu',
      credit_limit: 50000,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      mobile: c.mobile || '',
      email: c.email || '',
      customer_type: c.customer_type || 'retail',
      gst_number: c.gst_number || '',
      address: c.address || '',
      city: c.city || 'Chennai',
      state: c.state || 'Tamil Nadu',
      credit_limit: c.credit_limit || 50000,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer._id || editingCustomer.id}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      setShowModal(false);
      fetchCustomers();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Header with Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Customer CRM & Ledgers</h1>
          <p className="text-xs text-slate-500">
            Manage retail buyers, wholesale clients, temple trusts, credit limits, and outstanding balances
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <i className="fas fa-user-plus"></i> Add New Customer
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCustomers();
          }}
          className="grid grid-cols-1 sm:grid-cols-4 gap-3"
        >
          <div className="sm:col-span-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, code, email..."
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none"
            />
          </div>
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="retail">Retail Walk-in / Collector</option>
              <option value="wholesale">Wholesale Distributor</option>
              <option value="temple_trust">Temple Trust / Devasthanam</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
            >
              <i className="fas fa-search mr-1"></i> Filter
            </button>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setTypeFilter('');
                fetchCustomers();
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 px-3 py-2 rounded-xl text-xs cursor-pointer"
            >
              <i className="fas fa-redo"></i>
            </button>
          </div>
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Type & State</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Outstanding Balance</th>
                <th className="py-3.5 px-4">Credit Limit</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <i className="fas fa-spinner fa-spin text-2xl text-amber-600 mb-2"></i>
                    <p className="text-xs">Loading customer ledgers...</p>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No customers registered.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-amber-800 font-mono font-semibold">
                        {c.customer_code} {c.gst_number ? `• GST: ${c.gst_number}` : ''}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] uppercase font-bold border border-slate-200">
                        {(c.customer_type || 'retail').replace('_', ' ')}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {c.city || 'Chennai'}, {c.state || 'Tamil Nadu'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-mono font-bold">{c.mobile || '—'}</div>
                      <div className="text-[10px] text-slate-400">{c.email || 'N/A'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {(parseFloat(c.outstanding_balance) || 0) > 0 ? (
                        <span className="text-rose-600 font-black text-sm">
                          ₹{parseFloat(c.outstanding_balance).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold">₹0.00</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      ₹{parseFloat(c.credit_limit || 50000).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(c)}
                        title="Edit Customer"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-50 text-amber-800 text-xs cursor-pointer"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name / Trust Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Meenakshi Amman Temple Trust"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number (10 digits) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="9999999999"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Type</label>
                  <select
                    value={formData.customer_type}
                    onChange={(e) => setFormData({ ...formData, customer_type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="retail">Retail Walk-in / Collector</option>
                    <option value="wholesale">Wholesale Distributor</option>
                    <option value="temple_trust">Temple Trust / Devasthanam</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={formData.gst_number}
                    onChange={(e) => setFormData({ ...formData, gst_number: e.target.value.toUpperCase() })}
                    placeholder="33AABCT1234D1Z5"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={formData.credit_limit}
                    onChange={(e) => setFormData({ ...formData, credit_limit: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
