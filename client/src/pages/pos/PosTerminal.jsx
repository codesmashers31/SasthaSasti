import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/client';

export default function PosTerminal() {
  // State: Catalog & Categories
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({ id: 'all', name: 'All Idols & Items Catalog' });
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // State: Cart & Held Bills
  const [cart, setCart] = useState([]);
  const [heldBills, setHeldBills] = useState(() => {
    try {
      const saved = localStorage.getItem('divya_held_bills');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // State: Customer
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerType, setCustomerType] = useState('retail');

  // State: Discounts & Tax
  const [overallDiscount, setOverallDiscount] = useState('');
  const [taxPreset, setTaxPreset] = useState('12');
  const [customTaxRate, setCustomTaxRate] = useState('');

  // State: Modals
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isHeldModalOpen, setIsHeldModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // State: Customer Search & Quick Add
  const [customerList, setCustomerList] = useState([]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [quickCustName, setQuickCustName] = useState('');
  const [quickCustMobile, setQuickCustMobile] = useState('');

  // State: Payment Checkout Form
  const [salesMode, setSalesMode] = useState('offline'); // 'offline' or 'online'
  const [payMethodCash, setPayMethodCash] = useState(true);
  const [payAmountCash, setPayAmountCash] = useState('');
  const [payMethodUpi, setPayMethodUpi] = useState(false);
  const [payAmountUpi, setPayAmountUpi] = useState('');
  const [showUpiQr, setShowUpiQr] = useState(false);
  const [receiptMode, setReceiptMode] = useState('thermal'); // 'thermal', 'whatsapp', 'both'
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [completedInvoice, setCompletedInvoice] = useState(null);
  const [whatsappShareUrl, setWhatsappShareUrl] = useState('');

  // Settings
  const [upiId, setUpiId] = useState('sasthasasti@sbi');
  const [companyName, setCompanyName] = useState('Sastha Sasti');

  const searchInputRef = useRef(null);
  const categoryContainerRef = useRef(null);
  const productGridRef = useRef(null);
  const cartListRef = useRef(null);

  // Reset product catalog scroll position when switching categories or searching
  useEffect(() => {
    if (productGridRef.current) {
      productGridRef.current.scrollTop = 0;
    }
  }, [selectedCategory, searchQuery]);

  // Load initial catalog & categories
  useEffect(() => {
    fetchInitialData();
    fetchSettings();

    // Close category dropdown on outside click
    const handleOutsideClick = (e) => {
      if (categoryContainerRef.current && !categoryContainerRef.current.contains(e.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);

    // Global POS Keyboard Shortcuts [F2], [F4], [F8], [F9]
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        openCustomerModal();
      } else if (e.key === 'F8') {
        e.preventDefault();
        openPaymentModal();
      } else if (e.key === 'F9') {
        e.preventDefault();
        holdCurrentBill();
      } else if (e.key === 'Escape') {
        setIsCustomerModalOpen(false);
        setIsPaymentModalOpen(false);
        setIsHeldModalOpen(false);
        setIsCompleteModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Save held bills to local storage
  useEffect(() => {
    try {
      localStorage.setItem('divya_held_bills', JSON.stringify(heldBills));
    } catch (e) {
      console.error(e);
    }
  }, [heldBills]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/products/search/pos'),
        api.get('/categories'),
      ]);
      if (prodRes && prodRes.data) setProducts(prodRes.data);
      if (catRes && catRes.data) setCategories(catRes.data);
    } catch (err) {
      console.error('Error loading POS catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res && res.data && res.data.settings) {
        const map = {};
        res.data.settings.forEach(s => map[s.key] = s.value);
        if (map.company_upi_id) setUpiId(map.company_upi_id);
        if (map.company_name) setCompanyName(map.company_name);
      }
    } catch {}
  };

  const handleSearch = async (query, catId) => {
    setSearchQuery(query);
    try {
      const resolvedCatId = catId === 'all' || !catId ? '' : catId;
      const res = await api.get(`/products/search/pos?q=${encodeURIComponent(query)}&category_id=${resolvedCatId}`);
      if (res && res.data) setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBarcodeOrSearchSubmit = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const code = searchQuery.trim();
      if (!code) return;
      try {
        const res = await api.post('/products/scan', { code });
        if (res && res.product) {
          addToCart(res.product);
          setSearchQuery('');
          handleSearch('', selectedCategory.id);
        } else {
          // If scan didn't find single match, filter the search query
          handleSearch(code, selectedCategory.id);
        }
      } catch (err) {
        // Fallback filter
        handleSearch(code, selectedCategory.id);
      }
    }
  };

  // Cart Management
  const addToCart = (product) => {
    const prodId = product.legacyId || product._id;
    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === prodId || item.code === product.code || item.sku === product.sku);
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          product_id: prodId,
          code: product.code || product.sku,
          sku: product.sku || product.code,
          name: product.name,
          unit_price: parseFloat(product.selling_price) || 0,
          quantity: 1,
          discount_percent: parseFloat(product.discount_percent) || 0,
          tax_percent: parseFloat(product.gst_percent) || 12,
          current_stock: parseInt(product.current_stock) || 0,
        },
      ];
    });
  };

  const updateCartQty = (idx, delta) => {
    setCart((prev) =>
      prev
        .map((item, i) => {
          if (i === idx) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeCartItem = (idx) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearCart = () => {
    setCart([]);
    setOverallDiscount('');
  };

  // Totals Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const discountVal = parseFloat(overallDiscount) || 0;
  const taxableBase = Math.max(0, subtotal - discountVal);

  let activeTaxRate = 12;
  if (taxPreset === 'custom') {
    activeTaxRate = parseFloat(customTaxRate) || 0;
  } else if (taxPreset === 'item') {
    activeTaxRate = 12; // default avg
  } else {
    activeTaxRate = parseFloat(taxPreset) || 0;
  }

  const taxAmount = Math.round(((taxableBase * activeTaxRate) / 100) * 100) / 100;
  const rawGrandTotal = taxableBase + taxAmount;
  const grandTotal = Math.round(rawGrandTotal);
  const roundOff = Math.round((grandTotal - rawGrandTotal) * 100) / 100;

  // Payments in Modal
  const numCash = payMethodCash ? parseFloat(payAmountCash) || 0 : 0;
  const numUpi = payMethodUpi ? parseFloat(payAmountUpi) || 0 : 0;
  const totalAmountPaid = Math.round((numCash + numUpi) * 100) / 100;
  const balanceToPay = Math.max(0, Math.round((grandTotal - totalAmountPaid) * 100) / 100);

  // Sync default pay amount when opening modal
  const openPaymentModal = () => {
    if (!cart.length) {
      alert('Billing Cart is empty! Please add statues or items first.');
      return;
    }
    // Validation: Customer Details are required for bill
    if (!customerMobile.trim() || customerMobile.trim().length !== 10) {
      alert('Customer 10-digit Mobile Number is required for billing. Please fill the Customer Details box.');
      return;
    }
    if (!customerName.trim()) {
      alert('Customer Name is required for billing. Please fill the Customer Details box.');
      return;
    }

    // Default cash amount to grand total
    setPayMethodCash(true);
    setPayAmountCash(grandTotal.toString());
    setPayMethodUpi(false);
    setPayAmountUpi('');
    setShowUpiQr(false);
    setIsPaymentModalOpen(true);
  };

  // Suspended Held Bills
  const holdCurrentBill = () => {
    if (!cart.length) {
      alert('No items in cart to hold.');
      return;
    }
    const newHold = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      customerName: customerName || 'Walk-in Customer',
      customerMobile: customerMobile || '—',
      cart,
      overallDiscount,
      taxPreset,
      subtotal,
      grandTotal,
    };
    setHeldBills([...heldBills, newHold]);
    clearCart();
    setCustomerMobile('');
    setCustomerName('');
    alert('Bill has been held successfully.');
  };

  const resumeHeldBill = (bill) => {
    setCart(bill.cart);
    setCustomerName(bill.customerName === 'Walk-in Customer' ? '' : bill.customerName);
    setCustomerMobile(bill.customerMobile === '—' ? '' : bill.customerMobile);
    setOverallDiscount(bill.overallDiscount || '');
    setTaxPreset(bill.taxPreset || '12');
    setHeldBills(heldBills.filter((b) => b.id !== bill.id));
    setIsHeldModalOpen(false);
  };

  const deleteHeldBill = (id) => {
    setHeldBills(heldBills.filter((b) => b.id !== id));
  };

  // Customer Search & Quick Add
  const openCustomerModal = async () => {
    setIsCustomerModalOpen(true);
    try {
      const res = await api.get('/customers');
      if (res && res.data) setCustomerList(res.data);
    } catch {}
  };

  const selectCustomer = (c) => {
    setCustomerName(c.name);
    setCustomerMobile(c.mobile || '');
    setCustomerType(c.customer_type || 'retail');
    setIsCustomerModalOpen(false);
  };

  const handleQuickCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!quickCustName || !quickCustMobile) return;
    try {
      const res = await api.post('/customers', {
        name: quickCustName,
        mobile: quickCustMobile,
        customer_type: 'retail',
      });
      if (res && res.data) {
        selectCustomer(res.data);
        setQuickCustName('');
        setQuickCustMobile('');
      }
    } catch (err) {
      // If error or already exists, set directly
      setCustomerName(quickCustName);
      setCustomerMobile(quickCustMobile);
      setIsCustomerModalOpen(false);
    }
  };

  // Checkout Execution
  const processCheckout = async () => {
    try {
      const primaryMethod = payMethodUpi && !payMethodCash ? 'upi' : payMethodCash && payMethodUpi ? 'split' : 'cash';

      const payload = {
        customer_name: customerName,
        customer_mobile: customerMobile,
        customer_type: customerType,
        items: cart,
        overall_discount_amount: discountVal,
        bill_gst_percent: activeTaxRate,
        sales_mode: salesMode,
        payment_method: primaryMethod,
        paid_amount: totalAmountPaid,
        receipt_mode: receiptMode,
        notes: invoiceNotes,
      };

      const res = await api.post('/billing/checkout', payload);
      if (res && res.success && res.invoice) {
        setCompletedInvoice(res.invoice);
        setWhatsappShareUrl(res.whatsappUrl || '');
        setIsPaymentModalOpen(false);
        setIsCompleteModalOpen(true);

        // Clear cart & inputs for new bill
        setCart([]);
        setCustomerMobile('');
        setCustomerName('');
        setOverallDiscount('');
        setInvoiceNotes('');

        // Refresh stock catalog
        fetchInitialData();
      }
    } catch (err) {
      alert(err.message || 'Checkout failed. Please check inputs.');
    }
  };

  // Print Thermal 80mm
  const printThermalReceipt = () => {
    if (!completedInvoice) return;
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) return alert('Please allow popups to print receipt.');

    const dateStr = new Date(completedInvoice.created_at || Date.now()).toLocaleString('en-IN');
    const itemsHtml = (completedInvoice.items || []).map((it) => `
      <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:12px;">
        <span style="font-weight:bold;">${it.name || it.product_name} x ${it.quantity}</span>
        <span>₹${parseFloat(it.total || (it.quantity * it.unit_price)).toFixed(2)}</span>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt ${completedInvoice.invoice_no}</title>
          <style>
            body { font-family: monospace; font-size: 12px; width: 280px; margin: 0 auto; padding: 10px; color: #000; }
            .text-center { text-align: center; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .bold { font-weight: bold; }
            .flex-between { display: flex; justify-content: space-between; }
            @media print { body { width: 100%; margin: 0; padding: 0; } }
          </style>
        </head>
        <body>
          <div class="text-center">
            <h2 style="margin:0; font-size:16px;">SASTHA SASTI ENTERPRISE</h2>
            <p style="margin:2px 0; font-size:11px;">DIVYA MURTI GOD STATUES & POOJA</p>
            <p style="margin:2px 0; font-size:10px;">GSTIN: 33AABCG1234H1Z0</p>
            <p style="margin:2px 0; font-size:10px;">Ph: 9999999999</p>
          </div>
          <div class="divider"></div>
          <div class="flex-between"><span>Inv: <b>${completedInvoice.invoice_no}</b></span><span>${dateStr}</span></div>
          <div>Customer: <b>${completedInvoice.customer_name}</b></div>
          <div>Mobile: ${completedInvoice.customer_mobile || '—'}</div>
          <div class="divider"></div>
          ${itemsHtml}
          <div class="divider"></div>
          <div class="flex-between"><span>Subtotal:</span><span>₹${parseFloat(completedInvoice.subtotal).toFixed(2)}</span></div>
          <div class="flex-between"><span>Discount:</span><span>-₹${parseFloat(completedInvoice.discount_amount || 0).toFixed(2)}</span></div>
          <div class="flex-between"><span>GST Tax:</span><span>₹${parseFloat(completedInvoice.tax_amount || 0).toFixed(2)}</span></div>
          <div class="divider"></div>
          <div class="flex-between bold" style="font-size:15px;"><span>GRAND TOTAL:</span><span>₹${parseFloat(completedInvoice.grand_total).toFixed(2)}</span></div>
          <div class="flex-between"><span>Amount Paid:</span><span>₹${parseFloat(completedInvoice.paid_amount || completedInvoice.grand_total).toFixed(2)}</span></div>
          <div class="divider"></div>
          <div class="text-center" style="font-size:10px; margin-top:10px;">
            <p>Thank You For Choosing Divya Murti!</p>
            <p>Sacred blessings and prosperities.</p>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredCustomerList = customerList.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      (c.mobile && c.mobile.includes(customerSearchQuery))
  );

  return (
    <div className="h-full min-h-0 flex flex-col lg:flex-row gap-3 overflow-hidden select-none">
      {/* ======================================================== */}
      {/* LEFT SIDE: Catalog, Search, Barcode, Categories (65%) */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl p-4 shadow-sm min-w-0 overflow-hidden">
        {/* Top Toolbar: Search & Barcode Scan */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 shrink-0">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-600 text-sm">
              <i className="fas fa-barcode"></i>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              id="pos-search-input"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value, selectedCategory.id)}
              onKeyDown={handleBarcodeOrSearchSubmit}
              placeholder="Scan Barcode or Search Idol (Name, Code, Deity, Material) [F2]..."
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition-all outline-none"
            />
          </div>

          {/* Suspended / Held Bills Trigger */}
          <button
            type="button"
            onClick={() => setIsHeldModalOpen(true)}
            className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
          >
            <i className="fas fa-pause-circle text-amber-600 text-sm"></i>
            <span>Held Bills</span>
            <span
              id="held-bills-badge"
              className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-black flex items-center justify-center"
            >
              {heldBills.length}
            </span>
          </button>
        </div>

        {/* Custom Category Dropdown Navigation */}
        <div className="py-3 flex items-center shrink-0 border-b border-slate-100 relative z-30">
          <div className="relative w-full sm:w-2/3 lg:w-1/2" ref={categoryContainerRef}>
            {/* Dropdown Button */}
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="relative w-full flex items-center bg-white border border-amber-500 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/40 hover:border-amber-600 rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold text-slate-800 cursor-pointer outline-none transition-all"
            >
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-600">
                <i className="fas fa-layer-group text-sm"></i>
              </span>
              <span className="block truncate">{selectedCategory.name}</span>
              <span
                className={`absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-amber-600 transition-transform duration-200 ${
                  isCategoryDropdownOpen ? 'rotate-180' : ''
                }`}
              >
                <i className="fas fa-chevron-down text-xs"></i>
              </span>
            </button>

            {/* Dropdown Menu List */}
            {isCategoryDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-200 origin-top">
                <div className="max-h-60 overflow-y-auto py-1">
                  {/* Option: All */}
                  <div
                    onClick={() => {
                      setSelectedCategory({ id: 'all', name: 'All Idols & Items Catalog' });
                      setIsCategoryDropdownOpen(false);
                      handleSearch(searchQuery, 'all');
                    }}
                    className="flex items-center px-4 py-3 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-700 cursor-pointer transition-colors border-b border-slate-50"
                  >
                    <i className="fas fa-box-open w-6 text-amber-500 text-center"></i>
                    <span>All Idols & Items Catalog</span>
                  </div>

                  {/* Dynamic Categories */}
                  {categories.map((cat) => (
                    <div
                      key={cat._id || cat.id}
                      onClick={() => {
                        const cid = cat.legacyId || cat.id || cat._id;
                        setSelectedCategory({ id: cid, name: cat.name });
                        setIsCategoryDropdownOpen(false);
                        handleSearch(searchQuery, cid);
                      }}
                      className="flex items-center px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-amber-50 hover:text-amber-700 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                    >
                      <i className="fas fa-tag w-6 text-slate-400 text-center hover:text-amber-500 transition-colors"></i>
                      <span>{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="ml-4 hidden sm:block">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              <i className="fas fa-filter text-slate-300 mr-1"></i> Filter Category
            </span>
          </div>
        </div>

        {/* Product Grid (Scrollable) */}
        <div
          ref={productGridRef}
          id="pos-product-grid"
          className="flex-1 overflow-y-auto pt-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pr-1 content-start pb-4"
        >
          {loading ? (
            <div className="col-span-full py-16 text-center text-slate-400">
              <i className="fas fa-spinner fa-spin text-2xl text-amber-600 mb-2"></i>
              <p className="text-xs">Loading holy statue catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400">
              <i className="fas fa-box-open text-3xl mb-2 text-slate-300"></i>
              <p className="font-bold text-slate-600 text-sm">No products found</p>
              <p className="text-xs mt-1">Try another search keyword or switch category.</p>
            </div>
          ) : (
            products.map((p) => {
              const stock = parseInt(p.current_stock) || 0;
              const isOutOfStock = stock <= 0;
              const isYellowWarning = !isOutOfStock && stock <= 2;
              const codeDisplay = p.code || p.sku;

              return (
                <div
                  key={p._id || p.id}
                  onClick={() => addToCart(p)}
                  className={`pos-product-card h-[144px] ${
                    isOutOfStock
                      ? 'pos-card-out-of-stock cursor-pointer shadow-xs'
                      : isYellowWarning
                      ? 'yellow-blink-warning cursor-pointer shadow-xs'
                      : 'bg-white border border-slate-100 hover:border-amber-300 hover:shadow-md cursor-pointer'
                  } shadow-sm rounded-2xl p-3.5 flex flex-col group transition-all select-none`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`pos-code-badge text-[10px] font-bold ${
                          isOutOfStock
                            ? 'text-red-800 bg-red-100 border-red-300'
                            : isYellowWarning
                            ? 'text-amber-900 bg-amber-100 border-amber-300'
                            : 'text-amber-700 bg-[#fff8ef] border-amber-200'
                        } px-2 py-1 rounded-md border whitespace-nowrap truncate`}
                      >
                        {codeDisplay}
                      </span>

                      {isOutOfStock ? (
                        <span className="pos-stock-badge bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-red-700 shadow-xs whitespace-nowrap shrink-0 flex items-center gap-1">
                          <i className="fas fa-ban text-[9px]"></i> Out of Stock
                        </span>
                      ) : isYellowWarning ? (
                        <span className="pos-stock-badge yellow-blink-badge text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-600 shadow-xs whitespace-nowrap shrink-0 flex items-center gap-1">
                          <i className="fas fa-exclamation-triangle text-[9px]"></i> Only {stock} left!
                        </span>
                      ) : (
                        <span className="pos-stock-badge bg-[#f0fdf4] text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#bbf7d0] whitespace-nowrap shrink-0">
                          {stock} in stock
                        </span>
                      )}
                    </div>

                    <h4
                      className={`pos-prod-title text-[13px] font-extrabold ${
                        isOutOfStock
                          ? 'text-red-950'
                          : isYellowWarning
                          ? 'text-amber-950 font-black'
                          : 'text-slate-900 group-hover:text-amber-700'
                      } transition-colors line-clamp-2 h-[36px] leading-snug mt-2`}
                    >
                      {p.name}
                    </h4>
                  </div>

                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <div className="flex items-baseline">
                      <span className="text-[10px] text-slate-400 font-medium">Rate:</span>
                      <span
                        className={`pos-price-val text-[14px] font-black ${
                          isOutOfStock
                            ? 'text-red-900'
                            : isYellowWarning
                            ? 'text-amber-900 font-black'
                            : 'text-slate-900'
                        } font-mono ml-1`}
                      >
                        ₹{parseFloat(p.selling_price || 0).toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className={`pos-add-btn w-7 h-7 rounded-lg ${
                        isOutOfStock
                          ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer shadow-sm'
                          : isYellowWarning
                          ? 'bg-amber-500 text-slate-950 hover:bg-amber-600 font-bold cursor-pointer'
                          : 'bg-[#fef3c7] text-amber-700 group-hover:bg-amber-500 group-hover:text-white cursor-pointer'
                      } flex items-center justify-center transition-all shadow-sm`}
                    >
                      <i className="fas fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT SIDE: Reactive Cart & Fast Checkout (35%) */}
      {/* ======================================================== */}
      <div className="w-full lg:w-[420px] xl:w-[450px] flex flex-col bg-white border border-slate-200 rounded-2xl p-4 shadow-sm shrink-0 overflow-hidden">
        {/* Customer Live Direct Filling Banner (Mandatory for Billing) */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-3 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 border border-amber-200">
                <i className="fas fa-user-check"></i>
              </div>
              <span className="font-extrabold text-slate-800 text-xs tracking-tight flex items-center gap-1">
                <span>Customer Details</span>
                <span className="text-rose-600 text-[10px] font-black uppercase tracking-wider">
                  (Required for Bill)
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={openCustomerModal}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <i className="fas fa-search text-[10px] text-amber-600"></i> Search [F4]
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile No <span className="text-rose-600 font-black">*</span>
              </label>
              <input
                type="tel"
                id="pos-customer-mobile"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit Mobile Number *"
                maxLength={10}
                className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Customer Name <span className="text-rose-600 font-black">*</span>
              </label>
              <input
                type="text"
                id="pos-customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Full Name *"
                className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Cart Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
          <span>
            Billing Cart (<span id="cart-items-count" className="text-amber-700">{cart.length}</span>)
          </span>
          <button
            type="button"
            onClick={clearCart}
            className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold lowercase cursor-pointer"
          >
            <i className="fas fa-trash-alt mr-1"></i> clear cart
          </button>
        </div>

        {/* Cart Items Scrollable List */}
        <div
          ref={cartListRef}
          id="pos-cart-items"
          className="flex-1 overflow-y-auto py-2 pr-1 space-y-2"
        >
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
              <i className="fas fa-shopping-bag text-3xl mb-2 text-slate-300"></i>
              <p className="text-xs font-semibold">Your cart is empty</p>
              <p className="text-[10px] text-slate-400">Click statues on left or scan barcode [F2]</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl flex items-center justify-between gap-2 shadow-2xs hover:bg-white transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded">
                      {item.code}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 truncate">{item.name}</h5>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    ₹{item.unit_price.toFixed(2)} × {item.quantity} ={' '}
                    <strong className="text-slate-900">₹{(item.unit_price * item.quantity).toFixed(2)}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => updateCartQty(idx, -1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded text-xs cursor-pointer"
                    >
                      <i className="fas fa-minus text-[10px]"></i>
                    </button>
                    <span className="w-7 text-center font-mono font-bold text-xs text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQty(idx, 1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded text-xs cursor-pointer"
                    >
                      <i className="fas fa-plus text-[10px]"></i>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCartItem(idx)}
                    className="w-7 h-7 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <i className="fas fa-trash-alt text-xs"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Checkout Bottom Panel */}
        <div className="pt-3 border-t border-slate-200 bg-white shrink-0 space-y-2 text-xs">
          {/* Overall Discount Input */}
          <div className="flex items-center justify-between text-slate-600 font-medium">
            <span>Overall Discount (₹):</span>
            <input
              type="text"
              inputMode="decimal"
              id="pos-overall-discount"
              value={overallDiscount}
              onChange={(e) => setOverallDiscount(e.target.value.replace(/[^\d.]/g, ''))}
              placeholder="0.00"
              className="w-24 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono text-right focus:border-amber-500 outline-none"
            />
          </div>

          {/* Dynamic Bill GST Tax Input */}
          <div className="flex items-center justify-between text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <span>GST Tax Rate:</span>
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                Dynamic
              </span>
            </span>
            <div className="flex items-center gap-1.5">
              <select
                id="pos-tax-preset"
                value={taxPreset}
                onChange={(e) => setTaxPreset(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 font-semibold outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="item">As per Item</option>
                <option value="0">0% (Nil)</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="20">20%</option>
                <option value="28">28%</option>
                <option value="custom">Custom %</option>
              </select>

              {taxPreset === 'custom' && (
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  placeholder="%"
                  value={customTaxRate}
                  onChange={(e) => setCustomTaxRate(e.target.value)}
                  className="w-14 bg-slate-50 border border-amber-400 rounded-lg px-1.5 py-1 text-xs text-slate-900 font-mono font-bold text-right outline-none"
                />
              )}
            </div>
          </div>

          {/* Calculation Lines */}
          <div className="space-y-1 text-slate-600 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Subtotal:</span>
              <span id="summary-subtotal" className="font-bold text-slate-800">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-rose-600 font-semibold">
              <span className="text-slate-500 font-sans">Discount:</span>
              <span id="summary-discount">-₹{discountVal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-blue-600 font-semibold">
              <span className="text-slate-500 font-sans">GST Tax ({activeTaxRate}%):</span>
              <span id="summary-tax">₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span className="font-sans">Round-off:</span>
              <span id="summary-roundoff">₹{roundOff.toFixed(2)}</span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                Total Amount
              </span>
              <span className="text-[10px] text-amber-800 font-semibold">Includes Taxes</span>
            </div>
            <span id="summary-grandtotal" className="text-2xl font-black font-mono text-slate-900">
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>

          {/* Action Buttons: Hold / Complete Bill */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={holdCurrentBill}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
            >
              <i className="fas fa-pause text-amber-600"></i> Hold [F9]
            </button>
            <button
              type="button"
              id="btn-pos-pay"
              onClick={openPaymentModal}
              className="col-span-2 gold-btn font-extrabold py-2.5 rounded-xl text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fas fa-check-circle"></i> Complete Bill [F8]
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: Customer Selection & Quick Add [F4] */}
      {/* ======================================================== */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs border border-amber-200">
                  <i className="fas fa-user-friends"></i>
                </div>
                <h3 className="text-base font-bold text-slate-900">Select or Add Customer</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomerModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              {/* Search Customer */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <i className="fas fa-search text-xs"></i>
                </span>
                <input
                  type="text"
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  placeholder="Type customer name or mobile..."
                  className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-900 outline-none transition-all"
                />
              </div>

              {/* Customer Results */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">
                  <span>Available Customers</span>
                  <span className="text-slate-400 font-normal">{filteredCustomerList.length} found</span>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-0.5">
                  {filteredCustomerList.slice(0, 8).map((c) => (
                    <div
                      key={c._id || c.id}
                      onClick={() => selectCustomer(c)}
                      className="p-2 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div>
                        <h6 className="text-xs font-bold text-slate-800">{c.name}</h6>
                        <span className="text-[11px] text-slate-500 font-mono">{c.mobile || 'No Mobile'}</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold capitalize">
                        {c.customer_type || 'Retail'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Register Customer Form */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <i className="fas fa-user-plus text-amber-600"></i> Quick Register Customer
                  </h5>
                  <span className="text-[10px] text-slate-400">Instant Link to Bill</span>
                </div>
                <form onSubmit={handleQuickCustomerSubmit} className="space-y-2 text-xs">
                  <input
                    type="text"
                    required
                    value={quickCustName}
                    onChange={(e) => setQuickCustName(e.target.value)}
                    placeholder="Customer Full Name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-amber-500 outline-none transition-all"
                  />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={quickCustMobile}
                    onChange={(e) => setQuickCustMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Mobile Number (10 digits)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:bg-white focus:border-amber-500 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <i className="fas fa-check-circle"></i> Save & Select Customer
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: Multi-Payment Checkout [F8] */}
      {/* ======================================================== */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Complete Sales Payment</h3>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Selected Customer Banner */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-6 h-6 rounded-lg bg-amber-200/70 text-amber-800 flex items-center justify-center text-[10px] shrink-0 font-bold">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block leading-tight">
                      Customer
                    </span>
                    <span className="font-bold text-slate-900 truncate block">
                      {customerName || 'Walk-in Retail Customer'}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-slate-700 text-xs font-semibold bg-white px-2 py-0.5 rounded border border-amber-200/60 shrink-0">
                  {customerMobile || '—'}
                </span>
              </div>

              {/* Grand Total Display */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">
                  Invoice Net Payable
                </span>
                <h2 className="text-3xl font-black font-mono text-slate-900 mt-1">
                  ₹{grandTotal.toFixed(2)}
                </h2>
              </div>

              {/* Sales Channel: Offline vs Online */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <i className="fas fa-store-alt text-amber-600"></i> Sales Channel / Mode
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Default: Offline
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`cursor-pointer border-2 rounded-xl p-2.5 flex items-center gap-2.5 transition-all ${
                      salesMode === 'offline'
                        ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-amber-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sales_mode"
                      value="offline"
                      checked={salesMode === 'offline'}
                      onChange={() => setSalesMode('offline')}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <i className="fas fa-store text-amber-600"></i> Offline Sale
                      </span>
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        Store / Showroom Counter
                      </span>
                    </div>
                  </label>

                  <label
                    className={`cursor-pointer border-2 rounded-xl p-2.5 flex items-center gap-2.5 transition-all ${
                      salesMode === 'online'
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-blue-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sales_mode"
                      value="online"
                      checked={salesMode === 'online'}
                      onChange={() => setSalesMode('online')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <i className="fas fa-globe text-blue-600"></i> Online Sale
                      </span>
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        Remote / WhatsApp / Web
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Methods: Cash and UPI */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Cash */}
                  <div className="p-3 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl flex flex-col gap-2 text-slate-700 shadow-sm transition-all">
                    <label className="cursor-pointer flex items-center gap-2 select-none w-full">
                      <input
                        type="checkbox"
                        checked={payMethodCash}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setPayMethodCash(checked);
                          if (!checked) setPayAmountCash('');
                          else if (!payMethodUpi) setPayAmountCash(grandTotal.toString());
                        }}
                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <i className="fas fa-money-bill-wave text-emerald-600"></i> Cash Payment
                      </span>
                    </label>
                    {payMethodCash && (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={payAmountCash}
                        onChange={(e) => setPayAmountCash(e.target.value)}
                        placeholder="Amount (₹)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500 font-mono font-bold text-slate-800"
                      />
                    )}
                  </div>

                  {/* UPI */}
                  <div className="p-3 bg-white border border-slate-200 hover:border-indigo-500 rounded-xl flex flex-col gap-2 text-slate-700 shadow-sm transition-all">
                    <label className="cursor-pointer flex items-center gap-2 select-none w-full">
                      <input
                        type="checkbox"
                        checked={payMethodUpi}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setPayMethodUpi(checked);
                          if (checked) {
                            setShowUpiQr(true);
                            if (!payMethodCash) setPayAmountUpi(grandTotal.toString());
                            else {
                              const remain = Math.max(0, grandTotal - (parseFloat(payAmountCash) || 0));
                              setPayAmountUpi(remain.toString());
                            }
                          } else {
                            setPayAmountUpi('');
                            setShowUpiQr(false);
                          }
                        }}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <i className="fas fa-qrcode text-indigo-600"></i> UPI (Scan QR)
                      </span>
                    </label>
                    {payMethodUpi && (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={payAmountUpi}
                        onChange={(e) => setPayAmountUpi(e.target.value)}
                        placeholder="Amount (₹)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 font-mono font-bold text-slate-800"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic UPI QR Container */}
              {payMethodUpi && showUpiQr && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center flex flex-col items-center justify-center">
                  <p className="text-xs font-bold text-slate-700 mb-2">
                    Scan QR to Pay: <span className="text-amber-700 font-extrabold text-sm">₹{parseFloat(payAmountUpi || grandTotal).toFixed(2)}</span>
                  </p>
                  <div className="bg-white p-2 rounded-lg shadow-sm mb-2 inline-block">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        `upi://pay?pa=${upiId}&pn=${encodeURIComponent(companyName)}&am=${parseFloat(payAmountUpi || grandTotal).toFixed(2)}&cu=INR`
                      )}`}
                      alt="UPI QR Code"
                      className="w-36 h-36 object-contain mx-auto"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    <i className="fab fa-google-pay text-xs mr-1 text-slate-600"></i>
                    <i className="fas fa-rupee-sign text-xs mr-1 text-slate-600"></i>
                    All UPI Apps Accepted
                  </p>
                </div>
              )}

              {/* Total Amount Paid & Balance to Pay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Amount Paid (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    readOnly
                    value={totalAmountPaid.toFixed(2)}
                    className="w-full bg-emerald-50/40 border border-emerald-400 text-emerald-900 font-bold rounded-xl px-3 py-2 text-sm outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Balance to Pay (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    readOnly
                    value={balanceToPay.toFixed(2)}
                    className="w-full bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl px-3 py-2 text-sm outline-none cursor-not-allowed font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Formula: Balance = Total Amount - Total Paid</p>
                </div>
              </div>

              {/* Receipt Delivery Mode */}
              <div className="pt-1">
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <i className="fas fa-paper-plane text-amber-600 text-xs"></i>
                    <span>Bill Delivery Method (Customer Preference)</span>
                  </span>
                  <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                    Select delivery
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label
                    className={`cursor-pointer border-2 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1.5 bg-white select-none transition-all ${
                      receiptMode === 'thermal' ? 'border-amber-600 bg-amber-50 shadow-xs' : 'border-slate-200 hover:border-amber-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="receipt_mode"
                      value="thermal"
                      checked={receiptMode === 'thermal'}
                      onChange={() => setReceiptMode('thermal')}
                      className="hidden"
                    />
                    <i className="fas fa-receipt text-lg text-amber-600"></i>
                    <span className="text-xs font-bold text-slate-800">Thermal Print</span>
                  </label>

                  <label
                    className={`cursor-pointer border-2 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1.5 bg-white select-none transition-all ${
                      receiptMode === 'whatsapp' ? 'border-emerald-600 bg-emerald-50 shadow-xs' : 'border-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="receipt_mode"
                      value="whatsapp"
                      checked={receiptMode === 'whatsapp'}
                      onChange={() => setReceiptMode('whatsapp')}
                      className="hidden"
                    />
                    <i className="fab fa-whatsapp text-xl text-emerald-600"></i>
                    <span className="text-xs font-bold text-slate-800">WhatsApp Bill</span>
                  </label>

                  <label
                    className={`cursor-pointer border-2 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1.5 bg-white select-none transition-all ${
                      receiptMode === 'both' ? 'border-indigo-600 bg-indigo-50 shadow-xs' : 'border-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="receipt_mode"
                      value="both"
                      checked={receiptMode === 'both'}
                      onChange={() => setReceiptMode('both')}
                      className="hidden"
                    />
                    <i className="fas fa-print text-lg text-indigo-600"></i>
                    <span className="text-xs font-bold text-slate-800">Print + WA</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Invoice Notes</label>
                <input
                  type="text"
                  value={invoiceNotes}
                  onChange={(e) => setInvoiceNotes(e.target.value)}
                  placeholder="e.g. Consecrated with holy ash, velvet packaging included..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={processCheckout}
                  className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <i className="fas fa-check-circle"></i> Complete Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: Suspended / Held Bills */}
      {/* ======================================================== */}
      {isHeldModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Suspended / Held Bills</h3>
              <button
                type="button"
                onClick={() => setIsHeldModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {heldBills.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <i className="fas fa-pause text-2xl text-slate-300 mb-1"></i>
                  <p>No suspended bills at present.</p>
                </div>
              ) : (
                heldBills.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{b.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{b.timestamp}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {b.cart.length} items • Total: <strong className="text-slate-900">₹{b.grandTotal.toFixed(2)}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => resumeHeldBill(b)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Resume
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteHeldBill(b.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: Transaction Completed & Print Prompt */}
      {/* ======================================================== */}
      {isCompleteModalOpen && completedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-md shadow-2xl relative text-center">
            {/* Close Button Top-Right */}
            <button
              type="button"
              onClick={() => setIsCompleteModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Close [Esc]"
            >
              <i className="fas fa-times text-sm"></i>
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-200">
              <i className="fas fa-check"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Invoice Generated!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Invoice Number:{' '}
              <span className="text-amber-800 font-mono font-bold text-sm">
                {completedInvoice.invoice_no}
              </span>
            </p>

            <div className="mt-2 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl inline-flex items-center gap-2 text-xs font-mono text-slate-700">
              <span>
                Customer:{' '}
                <strong className="text-slate-900 font-bold">
                  {completedInvoice.customer_name || 'Walk-in'}
                </strong>
              </span>
              <span className="text-slate-300">•</span>
              <span>
                Mobile:{' '}
                <strong className="text-amber-700 font-bold">
                  {completedInvoice.customer_mobile || '—'}
                </strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              {/* Thermal 80mm Print */}
              <button
                type="button"
                onClick={printThermalReceipt}
                className="py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all border border-slate-200 shadow-sm cursor-pointer hover:border-amber-400"
              >
                <i className="fas fa-receipt text-xl text-amber-600"></i>
                <span>Thermal Print (80mm)</span>
              </button>

              {/* WhatsApp Share Bill */}
              <a
                href={whatsappShareUrl || `https://wa.me/91${completedInvoice.customer_mobile}?text=${encodeURIComponent(`Dear ${completedInvoice.customer_name}, your Divya Murti invoice ${completedInvoice.invoice_no} for amount ₹${completedInvoice.grand_total} is generated.`)}`}
                target="_blank"
                rel="noreferrer"
                className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <i className="fab fa-whatsapp text-2xl text-white"></i>
                <span>Share on WhatsApp</span>
              </a>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCompleteModalOpen(false);
                  searchInputRef.current?.focus();
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                New Bill [F2]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
