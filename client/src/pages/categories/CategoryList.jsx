import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Layers, Plus, Trash2 } from 'lucide-react';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');

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
      if (cRes.success) setCategories(cRes.data);
      if (sRes.success) setSubcategories(sRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await api.post('/categories', { name: newCatName.trim() });
      setNewCatName('');
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to add category');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Categories & Subcategories</h2>
        <p className="text-xs text-slate-500">Classification of deities, religious items, pooja articles and finishes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs h-fit">
          <h3 className="font-bold text-slate-800 text-sm mb-3">Add Category</h3>
          <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category Name</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Temple Brass Bells"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition shadow-xs"
            >
              Add Category
            </button>
          </form>
        </div>

        {/* Categories Grid (2 cols) */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <h3 className="font-bold text-slate-800 text-sm mb-3">Active Categories ({categories.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {categories.map((c) => (
              <div key={c._id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800 capitalize">{c.name}</p>
                <p className="font-mono text-[10px] text-slate-400 mt-0.5">{c.code}</p>
              </div>
            ))}
          </div>

          <h3 className="font-bold text-slate-800 text-sm mt-6 mb-3">Subcategories ({subcategories.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {subcategories.map((sc) => (
              <div key={sc._id} className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/50">
                <p className="font-bold text-slate-800 capitalize">{sc.name}</p>
                <p className="text-[10px] text-amber-700">{sc.category_name || 'General'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
