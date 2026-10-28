import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Sastha Sasti Enterprise / Divya Murti',
    gstin: '33AABCG1234H1Z0'
  });

  useEffect(() => {
    // Fetch store branding settings if available
    api.get('/settings')
      .then(res => {
        if (res.data && res.data.settings) {
          const map = {};
          res.data.settings.forEach(s => map[s.key] = s.value);
          setCompanyInfo({
            name: map.company_name || 'Sastha Sasti Enterprise / Divya Murti',
            gstin: map.company_gstin || '33AABCG1234H1Z0'
          });
        }
      })
      .catch(() => {});

    // Global shortcut [F2] to navigate to POS
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        navigate('/pos');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm sticky top-0">
      {/* Left: Breadcrumb / Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <i className="fas fa-store text-amber-600 text-sm"></i>
          <span className="text-slate-900 font-bold">{companyInfo.name}</span>
          <span>/</span>
          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-mono text-[11px] border border-amber-200">
            GSTIN: {companyInfo.gstin}
          </span>
        </div>
      </div>

      {/* Right: Fast Actions & Shortcuts */}
      <div className="flex items-center gap-3">
        {/* Quick POS Trigger */}
        <Link
          to="/pos"
          className="gold-btn text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
        >
          <i className="fas fa-bolt"></i>
          <span className="hidden sm:inline">POS Terminal</span>
          <kbd className="hidden md:inline-block bg-amber-800/30 text-white px-1.5 py-0.5 rounded text-[10px] font-mono">
            F2
          </kbd>
        </Link>

        {/* Quick Stock Adjustment */}
        <Link
          to="/inventory"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <i className="fas fa-sliders-h text-amber-600"></i>
          <span className="hidden sm:inline">Stock Entry</span>
        </Link>

        {/* User Role Tag */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-800 truncate max-w-[150px]">
            {user?.name || 'Administrator'}
          </span>
          <span className="text-[10px] text-amber-800 font-semibold bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
            {user?.role_name || user?.role_slug || 'Super Admin'}
          </span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={logout}
          title="Sign Out"
          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 border border-slate-200 flex items-center justify-center transition-colors text-xs"
        >
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </header>
  );
}
