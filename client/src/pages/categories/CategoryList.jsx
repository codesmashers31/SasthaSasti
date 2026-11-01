import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function CategoryList() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingCat, setSubmittingCat] = useState(false);
  const [submittingSubcat, setSubmittingSubcat] = useState(false);

  // New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Modals State
  const [editingCategory, setEditingCategory] = useState(null);
  const [showEditCatModal, setShowEditCatModal] = useState(false);
  const [editCatForm, setEditCatForm] = useState({ name: '', code: '', description: '' });

  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [editingSubcat, setEditingSubcat] = useState(null);
  const [showEditSubModal, setShowEditSubModal] = useState(false);
  const [subcatForm, setSubcatForm] = useState({ name: '', code: '', category_id: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cRes, sRes] = await Promise.all([
        api.get('/categories'),
        api.get('/subcategories'),
      ]);
      if (cRes.success) setCategories(cRes.data || []);
      if (sRes.success) setSubcategories(sRes.data || []);
    } catch (err) {
      console.error(err);
      showToast('error', err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  // --- Category Actions ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      showToast('warning', 'Please enter a Category Name.');
      return;
    }
    try {
      setSubmittingCat(true);
      await api.post('/categories', {
        name: newCatName.trim(),
        code: newCatCode.trim() || undefined,
        description: newCatDesc.trim(),
      });
      showToast('success', `Category "${newCatName.trim()}" created successfully!`);
      setNewCatName('');
      setNewCatCode('');
      setNewCatDesc('');
      fetchData();
    } catch (err) {
      showToast('error', err.message || 'Failed to add category');
    } finally {
      setSubmittingCat(false);
    }
  };

  const openEditCategory = (cat) => {
    setEditingCategory(cat);
    setEditCatForm({
      name: cat.name || '',
      code: cat.code || '',
      description: cat.description || '',
    });
    setShowEditCatModal(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCatForm.name.trim()) {
      showToast('warning', 'Category Name is required.');
      return;
    }
    try {
      setSubmittingCat(true);
      await api.put(`/categories/${editingCategory._id || editingCategory.id}`, editCatForm);
      showToast('success', 'Category updated successfully!');
      setShowEditCatModal(false);
      fetchData();
    } catch (err) {
      showToast('error', err.message || 'Failed to update category');
    } finally {
      setSubmittingCat(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}" and its subcategories?`)) return;
    try {
      await api.delete(`/categories/${cat._id || cat.id}`);
      showToast('success', `Category "${cat.name}" deleted successfully.`);
      fetchData();
    } catch (err) {
      showToast('error', err.message || 'Failed to delete category');
    }
  };

  // --- Subcategory Actions ---
  const openAddSubcategory = () => {
    const defaultCatId = categories[0]?._id || categories[0]?.id || categories[0]?.legacyId || '';
    setSubcatForm({
      name: '',
      code: '',
      category_id: defaultCatId,
      description: '',
    });
    setShowAddSubModal(true);
  };

  const handleCreateSubcategory = async (e) => {
    e.preventDefault();
    if (!subcatForm.name.trim()) {
      showToast('warning', 'Subcategory Name is required.');
      return;
    }
    try {
      setSubmittingSubcat(true);
      await api.post('/subcategories', subcatForm);
      showToast('success', `Subcategory "${subcatForm.name.trim()}" created successfully!`);
      setShowAddSubModal(false);
      fetchData();
    } catch (err) {
      showToast('error', err.message || 'Failed to create subcategory');
    } finally {
      setSubmittingSubcat(false);
    }
  };

  const openEditSubcategory = (sc) => {
    setEditingSubcat(sc);
    setSubcatForm({
      name: sc.name || '',
      code: sc.code || '',
      category_id: sc.category_id || (categories[0]?._id || categories[0]?.id || ''),
      description: sc.description || '',
    });
    setShowEditSubModal(true);
  };

  const handleUpdateSubcategory = async (e) => {
    e.preventDefault();
    if (!subcatForm.name.trim()) {
      showToast('warning', 'Subcategory Name is required.');
      return;
    }
    try {
      setSubmittingSubcat(true);
      await api.put(`/subcategories/${editingSubcat._id || editingSubcat.id}`, subcatForm);
      showToast('success', 'Subcategory updated successfully!');
      setShowEditSubModal(false);
      fetchData();
    } catch (err) {
      showToast('error', err.message || 'Failed to update subcategory');
    } finally {
      setSubmittingSubcat(false);
    }
  };

  const handleDeleteSubcategory = async (sc) => {
    if (!window.confirm(`Are you sure you want to delete subcategory "${sc.name}"?`)) return;
    try {
      await api.delete(`/subcategories/${sc._id || sc.id}`);
      showToast('success', `Subcategory "${sc.name}" deleted.`);
      fetchData();
    } catch (err) {
      showToast('error', err.message || 'Failed to delete subcategory');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Categories & Subcategories</h2>
          <p className="text-xs text-slate-500">
            Classification of deities, religious items, pooja articles, brass idols, and sacred finishes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openAddSubcategory}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <i className="fas fa-plus"></i> Add Subcategory
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Add Category Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs h-fit space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Add Category</h3>
            <p className="text-[11px] text-slate-400">Create new high-level deity or pooja category</p>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Temple Brass Bells"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Category Code (Optional)</label>
              <input
                type="text"
                value={newCatCode}
                onChange={(e) => setNewCatCode(e.target.value.toUpperCase())}
                placeholder="e.g. CAT-BELL-100"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:border-amber-500 outline-none uppercase"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Description (Optional)</label>
              <textarea
                rows="2"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Brief notes about this category..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submittingCat}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              {submittingCat && <i className="fas fa-spinner fa-spin text-xs"></i>}
              <span>{submittingCat ? 'Adding...' : 'Add Category'}</span>
            </button>
          </form>
        </div>

        {/* Right Columns: Categories and Subcategories Display */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Categories Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <i className="fas fa-tags text-amber-600"></i>
                <span>Active Categories ({categories.length})</span>
              </h3>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <i className="fas fa-spinner fa-spin text-lg text-amber-600 mb-2 block"></i>
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No active categories found. Add your first category on the left.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {categories.map((c) => (
                  <div
                    key={c._id || c.id}
                    className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-amber-300 transition-all shadow-xs flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-bold text-slate-800 capitalize leading-snug">{c.name}</p>
                        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => openEditCategory(c)}
                            title="Edit Category"
                            className="p-1 rounded-md bg-white border border-slate-200 hover:bg-amber-50 hover:border-amber-300 text-amber-700 text-[11px] transition cursor-pointer"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(c)}
                            title="Delete Category"
                            className="p-1 rounded-md bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-rose-600 text-[11px] transition cursor-pointer"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                      <p className="font-mono text-[10px] text-slate-400 mt-1">{c.code || 'CAT-AUTO'}</p>
                      {c.description && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{c.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subcategories Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <i className="fas fa-sitemap text-amber-600"></i>
                <span>Subcategories ({subcategories.length})</span>
              </h3>
              <button
                type="button"
                onClick={openAddSubcategory}
                className="text-amber-700 hover:text-amber-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <i className="fas fa-plus-circle"></i> Add New
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <i className="fas fa-spinner fa-spin text-lg text-amber-600 mb-2 block"></i>
                Loading subcategories...
              </div>
            ) : subcategories.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No subcategories added yet. Click "+ Add Subcategory" to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {subcategories.map((sc) => (
                  <div
                    key={sc._id || sc.id}
                    className="p-3.5 bg-amber-50/40 hover:bg-white rounded-xl border border-amber-200/60 hover:border-amber-400 transition-all shadow-xs flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-bold text-slate-800 capitalize leading-snug">{sc.name}</p>
                        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => openEditSubcategory(sc)}
                            title="Edit Subcategory"
                            className="p-1 rounded-md bg-white border border-slate-200 hover:bg-amber-100 hover:border-amber-400 text-amber-700 text-[11px] transition cursor-pointer"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubcategory(sc)}
                            title="Delete Subcategory"
                            className="p-1 rounded-md bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-rose-600 text-[11px] transition cursor-pointer"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-800 bg-amber-100/70 border border-amber-200 mt-1">
                        {sc.category_name || 'General Category'}
                      </span>
                      {sc.code && <p className="font-mono text-[10px] text-slate-400 mt-1">{sc.code}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL: Edit Category --- */}
      {showEditCatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Edit Category</h3>
              <button
                type="button"
                onClick={() => setShowEditCatModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editCatForm.name}
                  onChange={(e) => setEditCatForm({ ...editCatForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Code</label>
                <input
                  type="text"
                  value={editCatForm.code}
                  onChange={(e) => setEditCatForm({ ...editCatForm, code: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none focus:border-amber-500 uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={editCatForm.description}
                  onChange={(e) => setEditCatForm({ ...editCatForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditCatModal(false)}
                  disabled={submittingCat}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCat}
                  className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
                >
                  {submittingCat && <i className="fas fa-spinner fa-spin text-xs"></i>}
                  <span>{submittingCat ? 'Updating...' : 'Update Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: Add / Edit Subcategory --- */}
      {(showAddSubModal || showEditSubModal) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {showEditSubModal ? 'Edit Subcategory' : 'Add Subcategory'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddSubModal(false);
                  setShowEditSubModal(false);
                }}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form
              onSubmit={showEditSubModal ? handleUpdateSubcategory : handleCreateSubcategory}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Parent Category *</label>
                <select
                  required
                  value={subcatForm.category_id}
                  onChange={(e) => setSubcatForm({ ...subcatForm, category_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c._id || c.id} value={c._id || c.id || c.legacyId}>
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
                  value={subcatForm.name}
                  onChange={(e) => setSubcatForm({ ...subcatForm, name: e.target.value })}
                  placeholder="e.g. Lord Murugan (Kartikeya)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subcategory Code</label>
                <input
                  type="text"
                  value={subcatForm.code}
                  onChange={(e) => setSubcatForm({ ...subcatForm, code: e.target.value })}
                  placeholder="e.g. MURUGAN"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none focus:border-amber-500 uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={subcatForm.description}
                  onChange={(e) => setSubcatForm({ ...subcatForm, description: e.target.value })}
                  placeholder="Sacred iconography, posture details, and festivals..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSubModal(false);
                    setShowEditSubModal(false);
                  }}
                  disabled={submittingSubcat}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingSubcat}
                  className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
                >
                  {submittingSubcat && <i className="fas fa-spinner fa-spin text-xs"></i>}
                  <span>
                    {submittingSubcat
                      ? 'Saving...'
                      : showEditSubModal
                      ? 'Update Subcategory'
                      : 'Save Subcategory'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
