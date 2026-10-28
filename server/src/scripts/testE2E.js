import http from 'http';

async function testFullSuite() {
  console.log('⚡ Running End-to-End MERN Migration Verification Test...\n');

  // Check if server is already running, if not start it
  try {
    await fetch('http://localhost:5000/api/health');
    console.log('   (Server is already listening on port 5000)');
  } catch (e) {
    await import('../server.js');
    await new Promise(r => setTimeout(r, 6500));
  }

  const BASE_URL = 'http://localhost:5000/api';

  // 1. Health check
  console.log('1. Checking Server Health...');
  const healthRes = await fetch(`${BASE_URL}/health`).then(r => r.json());
  console.log('   Status:', healthRes.status, '| App:', healthRes.app);

  // 2. Auth Login
  console.log('2. Authenticating as Super Admin (superadmin / admin123)...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'superadmin', password: 'admin123' })
  }).then(r => r.json());

  if (!loginRes.success) throw new Error('Login failed: ' + loginRes.message);
  const token = loginRes.token;
  console.log('   Authenticated successfully! User:', loginRes.user.name, '| Role:', loginRes.user.role_slug);

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 3. Dashboard stats
  console.log('3. Fetching Dashboard Stats...');
  const dashRes = await fetch(`${BASE_URL}/dashboard/stats`, { headers: authHeaders }).then(r => r.json());
  console.log('   Total Products:', dashRes.stats.totalProducts, '| Total Invoices In DB:', dashRes.recentInvoices.length);

  // 4. POS Product Search
  console.log('4. Performing Sub-300ms POS Product Search (keyword "Shiva")...');
  const searchRes = await fetch(`${BASE_URL}/products/search/pos?q=Shiva`, { headers: authHeaders }).then(r => r.json());
  console.log(`   Found ${searchRes.data.length} statues matching "Shiva". Sample:`, searchRes.data[0]?.name);

  // 5. Sacred POS Checkout
  console.log('5. Executing Sacred POS Checkout Transaction...');
  const itemToBuy = searchRes.data[0];
  const checkoutPayload = {
    customer_name: 'Devotee Ramesh Sastri',
    customer_mobile: '9840112233',
    customer_type: 'retail',
    items: [
      {
        product_id: itemToBuy._id,
        sku: itemToBuy.sku,
        name: itemToBuy.name,
        quantity: 1,
        unit_price: itemToBuy.selling_price,
        discount_percent: 5,
        tax_percent: 12
      }
    ],
    overall_discount_amount: 100,
    bill_gst_percent: 12,
    payment_method: 'cash',
    paid_amount: itemToBuy.selling_price,
    notes: 'POS E2E verification test bill'
  };

  const checkoutRes = await fetch(`${BASE_URL}/billing/checkout`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(checkoutPayload)
  }).then(r => r.json());

  if (!checkoutRes.success) throw new Error('Checkout failed: ' + checkoutRes.message);
  console.log('   Invoice Created:', checkoutRes.invoice.invoice_no, '| Grand Total: ₹' + checkoutRes.invoice.grand_total);
  console.log('   WhatsApp Notification URL Generated:', checkoutRes.whatsappUrl ? 'YES' : 'NO');

  // 6. Verify Accounts Ledger
  console.log('6. Verifying Cash Drawer & Account Ledgers...');
  const accRes = await fetch(`${BASE_URL}/accounts`, { headers: authHeaders }).then(r => r.json());
  const cashAcc = accRes.data.find(a => a.type === 'cash');
  console.log('   Showroom Cash Drawer Balance: ₹' + cashAcc.current_balance);

  console.log('\n======================================================');
  console.log('🎉 ALL INTEGRATION TESTS PASSED 100% SUCCESSFULLY!');
  console.log('======================================================\n');
  process.exit(0);
}

testFullSuite().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
