import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/departments');
      if (res && res.data) setDepartments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/departments', { name, code, description });
      setName('');
      setCode('');
      setDescription('');
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      alert(err.message || 'Failed to create department');
    }
  };

  const handleDelete = async (id, deptName) => {
    if (!window.confirm(`Delete department "${deptName}"?`)) return;
    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Organizational Departments</h1>
          <p className="text-xs text-slate-500">
            Divisions managing showroom sales, temple casting foundry, accounting, and inventory
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <i className="fas fa-plus"></i> Add Department
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <i className="fas fa-spinner fa-spin text-2xl text-amber-600 mb-2"></i>
            <p className="text-xs">Loading organizational wings...</p>
          </div>
        ) : (
          departments.map((d) => (
            <div
              key={d._id || d.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-mono font-bold text-xs border border-amber-200">
                    {d.code}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    <i className="fas fa-users text-amber-600"></i> {d.user_count || 0} staff
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5">{d.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {d.description || 'Organizational operational wing.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Active Division</span>
                <button
                  type="button"
                  onClick={() => handleDelete(d._id || d.id, d.name)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 text-xs cursor-pointer"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Department</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sculpting & Finishing Wing"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="DEP-SCULPT"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-amber-500 outline-none uppercase"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Role of this operational wing..."
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
                  className="gold-btn px-5 py-2 rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
