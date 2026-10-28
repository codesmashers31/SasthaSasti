import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PosTerminal from './pages/pos/PosTerminal';
import CustomerInvoices from './pages/invoices/CustomerInvoices';
import SupplierInvoices from './pages/invoices/SupplierInvoices';
import ProductList from './pages/products/ProductList';
import InventoryList from './pages/inventory/InventoryList';
import CustomerList from './pages/customers/CustomerList';
import SupplierList from './pages/suppliers/SupplierList';
import AccountsList from './pages/accounts/AccountsList';
import PaymentsList from './pages/accounts/PaymentsList';
import ExpenseList from './pages/expenses/ExpenseList';
import ReportsPage from './pages/reports/ReportsPage';
import CategoryList from './pages/categories/CategoryList';
import SubCategoryList from './pages/categories/SubCategoryList';
import PurchaseList from './pages/purchases/PurchaseList';
import PurchaseCreate from './pages/purchases/PurchaseCreate';
import SalesReturnList from './pages/sales-returns/SalesReturnList';
import SalesReturnCreate from './pages/sales-returns/SalesReturnCreate';
import BarcodeSettings from './pages/settings/BarcodeSettings';
import UserList from './pages/users/UserList';
import RolesList from './pages/roles/RolesList';
import DepartmentList from './pages/departments/DepartmentList';
import SettingsPage from './pages/settings/SettingsPage';
import AuditList from './pages/audit/AuditList';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Reset window & document scrolling
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Reset layout main container scrolling
    const mainEl = document.getElementById('main-content-scroll');
    if (mainEl) {
      mainEl.scrollTop = 0;
      if (typeof mainEl.scrollTo === 'function') {
        mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }
  }, [pathname, search]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Sacred POS Billing Terminal */}
            <Route path="pos" element={<PosTerminal />} />
            <Route path="billing" element={<PosTerminal />} />

            {/* Sales Invoices Register */}
            <Route path="customer-invoices" element={<CustomerInvoices />} />
            <Route path="invoices" element={<CustomerInvoices />} />

            {/* Supplier Invoices Register */}
            <Route path="billing/invoices" element={<SupplierInvoices />} />

            {/* Products & Deities Catalog */}
            <Route path="products" element={<ProductList />} />
            <Route path="barcode-settings" element={<BarcodeSettings />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="subcategories" element={<SubCategoryList />} />

            {/* Physical Inventory & Stock */}
            <Route path="inventory" element={<InventoryList />} />

            {/* Sourcing Purchases & Procurement */}
            <Route path="purchases" element={<PurchaseList />} />
            <Route path="purchases/create" element={<PurchaseCreate />} />

            {/* Sales Returns & Exchanges */}
            <Route path="sales-returns" element={<SalesReturnList />} />
            <Route path="sales-returns/create" element={<SalesReturnCreate />} />

            {/* Parties & CRM */}
            <Route path="suppliers" element={<SupplierList />} />
            <Route path="customers" element={<CustomerList />} />

            {/* Accounts & Cash Book */}
            <Route path="accounts" element={<AccountsList />} />
            <Route path="accounts/payments" element={<PaymentsList />} />
            <Route path="expenses" element={<ExpenseList />} />

            {/* Business Analytics & Reports */}
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/sales" element={<ReportsPage />} />
            <Route path="reports/inventory" element={<ReportsPage />} />
            <Route path="reports/financial" element={<ReportsPage />} />

            {/* Administration & Roles */}
            <Route path="users" element={<UserList />} />
            <Route path="roles" element={<RolesList />} />
            <Route path="departments" element={<DepartmentList />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="audit" element={<AuditList />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
