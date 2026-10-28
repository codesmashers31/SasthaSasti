import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export default function RolesList() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Selected role modal
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [showPermsModal, setShowPermsModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rRes, pRes, uRes] = await Promise.all([
        api.get('/roles'),
        api.get('/permissions'),
        api.get('/users'),
      ]);
      if (rRes && rRes.data) setRoles(rRes.data);
      if (pRes && pRes.data) setPermissions(pRes.data);
      if (uRes && uRes.data) setUsersList(uRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openRolePermissions = (role) => {
    setSelectedRole(role);
    setRolePermissions(role.permissions || []);
    setShowPermsModal(true);
  };

  const handleTogglePerm = (slug) => {
    setRolePermissions((prev) =>
      prev.includes(slug) ? prev.filter((p) => p !== slug) : [...prev, slug]
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    try {
      await api.put(`/roles/${selectedRole._id || selectedRole.id}/permissions`, {
        permissions: rolePermissions,
      });
      alert(`Permissions updated for role ${selectedRole.name}!`);
      setShowPermsModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update permissions');
    }
  };

  // Group permissions by module
  const groupedPerms = permissions.reduce((acc, p) => {
    const mod = p.module || 'General';
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">User Roles & Access Permissions</h1>
          <p className="text-xs text-slate-500">
            Fine-grained Role-Based Access Control (RBAC) governing 44 actions across modules
          </p>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <i className="fas fa-spinner fa-spin text-2xl text-amber-600 mb-2"></i>
            <p className="text-xs">Loading RBAC roles & permissions...</p>
          </div>
        ) : (
          roles.map((r) => (
            <div
              key={r._id || r.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-mono font-bold text-xs border border-amber-200">
                    {r.slug}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    <i className="fas fa-users text-amber-600"></i> {r.user_count || 0} users
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5">{r.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {r.description || 'System defined access role.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  {r.permissions ? r.permissions.length : 0} Permissions
                </span>
                <button
                  type="button"
                  onClick={() => openRolePermissions(r)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  View Permissions
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Active Login Candidates Table */}
      <div className="mt-8">
        <h2 className="text-lg font-extrabold text-slate-900 mb-4">Active Login Candidates</h2>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {usersList.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{u.username}</td>
                    <td className="py-3 px-4 text-slate-500">{u.email || '—'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                        {u.role_name || u.role_slug || 'Staff'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Role Permissions Modal */}
      {showPermsModal && selectedRole && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-3xl shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Manage Permissions: {selectedRole.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {rolePermissions.length} of {permissions.length} permissions active
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPermsModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {Object.entries(groupedPerms).map(([mod, perms]) => (
                <div key={mod} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-2 flex items-center gap-1.5">
                    <i className="fas fa-cube text-amber-600"></i> {mod} Module
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {perms.map((p) => {
                      const isChecked = rolePermissions.includes(p.slug);
                      return (
                        <label
                          key={p.slug}
                          className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-amber-50/80 border-amber-300 text-amber-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleTogglePerm(p.slug)}
                            className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                          />
                          <span className="text-xs truncate">{p.name || p.slug}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowPermsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePermissions}
                className="gold-btn px-6 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
