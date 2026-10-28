import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === '/' && (currentPath === '/' || currentPath === '/dashboard')) return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed lg:static top-0 lg:top-auto bottom-0 lg:bottom-auto left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-full overflow-hidden transition-transform duration-300 shadow-md lg:shadow-none select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-amber-50 rounded-xl border border-amber-200/80 flex items-center justify-center shrink-0">
              <img src="/images/logo.png" alt="Sastha Sasti" className="w-8 h-8 object-contain" />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-sm font-extrabold text-slate-900 leading-tight truncate">Sastha Sasti</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 block">Enterprise ERP</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="Close Menu"
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>

        {/* Scrollable Navigation Menus */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-semibold text-slate-600">
          {/* Executive Dashboard */}
          {user?.username !== 'priya' && (
            <NavLink
              to="/"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive('/')
                  ? 'bg-amber-600 text-white font-bold shadow-md'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <i className={`fas fa-th-large text-sm w-4 ${isActive('/') ? 'text-white' : 'text-slate-400'}`}></i>
              <span>Executive Dashboard</span>
            </NavLink>
          )}

          {/* POS Billing Terminal */}
          <NavLink
            to="/pos"
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
              isActive('/pos')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 font-bold'
            }`}
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-cash-register text-sm w-4"></i>
              <span>POS Billing Terminal</span>
            </div>
            <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-extrabold ${
              isActive('/pos') ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-900'
            }`}>
              Fast
            </span>
          </NavLink>

          {/* Customer Invoice Details */}
          <NavLink
            to="/customer-invoices"
            className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
              isActive('/customer-invoices')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <i className={`fas fa-file-invoice text-sm w-4 ${isActive('/customer-invoices') ? 'text-white' : 'text-slate-400'}`}></i>
              <span>Customer Invoice Details</span>
            </div>
          </NavLink>

          {/* Product Entries Section */}
          <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Product Entries
          </div>
          <NavLink
            to="/products"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/products')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-dharmachakra text-sm w-4 ${isActive('/products') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Product Entries</span>
          </NavLink>
          <NavLink
            to="/barcode-settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/barcode-settings')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-barcode text-sm w-4 ${isActive('/barcode-settings') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Barcode Customization</span>
          </NavLink>
          <NavLink
            to="/categories"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/categories')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-tags text-sm w-4 ${isActive('/categories') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Categories</span>
          </NavLink>
          <NavLink
            to="/subcategories"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/subcategories')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-sitemap text-sm w-4 ${isActive('/subcategories') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Subcategories (Deities)</span>
          </NavLink>

          {/* Inventory & Logistics */}
          <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Inventory & Logistics
          </div>
          <NavLink
            to="/inventory"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/inventory')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-boxes text-sm w-4 ${isActive('/inventory') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Stock Control & Register</span>
          </NavLink>

          {/* Sales & Billing */}
          <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Sales & Billing
          </div>
          <NavLink
            to="/billing/invoices"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/billing/invoices')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-file-invoice-dollar text-sm w-4 ${isActive('/billing/invoices') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Invoice Management</span>
          </NavLink>
          <NavLink
            to="/sales-returns"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/sales-returns')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-undo-alt text-sm w-4 ${isActive('/sales-returns') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Sales Returns</span>
          </NavLink>

          {/* Procurement & Artisans */}
          <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Procurement & Artisans
          </div>
          <NavLink
            to="/purchases"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/purchases')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-truck-loading text-sm w-4 ${isActive('/purchases') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Sourcing Purchases</span>
          </NavLink>
          <NavLink
            to="/suppliers"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/suppliers')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-hammer text-sm w-4 ${isActive('/suppliers') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Artisans & Foundries</span>
          </NavLink>

          {/* Customer CRM */}
          <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Customer CRM
          </div>
          <NavLink
            to="/customers"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/customers')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-users text-sm w-4 ${isActive('/customers') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Customers & Ledgers</span>
          </NavLink>

          {/* Accounts & Finance */}
          <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Accounts & Ledgers
          </div>
          <NavLink
            to="/accounts"
            end
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              currentPath === '/accounts'
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-university text-sm w-4 ${currentPath === '/accounts' ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Accounts & Cash Book</span>
          </NavLink>
          <NavLink
            to="/accounts/payments"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/accounts/payments')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-money-check-alt text-sm w-4 ${isActive('/accounts/payments') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Receipts & Payouts</span>
          </NavLink>
          <NavLink
            to="/expenses"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/expenses')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-receipt text-sm w-4 ${isActive('/expenses') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Expense Vouchers</span>
          </NavLink>

          {/* Analytics & Reports */}
          <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Reports & Analytics
          </div>
          <NavLink
            to="/reports/sales"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/reports/sales')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-chart-line text-sm w-4 ${isActive('/reports/sales') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Sales Analytics</span>
          </NavLink>
          <NavLink
            to="/reports/inventory"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/reports/inventory')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-warehouse text-sm w-4 ${isActive('/reports/inventory') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Stock Valuation</span>
          </NavLink>
          <NavLink
            to="/reports/financial"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/reports/financial')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-balance-scale text-sm w-4 ${isActive('/reports/financial') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>P&L Statement</span>
          </NavLink>

          {/* Administration */}
          <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Administration
          </div>
          <NavLink
            to="/users"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/users')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-user-cog text-sm w-4 ${isActive('/users') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Staff & Roles</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/settings')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-cog text-sm w-4 ${isActive('/settings') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Settings</span>
          </NavLink>
          <NavLink
            to="/audit"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/audit')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-shield-alt text-sm w-4 ${isActive('/audit') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Audit Trail</span>
          </NavLink>

          {/* Permissions and Credits */}
          <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Permissions and Credits
          </div>
          <NavLink
            to="/roles"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              isActive('/roles')
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <i className={`fas fa-key text-sm w-4 ${isActive('/roles') ? 'text-white' : 'text-slate-400'}`}></i>
            <span>Permissions</span>
          </NavLink>
        </nav>

        {/* User Profile Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Staff User'}</div>
              <div className="text-[10px] text-amber-700 font-semibold truncate">{user?.role_name || user?.role_slug || 'Role'}</div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </aside>
    </>
  );
}
