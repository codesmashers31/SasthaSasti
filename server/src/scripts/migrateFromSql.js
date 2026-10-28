import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { parseSqlDump } from './parseSqlDump.js';

import Department from '../models/Department.js';
import Permission from '../models/Permission.js';
import Role from '../models/Role.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';
import Supplier from '../models/Supplier.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Account from '../models/Account.js';
import AccountTransaction from '../models/AccountTransaction.js';
import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import Purchase from '../models/Purchase.js';
import { Expense, ExpenseCategory } from '../models/Expense.js';
import SalesReturn from '../models/SalesReturn.js';
import Setting from '../models/Setting.js';
import ActivityLog from '../models/ActivityLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('🚀 Starting Data Migration: SQL Dump -> MongoDB Atlas / Local...');
  await connectDB();

  const sqlFilePath = path.resolve(__dirname, '../../../god_statue_erp_backup.sql');
  console.log(`Reading SQL dump from: ${sqlFilePath}`);
  const tables = parseSqlDump(sqlFilePath);

  const rowToObj = (rows, colNames) => {
    return rows.map(r => {
      const obj = {};
      colNames.forEach((col, idx) => {
        obj[col] = r[idx];
      });
      return obj;
    });
  };

  // 1. Departments
  console.log('\n--- Migrating Departments ---');
  await Department.deleteMany({});
  const deptCols = ['id', 'name', 'code', 'description', 'status', 'created_at', 'updated_at'];
  const depts = rowToObj(tables.departments || [], deptCols);
  for (const d of depts) {
    await Department.create({
      legacyId: d.id,
      name: d.name,
      code: d.code,
      description: d.description || '',
      status: d.status || 'active',
    });
  }
  console.log(`Migrated ${depts.length} departments.`);

  // 2. Permissions
  console.log('\n--- Migrating Permissions ---');
  await Permission.deleteMany({});
  const permCols = ['id', 'module', 'name', 'slug', 'description', 'created_at'];
  const perms = rowToObj(tables.permissions || [], permCols);
  const permMap = {}; // legacyId -> slug
  for (const p of perms) {
    permMap[p.id] = p.slug;
    await Permission.create({
      legacyId: p.id,
      module: p.module,
      name: p.name,
      slug: p.slug,
      description: p.description || '',
    });
  }
  console.log(`Migrated ${perms.length} permissions.`);

  // 3. Roles & Role Permissions
  console.log('\n--- Migrating Roles ---');
  await Role.deleteMany({});
  const roleCols = ['id', 'name', 'slug', 'description', 'is_system', 'status', 'created_at', 'updated_at'];
  const roles = rowToObj(tables.roles || [], roleCols);

  const rolePermMap = {}; // roleId -> [slugs]
  for (const rp of (tables.role_permissions || [])) {
    const roleId = rp[0];
    const permId = rp[1];
    if (!rolePermMap[roleId]) rolePermMap[roleId] = [];
    if (permMap[permId]) {
      rolePermMap[roleId].push(permMap[permId]);
    }
  }

  const roleMap = {}; // legacyId -> doc
  for (const r of roles) {
    const doc = await Role.create({
      legacyId: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description || '',
      is_system: Boolean(r.is_system),
      status: r.status || 'active',
      permissions: rolePermMap[r.id] || [],
    });
    roleMap[r.id] = doc;
  }
  console.log(`Migrated ${roles.length} roles.`);

  // 4. Users & User Permissions
  console.log('\n--- Migrating Users ---');
  await User.deleteMany({});
  const userCols = ['id', 'name', 'username', 'email', 'mobile', 'password', 'role_id', 'department_id', 'avatar', 'status', 'remember_token', 'last_login_at', 'last_login_ip', 'created_at', 'updated_at'];
  const users = rowToObj(tables.users || [], userCols);

  const userPermMap = {}; // userId -> [{ permission, is_granted }]
  for (const up of (tables.user_permissions || [])) {
    const userId = up[0];
    const permId = up[1];
    const isGranted = Boolean(up[2]);
    if (!userPermMap[userId]) userPermMap[userId] = [];
    if (permMap[permId]) {
      userPermMap[userId].push({
        permission: permMap[permId],
        is_granted: isGranted
      });
    }
  }

  const deptMap = {};
  for (const d of depts) deptMap[d.id] = d.name;

  for (const u of users) {
    const roleDoc = roleMap[u.role_id];
    await User.create({
      legacyId: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      mobile: u.mobile || '',
      password: u.password, // bcrypt hash preserved!
      role_id: u.role_id,
      role_slug: roleDoc ? roleDoc.slug : 'viewer',
      role_name: roleDoc ? roleDoc.name : 'Viewer',
      department_id: u.department_id,
      department_name: deptMap[u.department_id] || '',
      avatar: u.avatar,
      status: u.status || 'active',
      customPermissions: userPermMap[u.id] || [],
      last_login_at: u.last_login_at ? new Date(u.last_login_at) : null,
      last_login_ip: u.last_login_ip,
    });
  }
  console.log(`Migrated ${users.length} users with permissions.`);

  // 5. Categories & SubCategories
  console.log('\n--- Migrating Categories & Subcategories ---');
  await Category.deleteMany({});
  await SubCategory.deleteMany({});
  const catCols = ['id', 'name', 'code', 'description', 'image', 'status', 'created_at', 'updated_at'];
  const categories = rowToObj(tables.categories || [], catCols);
  const catMap = {}; // legacyId -> name
  for (const c of categories) {
    catMap[c.id] = c.name;
    await Category.create({
      legacyId: c.id,
      name: c.name,
      code: c.code,
      description: c.description || '',
      image: c.image,
      status: c.status || 'active',
    });
  }

  const subCatCols = ['id', 'category_id', 'name', 'code', 'description', 'image', 'status', 'created_at', 'updated_at'];
  const subcats = rowToObj(tables.subcategories || [], subCatCols);
  const subCatMap = {}; // legacyId -> name
  for (const sc of subcats) {
    subCatMap[sc.id] = sc.name;
    await SubCategory.create({
      legacyId: sc.id,
      category_id: sc.category_id,
      category_name: catMap[sc.category_id] || '',
      name: sc.name,
      code: sc.code,
      description: sc.description || '',
      status: sc.status || 'active',
    });
  }
  console.log(`Migrated ${categories.length} categories, ${subcats.length} subcategories.`);

  // 6. Suppliers & Supplier Payments
  console.log('\n--- Migrating Suppliers ---');
  await Supplier.deleteMany({});
  const supCols = ['id', 'supplier_code', 'name', 'company_name', 'mobile', 'email', 'address', 'city', 'state', 'gst_number', 'bank_name', 'bank_account_no', 'bank_ifsc', 'outstanding_balance', 'status', 'created_at', 'updated_at'];
  const suppliers = rowToObj(tables.suppliers || [], supCols);

  const supPayMap = {}; // supplierId -> { paid_amount, payment_status }
  const supPayCols = ['id', 'supplier_id', 'paid_amount', 'payment_status', 'payment_method', 'payment_date', 'notes', 'created_at', 'updated_at'];
  const supPayments = rowToObj(tables.supplier_payments || [], supPayCols);
  for (const sp of supPayments) {
    supPayMap[sp.supplier_id] = {
      paid_amount: Number(sp.paid_amount) || 0,
      payment_status: sp.payment_status || 'Unpaid',
      notes: sp.notes || ''
    };
  }

  const supMap = {}; // legacyId -> name
  for (const s of suppliers) {
    supMap[s.id] = s.name;
    const paymentInfo = supPayMap[s.id] || { paid_amount: 0, payment_status: 'Unpaid' };
    await Supplier.create({
      legacyId: s.id,
      supplier_code: s.supplier_code,
      name: s.name,
      contact_person: s.company_name || s.name,
      mobile: s.mobile,
      email: s.email || '',
      gstin: s.gst_number || '',
      address: s.address || '',
      city: s.city || '',
      state: s.state || 'Tamil Nadu',
      total_purchased: (Number(s.outstanding_balance) || 0) + paymentInfo.paid_amount,
      total_paid: paymentInfo.paid_amount,
      balance_due: Number(s.outstanding_balance) || 0,
      payment_status: paymentInfo.payment_status,
      notes: paymentInfo.notes || '',
      status: s.status || 'active',
    });
  }
  console.log(`Migrated ${suppliers.length} suppliers.`);

  // 7. Products
  console.log('\n--- Migrating Products ---');
  await Product.deleteMany({});
  const prodCols = ['id', 'name', 'code', 'sku', 'barcode', 'supplier_id', 'category_id', 'subcategory_id', 'brand', 'description', 'god_name', 'material', 'color', 'height', 'width', 'length', 'weight', 'size', 'finish_type', 'purchase_price', 'piece_rate', 'margin_percentage', 'selling_price', 'wholesale_price', 'discount_percent', 'gst_percent', 'hsn_code', 'current_stock', 'min_stock', 'max_stock', 'stock_location', 'image', 'status', 'created_by', 'updated_by', 'created_at', 'updated_at'];
  const products = rowToObj(tables.products || [], prodCols);

  for (const p of products) {
    await Product.create({
      legacyId: p.id,
      sku: p.sku || `SKU-${p.id}`,
      barcode: p.barcode || p.code || '',
      name: p.name,
      god_name: p.god_name || '',
      category_id: p.category_id,
      category_name: catMap[p.category_id] || '',
      subcategory_id: p.subcategory_id,
      subcategory_name: subCatMap[p.subcategory_id] || '',
      supplier_id: p.supplier_id,
      supplier_name: supMap[p.supplier_id] || '',
      material: p.material || 'Brass',
      finish_type: p.finish_type || 'Antique',
      height_inches: Number(p.height) || 0,
      width_inches: Number(p.width) || 0,
      depth_inches: Number(p.length) || 0,
      weight_kg: Number(p.weight) || 0,
      purchase_price: Number(p.purchase_price) || 0,
      selling_price: Number(p.selling_price) || 0,
      mrp: Number(p.piece_rate || p.selling_price) || 0,
      gst_percent: Number(p.gst_percent) || 12,
      hsn_code: p.hsn_code || '9701',
      current_stock: Number(p.current_stock) || 0,
      min_stock_alert: Number(p.min_stock) || 5,
      location: p.stock_location || '',
      description: p.description || '',
      images: p.image ? [p.image] : [],
      status: p.status || 'active',
    });
  }
  console.log(`Migrated ${products.length} products.`);

  // 8. Customers
  console.log('\n--- Migrating Customers ---');
  await Customer.deleteMany({});
  const custCols = ['id', 'customer_code', 'name', 'mobile', 'email', 'address', 'shipping_address', 'city', 'state', 'state_code', 'pincode', 'gst_number', 'credit_limit', 'outstanding_balance', 'customer_type', 'status', 'created_at', 'updated_at'];
  const customers = rowToObj(tables.customers || [], custCols);
  for (const c of customers) {
    await Customer.create({
      legacyId: c.id,
      customer_code: c.customer_code,
      name: c.name,
      mobile: c.mobile,
      email: c.email || '',
      gstin: c.gst_number || '',
      address_line1: c.address || '',
      city: c.city || '',
      state: c.state || 'Tamil Nadu',
      pincode: c.pincode || '',
      customer_type: c.customer_type || 'retail',
      credit_limit: Number(c.credit_limit) || 0,
      opening_balance: 0,
      current_balance: Number(c.outstanding_balance) || 0,
      status: c.status || 'active',
    });
  }
  console.log(`Migrated ${customers.length} customers.`);

  // 9. Accounts & Account Transactions
  console.log('\n--- Migrating Accounts & Transactions ---');
  await Account.deleteMany({});
  await AccountTransaction.deleteMany({});
  const accCols = ['id', 'account_code', 'name', 'type', 'bank_name', 'account_number', 'ifsc_code', 'opening_balance', 'current_balance', 'status', 'created_at', 'updated_at'];
  const accounts = rowToObj(tables.accounts || [], accCols);
  const accMap = {};
  for (const a of accounts) {
    accMap[a.id] = a.name;
    await Account.create({
      legacyId: a.id,
      account_code: a.account_code,
      name: a.name,
      type: a.type,
      bank_name: a.bank_name,
      account_number: a.account_number,
      ifsc_code: a.ifsc_code,
      opening_balance: Number(a.opening_balance) || 0,
      current_balance: Number(a.current_balance) || 0,
      status: a.status || 'active',
    });
  }

  const atCols = ['id', 'account_id', 'transaction_type', 'amount', 'balance_after', 'reference_type', 'reference_id', 'reference_no', 'description', 'transaction_date', 'created_by', 'created_at'];
  const accTxs = rowToObj(tables.account_transactions || [], atCols);
  for (const tx of accTxs) {
    await AccountTransaction.create({
      legacyId: tx.id,
      account_id: tx.account_id,
      account_name: accMap[tx.account_id] || '',
      transaction_type: tx.transaction_type,
      amount: Number(tx.amount) || 0,
      balance_after: Number(tx.balance_after) || 0,
      reference_type: tx.reference_type,
      reference_id: tx.reference_id,
      reference_no: tx.reference_no,
      description: tx.description,
      transaction_date: String(tx.transaction_date),
      created_by: tx.created_by,
    });
  }
  console.log(`Migrated ${accounts.length} accounts, ${accTxs.length} account transactions.`);

  // 10. Invoices and Invoice Items
  console.log('\n--- Migrating Invoices & Items ---');
  await Invoice.deleteMany({});
  const invItemCols = ['id', 'invoice_id', 'product_id', 'product_name', 'product_code', 'god_name', 'material', 'hsn_code', 'quantity', 'unit_price', 'discount_percent', 'discount_amount', 'tax_percent', 'tax_amount', 'total_amount'];
  const invItems = rowToObj(tables.invoice_items || [], invItemCols);
  const itemsByInvoice = {};
  for (const it of invItems) {
    if (!itemsByInvoice[it.invoice_id]) itemsByInvoice[it.invoice_id] = [];
    itemsByInvoice[it.invoice_id].push({
      product_id: it.product_id,
      product_name: it.product_name,
      product_code: it.product_code || '',
      god_name: it.god_name || '',
      material: it.material || '',
      hsn_code: it.hsn_code || '9701',
      quantity: Number(it.quantity) || 1,
      unit_price: Number(it.unit_price) || 0,
      discount_percent: Number(it.discount_percent) || 0,
      discount_amount: Number(it.discount_amount) || 0,
      tax_percent: Number(it.tax_percent) || 0,
      tax_amount: Number(it.tax_amount) || 0,
      total_amount: Number(it.total_amount) || 0,
    });
  }

  const custLookup = {};
  for (const c of customers) {
    custLookup[c.id] = c;
  }

  const invCols = ['id', 'invoice_no', 'invoice_type', 'reference_no', 'customer_id', 'user_id', 'invoice_date', 'due_date', 'invoice_time', 'subtotal', 'item_discount_total', 'overall_discount_percent', 'overall_discount_amount', 'cgst_amount', 'sgst_amount', 'igst_amount', 'tax_amount', 'additional_charges', 'round_off', 'grand_total', 'paid_amount', 'due_amount', 'payment_method', 'payment_terms', 'status', 'payment_status', 'notes', 'created_at', 'updated_at'];
  const invoices = rowToObj(tables.invoices || [], invCols);

  for (const inv of invoices) {
    const cust = custLookup[inv.customer_id] || {};
    await Invoice.create({
      legacyId: inv.id,
      invoice_no: inv.invoice_no,
      invoice_date: String(inv.invoice_date),
      invoice_time: inv.invoice_time || '12:00:00',
      customer_id: inv.customer_id,
      customer_name: cust.name || 'Walk-in Customer',
      customer_mobile: cust.mobile || '',
      customer_type: cust.customer_type || 'retail',
      subtotal: Number(inv.subtotal) || 0,
      item_discount_total: Number(inv.item_discount_total) || 0,
      overall_discount_percent: Number(inv.overall_discount_percent) || 0,
      overall_discount_amount: Number(inv.overall_discount_amount) || 0,
      taxable_amount: (Number(inv.subtotal) || 0) - (Number(inv.item_discount_total) || 0) - (Number(inv.overall_discount_amount) || 0),
      tax_total: Number(inv.tax_amount) || 0,
      round_off: Number(inv.round_off) || 0,
      grand_total: Number(inv.grand_total) || 0,
      paid_amount: Number(inv.paid_amount) || 0,
      balance_amount: Number(inv.due_amount) || 0,
      payment_status: (inv.payment_status || 'paid').toLowerCase(),
      payment_method: inv.payment_method || 'cash',
      account_id: 1,
      notes: inv.notes || '',
      status: (inv.status || 'completed').toLowerCase(),
      created_by: inv.user_id || 1,
      created_by_name: 'Cashier',
      items: itemsByInvoice[inv.id] || [],
    });
  }
  console.log(`Migrated ${invoices.length} invoices with embedded items.`);

  // 11. Payments
  console.log('\n--- Migrating Payments ---');
  await Payment.deleteMany({});
  const payCols = ['id', 'payment_no', 'payment_type', 'account_id', 'customer_id', 'supplier_id', 'invoice_id', 'purchase_id', 'amount', 'payment_method', 'transaction_reference', 'payment_date', 'notes', 'user_id', 'created_at'];
  const payments = rowToObj(tables.payments || [], payCols);
  for (const p of payments) {
    await Payment.create({
      legacyId: p.id,
      payment_no: p.payment_no,
      payment_type: p.payment_type || 'customer',
      customer_id: p.customer_id,
      supplier_id: p.supplier_id,
      invoice_id: p.invoice_id,
      purchase_id: p.purchase_id,
      account_id: p.account_id || 1,
      account_name: accMap[p.account_id] || '',
      amount: Number(p.amount) || 0,
      payment_method: p.payment_method || 'cash',
      transaction_reference: p.transaction_reference || '',
      payment_date: String(p.payment_date),
      notes: p.notes || '',
      created_by: p.user_id || 1,
    });
  }
  console.log(`Migrated ${payments.length} payments.`);

  // 12. Inventory Transactions
  console.log('\n--- Migrating Inventory Transactions ---');
  await InventoryTransaction.deleteMany({});
  const itCols = ['id', 'product_id', 'transaction_type', 'reference_type', 'reference_id', 'reference_no', 'previous_stock', 'quantity', 'new_stock', 'notes', 'user_id', 'created_at'];
  const invTxs = rowToObj(tables.inventory_transactions || [], itCols);
  for (const it of invTxs) {
    await InventoryTransaction.create({
      legacyId: it.id,
      product_id: it.product_id,
      transaction_type: it.transaction_type,
      quantity: Number(it.quantity) || 0,
      previous_stock: Number(it.previous_stock) || 0,
      new_stock: Number(it.new_stock) || 0,
      reference_type: it.reference_type || '',
      reference_id: it.reference_id,
      reference_no: it.reference_no || '',
      notes: it.notes || '',
      created_by: it.user_id || 1,
      transaction_date: it.created_at ? new Date(it.created_at) : new Date(),
    });
  }
  console.log(`Migrated ${invTxs.length} inventory transactions.`);

  // 13. Settings
  console.log('\n--- Migrating Settings ---');
  await Setting.deleteMany({});
  const setCols = ['id', 'setting_group', 'key_name', 'value', 'description', 'created_at', 'updated_at'];
  const settings = rowToObj(tables.settings || [], setCols);
  for (const s of settings) {
    await Setting.create({
      key: s.key_name,
      value: s.value || '',
      group: s.setting_group || 'general',
      description: s.description || '',
    });
  }
  console.log(`Migrated ${settings.length} system settings.`);

  // 14. Activity Logs
  console.log('\n--- Migrating Activity Logs ---');
  await ActivityLog.deleteMany({});
  const actCols = ['id', 'user_id', 'action', 'module', 'reference_id', 'reference_code', 'description', 'ip_address', 'user_agent', 'created_at'];
  const logs = rowToObj(tables.activity_logs || [], actCols);
  for (const l of logs) {
    await ActivityLog.create({
      legacyId: l.id,
      user_id: l.user_id,
      action: l.action,
      module: l.module,
      reference_id: l.reference_id,
      reference_code: l.reference_code || '',
      description: l.description,
      ip_address: l.ip_address || '',
      user_agent: l.user_agent || '',
      created_at: l.created_at ? new Date(l.created_at) : new Date(),
    });
  }
  console.log(`Migrated ${logs.length} activity logs.`);

  console.log('\n========================================');
  console.log('🎉 ALL DATA MIGRATED SUCCESSFULLY TO MONGODB!');
  console.log('========================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

runMigration().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
