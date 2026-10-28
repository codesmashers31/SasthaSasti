import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    mobile: '',
    email: '',
    gst_number: '',
    address: '',
    city: 'Swamimalai',
    state: 'Tamil Nadu',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/suppliers?search=${encodeURIComponent(search)}`);
      if (res && res.data) setSuppliers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormData({
      name: '',
      contact_person: '',
      mobile: '',
      email: '',
      gst_number: '',
      address: '',
      city: 'Swamimalai',
      state: 'Tamil Nadu',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSupplier(s);
    setFormData({
      name: s.name,
      contact_person: s.contact_person || '',
      mobile: s.mobile || s.phone || '',
      email: s.email || '',
      gst_number: s.gst_number || '',
      address: s.address || '',
      city: s.city || 'Swamimalai',
      state: s.state || 'Tamil Nadu',
    });
    setShowModal(true);
  };

  const handleDelete = async (id, sName) => {
    if (!window.confirm(`Delete artisan / foundry "${sName}"?`)) return;
    try {
      await api.delete(`/suppliers/${id}`);
      fetchSuppliers();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier._id || editingSupplier.id}`, formData);
      } else {
        await api.post('/suppliers', formData);
      }
      setShowModal(false);
      fetchSuppliers();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Master Sthapathis & Bronze Foundries</h1>
          <p className="text-xs text-slate-500">
            Track traditional sculptors, raw brass metal foundries, purchase history, and outstanding payables
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <i className="fas fa-hammer"></i> Register Sthapathi / Foundry
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchSuppliers()}
            placeholder="Search Artisan or Foundry by name, phone, city..."
            className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 outline-none"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <i className="fas fa-spinner fa-spin text-2xl text-amber-600 mb-2"></i>
            <p className="text-xs">Loading sthapathis & foundries...</p>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
              <i className="fas fa-hammer text-2xl"></i>
            </div>
            <h3 className="text-sm font-bold text-slate-800">No suppliers found</h3>
            <p className="text-xs text-slate-400 mt-1">Get started by registering your first artisan or foundry above.</p>
          </div>
        ) : (
          suppliers.map((s) => (
            <div
              key={s._id || s.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-mono font-bold text-xs border border-amber-200">
                    {s.supplier_code || s.code || `SUP-${s.legacyId || s.id}`}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {s.city || 'Swamimalai'}, {s.state || 'Tamil Nadu'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{s.name}</h3>
                <div className="text-xs text-slate-600 font-medium">
                  {s.contact_person || 'Master Artisan'}
                </div>
                <div className="text-xs font-mono text-slate-500 mt-1">
                  {s.mobile || s.phone || '—'} • {s.email || 'No email'}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Outstanding Payable</span>
                  <span
                    className={`text-sm font-black ${
                      (parseFloat(s.outstanding_balance) || 0) > 0 ? 'text-amber-800' : 'text-emerald-700'
                    }`}
                  >
                    ₹{parseFloat(s.outstanding_balance || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-1 font-sans">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(s)}
                    title="Edit"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-amber-800 text-xs transition-colors cursor-pointer"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s._id || s.id, s.name)}
                    title="Delete"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 text-xs transition-colors cursor-pointer"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Add / Edit Supplier */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingSupplier ? 'Edit Sthapathi / Foundry' : 'Register Sthapathi / Foundry'}
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
                <label className="block font-bold text-slate-700 mb-1">
                  Foundry / Workshop Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Swamimalai Bronze Heritage Works"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Master Sthapathi / Contact</label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    placeholder="Master Devasenapathy"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="9443100001"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="foundry@domain.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={formData.gst_number}
                    onChange={(e) => setFormData({ ...formData, gst_number: e.target.value.toUpperCase() })}
                    placeholder="33AABCF9876K1Z2"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City / Town</label>
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
                  Save Sthapathi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
