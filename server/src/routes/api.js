import express from 'express';
import { protect, requirePermission } from '../middleware/auth.js';

import * as authController from '../controllers/authController.js';
import * as dashboardController from '../controllers/dashboardController.js';
import * as productController from '../controllers/productController.js';
import * as billingController from '../controllers/billingController.js';
import * as customerController from '../controllers/customerController.js';
import * as supplierController from '../controllers/supplierController.js';
import * as inventoryController from '../controllers/inventoryController.js';
import * as accountController from '../controllers/accountController.js';
import * as expenseController from '../controllers/expenseController.js';
import * as reportController from '../controllers/reportController.js';
import * as userController from '../controllers/userController.js';
import * as categoryController from '../controllers/categoryController.js';
import * as settingsController from '../controllers/settingsController.js';
import * as purchaseController from '../controllers/purchaseController.js';
import * as salesReturnController from '../controllers/salesReturnController.js';
import * as barcodeController from '../controllers/barcodeController.js';

const router = express.Router();

// 1. Auth & Profile
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);
router.put('/auth/profile', protect, authController.updateProfile);

// 2. Dashboard
router.get('/dashboard/stats', protect, dashboardController.getDashboardStats);

// 3. Products & Catalog
router.get('/products', protect, productController.getProducts);
router.get('/products/search/pos', protect, productController.searchForPos);
router.post('/products/scan', protect, productController.scanBarcode);
router.post('/products/save-detail', protect, requirePermission('products.create'), productController.saveProductDetail);
router.get('/products/:id', protect, productController.getProductById);
router.post('/products', protect, requirePermission('products.create'), productController.createProduct);
router.put('/products/:id', protect, requirePermission('products.edit'), productController.updateProduct);
router.delete('/products/:id', protect, requirePermission('products.delete'), productController.deleteProduct);

// 4. Billing & POS
router.post('/billing/checkout', protect, requirePermission('billing.create'), billingController.checkout);
router.get('/billing/invoices', protect, billingController.getInvoices);
router.get('/billing/invoices/:id', protect, billingController.getInvoiceById);
router.post('/billing/invoices/:id/cancel', protect, requirePermission('billing.cancel'), billingController.cancelInvoice);

// 5. Supplier Invoices & Payments Register
router.get('/billing/supplier-invoices', protect, supplierController.getSupplierInvoices);
router.post('/billing/supplier-invoices/update-payment', protect, supplierController.updateSupplierPayment);

// 6. Customers & Ledgers
router.get('/customers', protect, customerController.getCustomers);
router.get('/customers/:id', protect, customerController.getCustomerById);
router.post('/customers', protect, customerController.createCustomer);
router.put('/customers/:id', protect, customerController.updateCustomer);
router.delete('/customers/:id', protect, customerController.deleteCustomer);

// 7. Suppliers & Artisans
router.get('/suppliers', protect, supplierController.getSuppliers);
router.get('/suppliers/:id', protect, supplierController.getSupplierById);
router.post('/suppliers', protect, supplierController.createSupplier);
router.post('/suppliers/save-with-products', protect, supplierController.saveWithProducts);
router.put('/suppliers/:id', protect, supplierController.updateSupplier);
router.delete('/suppliers/:id', protect, supplierController.deleteSupplier);
router.post('/suppliers/:id/pay', protect, supplierController.recordPayment);

// 8. Sourcing Purchases (Procurement)
router.get('/purchases', protect, purchaseController.getPurchases);
router.get('/purchases/:id', protect, purchaseController.getPurchaseById);
router.post('/purchases', protect, requirePermission('purchases.create'), purchaseController.createPurchase);

// 9. Sales Returns & Exchange
router.get('/sales-returns', protect, salesReturnController.getSalesReturns);
router.get('/sales-returns/lookup/:invoiceNo', protect, salesReturnController.lookupInvoice);
router.post('/sales-returns', protect, requirePermission('billing.returns'), salesReturnController.createSalesReturn);

// 10. Inventory & Stock Control
router.get('/inventory', protect, inventoryController.getInventory);
router.post('/inventory/adjust', protect, requirePermission('inventory.adjust'), inventoryController.adjustStock);
router.get('/inventory/transactions', protect, inventoryController.getTransactions);

// 11. Accounts, Cash Book & Payments
router.get('/accounts', protect, accountController.getAccounts);
router.get('/accounts/:id/ledger', protect, accountController.getAccountLedger);
router.post('/accounts', protect, accountController.createAccount);
router.get('/payments', protect, accountController.getPayments);
router.post('/payments', protect, accountController.recordPayment);

// 12. Operating Expenses
router.get('/expenses', protect, expenseController.getExpenses);
router.post('/expenses', protect, expenseController.createExpense);
router.get('/expenses/categories', protect, expenseController.getExpenseCategories);

// 13. Reports & Analytics
router.get('/reports/sales', protect, reportController.getSalesReport);
router.get('/reports/inventory', protect, reportController.getInventoryReport);
router.get('/reports/financial', protect, reportController.getFinancialReport);

// 14. Categories & Subcategories
router.get('/categories', protect, categoryController.getCategories);
router.post('/categories', protect, categoryController.createCategory);
router.put('/categories/:id', protect, categoryController.updateCategory);
router.delete('/categories/:id', protect, categoryController.deleteCategory);
router.get('/subcategories', protect, categoryController.getSubCategories);
router.post('/subcategories', protect, categoryController.createSubCategory);

// 15. Staff, Roles & Permissions
router.get('/users', protect, userController.getUsers);
router.post('/users', protect, requirePermission('users.create'), userController.createUser);
router.put('/users/:id', protect, requirePermission('users.edit'), userController.updateUser);
router.put('/users/:id/toggle', protect, userController.toggleUserStatus);
router.get('/roles', protect, userController.getRoles);
router.get('/permissions', protect, userController.getPermissions);
router.put('/roles/:id/permissions', protect, userController.updateRolePermissions);
router.get('/departments', protect, userController.getDepartments);
router.post('/departments', protect, userController.createDepartment);
router.delete('/departments/:id', protect, userController.deleteDepartment);

// 16. Barcode Customization & Generator
router.get('/barcode/settings', protect, barcodeController.getBarcodeSettings);
router.post('/barcode/settings', protect, barcodeController.saveBarcodeSettings);

// 17. Settings & Audit
router.get('/settings', protect, settingsController.getSettings);
router.post('/settings', protect, settingsController.updateSettings);
router.get('/audit', protect, settingsController.getAuditLogs);

export default router;
