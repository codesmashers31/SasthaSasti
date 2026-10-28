import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export default function SubCategoryList() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSubcat, setEditingSubcat] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category_id: '',
    description: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [scRes, cRes] = await Promise.all([
        api.get('/subcategories'),
        api.get('/categories'),
      ]);
      if (scRes && scRes.data) setSubcategories(scRes.data);
      if (cRes && cRes.data) {
        setCategories(cRes.data);
        if (cRes.data.length > 0 && !formData.category_id) {
          setFormData((prev) => ({ ...prev, category_id: cRes.data[0].legacyId || cRes.data[0].id || cRes.data[0]._id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingSubcat(null);
    setFormData({
      name: '',
      code: '',
      category_id: categories[0]?.legacyId || categories[0]?.id || categories[0]?._id || '',
      description: '',
    });
    setShowModal(true);
  };

  const handleEdit = (subcat) => {
    setEditingSubcat(subcat);
    setFormData({
      name: subcat.name,
      code: subcat.code || '',
      category_id: subcat.category_id || '',
      description: subcat.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete subcategory "${name}"?`)) return;
    try {
      await api.delete(`/subcategories/${id}`);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubcat) {
        await api.put(`/subcategories/${editingSubcat._id || editingSubcat.id}`, formData);
      } else {
        await api.post('/subcategories', formData);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save subcategory');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Subcategories (Deities & Sacred Forms)</h1>
          <p className="text-xs text-slate-500">
            Classify specific god forms: Ganesha, Murugan, Shiva, Krishna, Lakshmi, Buddha, Deepams, etc.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <i className="fas fa-plus"></i> Add Subcategory
        </button>
      </div>

      {/* Subcategories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <i className="fas fa-spinner fa-spin text-2xl text-amber-600 mb-2"></i>
            <p className="text-xs">Loading sacred deity subcategories...</p>
          </div>
        ) : subcategories.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
              <i className="fas fa-sitemap text-2xl"></i>
            </div>
            <h3 className="text-sm font-bold text-slate-800">No subcategories found</h3>
            <p className="text-xs text-slate-400 mt-1">Get started by clicking "Add Subcategory" above.</p>
          </div>
        ) : (
          subcategories.map((s) => (
            <div
              key={s._id || s.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-mono font-bold text-xs border border-amber-200">
                    {s.code}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    {s.category_name || 'Category'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5">{s.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {s.description || 'Deity form and catalog classification.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                  <i className="fas fa-box text-amber-600"></i> {s.product_count || 0} items
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(s)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-amber-800 text-xs cursor-pointer"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s._id || s.id, s.name)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 text-xs cursor-pointer"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Subcategory Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingSubcat ? 'Edit Subcategory' : 'Add Subcategory'}
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
                <label className="block font-bold text-slate-700 mb-1">Parent Category *</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c._id || c.id} value={c.legacyId || c.id || c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subcategory Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Lord Ganesha (Vinayagar)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subcategory Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. GANESHA"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none focus:border-amber-500 uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Sacred iconography, posture details, and festivals..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                ></textarea>
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
                  Save Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
