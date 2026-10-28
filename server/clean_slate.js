import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './src/config/db.js';
import User from './src/models/User.js';
import Account from './src/models/Account.js';

async function wipeDatabase() {
  await connectDB();
  const db = mongoose.connection.db;

  console.log('==========================================');
  console.log('🚀 Executing Clean Slate Database Wipe...');
  console.log('==========================================');

  const collectionsToWipe = [
    'products',
    'categories',
    'subcategories',
    'invoices',
    'payments',
    'customers',
    'suppliers',
    'inventorytransactions',
    'accounttransactions',
    'activitylogs',
    'salesreturns',
    'expenses',
    'purchases',
  ];

  for (const col of collectionsToWipe) {
    try {
      const res = await db.collection(col).deleteMany({});
      console.log(`✔ Cleared ${col}: ${res.deletedCount} records deleted`);
    } catch (e) {
      console.log(`Notice for ${col}: ${e.message}`);
    }
  }

  // Reset Account Balances to 0
  const accountRes = await Account.updateMany({}, { $set: { current_balance: 0, opening_balance: 0 } });
  console.log(`✔ Reset financial ledger accounts balance to ₹0 (${accountRes.modifiedCount} accounts reset)`);

  // Default hashed password (admin123)
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 1. Ensure Super Admin / Admin accounts exist
  let adminUser = await User.findOne({ username: 'admin' });
  if (!adminUser) {
    adminUser = await User.create({
      legacyId: 100,
      name: 'System Administrator',
      username: 'admin',
      email: 'admin@sasthasasti.com',
      password: hashedPassword,
      role_slug: 'super-admin',
      role_name: 'Super Admin',
      department_name: 'Executive & Administration',
      status: 'active',
      customPermissions: [{ permission: '*', is_granted: true }],
    });
    console.log('✔ Created Admin user: username = "admin" | password = "admin123"');
  } else {
    adminUser.password = hashedPassword;
    adminUser.status = 'active';
    await adminUser.save();
    console.log('✔ Updated Admin user: username = "admin" | password = "admin123"');
  }

  let superadminUser = await User.findOne({ username: 'superadmin' });
  if (superadminUser) {
    superadminUser.password = hashedPassword;
    superadminUser.status = 'active';
    await superadminUser.save();
    console.log('✔ Updated SuperAdmin user: username = "superadmin" | password = "admin123"');
  }

  // 2. Ensure Billing / Cashier user exists
  let billingUser = await User.findOne({ username: 'billing' });
  if (!billingUser) {
    billingUser = await User.create({
      legacyId: 101,
      name: 'Billing Counter Staff',
      username: 'billing',
      email: 'billing@sasthasasti.com',
      password: hashedPassword,
      role_slug: 'cashier',
      role_name: 'Cashier',
      department_name: 'POS & Store Operations',
      status: 'active',
      customPermissions: [
        { permission: 'pos.*', is_granted: true },
        { permission: 'invoices.*', is_granted: true },
        { permission: 'customers.*', is_granted: true },
        { permission: 'products.view', is_granted: true },
      ],
    });
    console.log('✔ Created Billing user: username = "billing" | password = "admin123"');
  } else {
    billingUser.password = hashedPassword;
    billingUser.status = 'active';
    await billingUser.save();
    console.log('✔ Updated Billing user: username = "billing" | password = "admin123"');
  }

  // Remove other demo users
  const deleteDemoUsers = await User.deleteMany({
    username: { $nin: ['admin', 'superadmin', 'billing'] },
  });
  console.log(`✔ Removed ${deleteDemoUsers.deletedCount} demo staff accounts`);

  console.log('==========================================');
  console.log('✅ DATABASE CLEANED SUCCESSFULLY');
  console.log('Remaining Users:');
  console.log('1. admin (Super Admin) - Password: admin123');
  console.log('2. superadmin (Super Admin) - Password: admin123');
  console.log('3. billing (Cashier / POS Billing) - Password: admin123');
  console.log('==========================================');

  process.exit(0);
}

wipeDatabase().catch((err) => {
  console.error('❌ Wipe failed:', err);
  process.exit(1);
});
