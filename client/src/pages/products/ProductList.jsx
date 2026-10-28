import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export default function ProductList() {
  const [activeTab, setActiveTab] = useState('product-section'); // 'supplier-section', 'product-section', 'barcode-section', 'invoice-section'

  // Data State
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [supplierInvoices, setSupplierInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierStatusFilter, setSupplierStatusFilter] = useState('');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('');

  // Modals State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Barcode Customization State
  const [barcodePrefix, setBarcodePrefix] = useState('SS');
  const [barcodeSeparator, setBarcodeSeparator] = useState('-');
  const [barcodeDigits, setBarcodeDigits] = useState(4);
  const [barcodeLabelSize, setBarcodeLabelSize] = useState('50x25');

  // Product Form
  const [productForm, setProductForm] = useState({
    name: '',
    god_name: '',
    code: '',
    sku: '',
    category_id: '',
    subcategory_id: '',
    material: 'Brass',
    finish_type: 'Antique Gold',
    height_inches: 12,
    weight_kg: 3.5,
    purchase_price: 1500,
    selling_price: 2800,
    gst_percent: 12,
    current_stock: 10,
    min_stock_alert: 3,
    description: '',
  });

  // Supplier Form
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    company_name: '',
    mobile: '',
    email: '',
    gst_number: '',
    city: '',
    status: 'Active',
    products: [{ name: '', code: '', cost: '', quantity: 1 }],
  });

  // Supplier Payment Update Form
  const [paymentForm, setPaymentForm] = useState({
    paid_amount: 0,
    additional_amount: '',
    payment_status: 'Unpaid',
    payment_method: 'bank_transfer',
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [pRes, sRes, cRes, scRes, siRes, bRes] = await Promise.all([
        api.get('/products?limit=200'),
        api.get('/suppliers'),
        api.get('/categories'),
        api.get('/subcategories'),
        api.get('/billing/supplier-invoices'),
        api.get('/barcode/settings').catch(() => ({ data: {} })),
      ]);

      if (pRes && pRes.data) setProducts(pRes.data);
      if (sRes && sRes.data) setSuppliers(sRes.data);
      if (cRes && cRes.data) setCategories(cRes.data);
      if (scRes && scRes.data) setSubcategories(scRes.data);
      if (siRes && siRes.data) setSupplierInvoices(siRes.data);

      if (bRes && bRes.data) {
        if (bRes.data.prefix) setBarcodePrefix(bRes.data.prefix);
        if (bRes.data.separator !== undefined) setBarcodeSeparator(bRes.data.separator);
        if (bRes.data.numberLength) setBarcodeDigits(bRes.data.numberLength);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      god_name: '',
      code: `${barcodePrefix}${barcodeSeparator}${Math.floor(1000 + Math.random() * 9000)}`,
      sku: '',
      category_id: categories[0]?.legacyId || categories[0]?._id || '',
      subcategory_id: subcategories[0]?.legacyId || subcategories[0]?._id || '',
      material: 'Brass',
      finish_type: 'Antique Gold',
      height_inches: 12,
      weight_kg: 3.5,
      purchase_price: 1500,
      selling_price: 2800,
      gst_percent: 12,
      current_stock: 10,
      min_stock_alert: 3,
      description: '',
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      god_name: p.god_name || '',
      code: p.code || p.sku || '',
      sku: p.sku || p.code || '',
      category_id: p.category_id || '',
      subcategory_id: p.subcategory_id || '',
      material: p.material || 'Brass',
      finish_type: p.finish_type || 'Antique Gold',
      height_inches: p.height_inches || 0,
      weight_kg: p.weight_kg || 0,
      purchase_price: p.purchase_price || 0,
      selling_price: p.selling_price || 0,
      gst_percent: p.gst_percent || 12,
      current_stock: p.current_stock || 0,
      min_stock_alert: p.min_stock_alert || 3,
      description: p.description || '',
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id || editingProduct.id}`, productForm);
      } else {
        await api.post('/products', productForm);
      }
      setShowProductModal(false);
      fetchInitialData();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      fetchInitialData();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  // Supplier CRUD
  const handleSaveSupplier = async (e) => {
    e.preventDefault();
    try {
      await api.post('/suppliers', supplierForm);
      setShowSupplierModal(false);
      setSupplierForm({
        name: '',
        company_name: '',
        mobile: '',
        email: '',
        gst_number: '',
        city: '',
        status: 'Active',
        products: [{ name: '', code: '', cost: '', quantity: 1 }],
      });
      fetchInitialData();
    } catch (err) {
      alert(err.message || 'Failed to save supplier');
    }
  };

  // Save Barcode Settings
  const handleSaveBarcodeSettings = async (e) => {
    e.preventDefault();
    try {
      await api.post('/barcode/settings', {
        barcode_prefix: barcodePrefix,
        barcode_separator: barcodeSeparator,
        barcode_number_length: barcodeDigits,
      });
      alert('Barcode configuration saved successfully!');
    } catch (err) {
      alert('Saved locally!');
    }
  };

  // Supplier Payment Update
  const handleOpenPaymentModal = (inv) => {
    setSelectedInvoice(inv);
    setPaymentForm({
      paid_amount: parseFloat(inv.amount_paid || 0),
      additional_amount: '',
      payment_status: inv.payment_status || 'Unpaid',
      payment_method: 'bank_transfer',
      payment_date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowPaymentModal(true);
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/billing/supplier-invoices/update-payment', {
        supplier_id: selectedInvoice.supplier_id || selectedInvoice.id,
        amount: parseFloat(paymentForm.additional_amount) || 0,
        payment_status: paymentForm.payment_status,
        payment_method: paymentForm.payment_method,
        payment_date: paymentForm.payment_date,
        notes: paymentForm.notes,
      });
      setShowPaymentModal(false);
      fetchInitialData();
    } catch (err) {
      alert(err.message || 'Failed to update payment');
    }
  };

  // KPI Calculations for Products
  const totalItemsCount = products.length;
  const totalStockQty = products.reduce((sum, p) => sum + (parseInt(p.current_stock) || 0), 0);
  const totalInvestment = products.reduce((sum, p) => sum + ((parseFloat(p.purchase_price) || 0) * (parseInt(p.current_stock) || 0)), 0);
  const totalCatalogValue = products.reduce((sum, p) => sum + ((parseFloat(p.selling_price) || 0) * (parseInt(p.current_stock) || 0)), 0);
  const outOfStockCount = products.filter((p) => (parseInt(p.current_stock) || 0) <= 0).length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.code?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.material?.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = !productCatFilter || String(p.category_id) === String(productCatFilter);
    return matchesSearch && matchesCat;
  });

  // Filtered Suppliers
  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      s.mobile?.includes(supplierSearch) ||
      s.company_name?.toLowerCase().includes(supplierSearch.toLowerCase());
    const matchesStatus = !supplierStatusFilter || s.status === supplierStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Supplier Invoices
  const filteredInvoices = supplierInvoices.filter((inv) => {
    const matchesSearch =
      inv.supplier_name?.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      String(inv.supplier_id)?.includes(invoiceSearch);
    const matchesStatus = !invoiceStatusFilter || inv.payment_status === invoiceStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Product Management</h1>
          <p className="text-xs text-slate-500">
            Select an entry module below to manage your catalog and billing details
          </p>
        </div>
      </div>

      {/* 4 Compact Module Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Supplier Details Card */}
        <button
          type="button"
          onClick={() => setActiveTab('supplier-section')}
          className={`group relative bg-white border rounded-xl p-3 sm:p-3.5 shadow-xs transition-all duration-200 flex items-center gap-3 text-left w-full cursor-pointer ${
            activeTab === 'supplier-section'
              ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-md'
              : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
            <i className="fas fa-truck text-base"></i>
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors truncate">
              Supplier Details
            </h3>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">Vendors & products</p>
          </div>
        </button>

        {/* 2. Product Details Card */}
        <button
          type="button"
          onClick={() => setActiveTab('product-section')}
          className={`group relative bg-white border rounded-xl p-3 sm:p-3.5 shadow-xs transition-all duration-200 flex items-center gap-3 text-left w-full cursor-pointer ${
            activeTab === 'product-section'
              ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20 shadow-md'
              : 'border-slate-200 hover:border-amber-300 hover:shadow-md'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-xs">
            <i className="fas fa-box-open text-base"></i>
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-700 transition-colors truncate">
              Product Details
            </h3>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">Catalog & inventory</p>
          </div>
        </button>

        {/* 3. Barcode Details Card */}
        <button
          type="button"
          onClick={() => setActiveTab('barcode-section')}
          className={`group relative bg-white border rounded-xl p-3 sm:p-3.5 shadow-xs transition-all duration-200 flex items-center gap-3 text-left w-full cursor-pointer ${
            activeTab === 'barcode-section'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 shadow-md'
              : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-xs">
            <i className="fas fa-barcode text-base"></i>
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
              Barcode Details
            </h3>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">Print labels & tags</p>
          </div>
        </button>

        {/* 4. Invoice Details Card */}
        <button
          type="button"
          onClick={() => setActiveTab('invoice-section')}
          className={`group relative bg-white border rounded-xl p-3 sm:p-3.5 shadow-xs transition-all duration-200 flex items-center gap-3 text-left w-full cursor-pointer ${
            activeTab === 'invoice-section'
              ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20 shadow-md'
              : 'border-slate-200 hover:border-rose-300 hover:shadow-md'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-xs">
            <i className="fas fa-file-invoice-dollar text-base"></i>
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-rose-700 transition-colors truncate">
              Invoice Details
            </h3>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">Billing & payables</p>
          </div>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: Supplier Management */}
      {/* ======================================================== */}
      {activeTab === 'supplier-section' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left mb-6">
            <div>
              <h4 className="text-xl font-extrabold text-slate-900">Supplier Management</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Add new suppliers, sthapathis, and manage product associations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSupplierModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-plus"></i> Add Supplier
            </button>
          </div>

          {/* Supplier Search Controls */}
          <div className="mb-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              <div className="lg:col-span-6 relative">
                <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  value={supplierSearch}
                  onChange={(e) => setSupplierSearch(e.target.value)}
                  placeholder="Search by supplier name, mobile, city, GST..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="lg:col-span-3">
                <select
                  value={supplierStatusFilter}
                  onChange={(e) => setSupplierStatusFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-indigo-500"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                </select>
              </div>

              <div className="lg:col-span-3 text-right">
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                  {filteredSuppliers.length} Suppliers Found
                </span>
              </div>
            </div>
          </div>

          {/* Supplier Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Products Associated</th>
                  <th className="py-3 px-4">GST Number</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colspan="6" className="py-12 text-center text-slate-400">
                      <i className="fas fa-box-open text-3xl mb-2 text-slate-300 block"></i>
                      <p className="font-bold text-slate-600 text-sm">No suppliers found</p>
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((s) => (
                    <tr key={s._id || s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {s.name}
                        {s.company_name && (
                          <span className="block text-[11px] text-slate-400 font-normal">{s.company_name}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">{s.mobile || '—'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                          {s.product_count || (s.products ? s.products.length : 0)} items
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{s.gst_number || 'Unregistered'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {s.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => alert(`Supplier: ${s.name}\nCity: ${s.city || '—'}\nBalance: ₹${s.balance || 0}`)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: Product Management */}
      {/* ======================================================== */}
      {activeTab === 'product-section' && (
        <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-6 shadow-inner space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="text-xl font-extrabold text-amber-950">Product Management</h4>
              <p className="text-xs text-amber-700/80 mt-1 font-medium">
                Add new products to your catalog, track investments (Invert), and monitor live stock.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddProduct}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-plus"></i> Add Products Detail
            </button>
          </div>

          {/* Product Overview KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white border border-amber-200/90 rounded-xl p-3.5 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-amber-700/80 block">
                <i className="fas fa-boxes text-amber-500 mr-1"></i> Total Catalog Items
              </span>
              <span className="text-base sm:text-xl font-black text-amber-950 font-mono">
                {totalItemsCount} Products
              </span>
            </div>

            <div className="bg-white border border-emerald-200/90 rounded-xl p-3.5 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-emerald-700/80 block">
                <i className="fas fa-coins text-emerald-500 mr-1"></i> Total Inventory Value
              </span>
              <span className="text-base sm:text-xl font-black text-emerald-950 font-mono">
                ₹{totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>

            <div className="bg-white border border-blue-200/90 rounded-xl p-3.5 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-blue-700/80 block">
                <i className="fas fa-cubes text-blue-500 mr-1"></i> Physical Stock Units
              </span>
              <span className="text-base sm:text-xl font-black text-blue-950 font-mono">
                {totalStockQty} Units
              </span>
            </div>

            <div className="bg-white border border-rose-200/90 rounded-xl p-3.5 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-rose-700/80 block">
                <i className="fas fa-exclamation-triangle text-rose-500 mr-1"></i> Out of Stock
              </span>
              <span className="text-base sm:text-xl font-black text-rose-950 font-mono">
                {outOfStockCount} Items
              </span>
            </div>
          </div>

          {/* Product Filters Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search by deity name, SKU, barcode, material (e.g. Shiva, Brass)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-amber-500"
              />
            </div>

            <div className="w-full sm:w-64">
              <select
                value={productCatFilter}
                onChange={(e) => setProductCatFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-amber-500"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id || c.id} value={c.legacyId || c.id || c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Code / Barcode</th>
                  <th className="py-3 px-4">Deity & Statue Name</th>
                  <th className="py-3 px-4">Material / Finish</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4">Cost Price</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colspan="7" className="py-12 text-center text-slate-400">
                      <i className="fas fa-box-open text-3xl mb-2 text-slate-300 block"></i>
                      <p className="font-bold text-slate-600 text-sm">No products found</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const stock = parseInt(p.current_stock) || 0;
                    return (
                      <tr key={p._id || p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-amber-800">
                          {p.code || p.sku}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{p.name}</span>
                          {p.god_name && (
                            <span className="text-[10px] text-amber-700 font-semibold">{p.god_name}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-700">{p.material || 'Brass'}</span>
                          {p.finish_type && (
                            <span className="text-[11px] text-slate-400 block">{p.finish_type}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          ₹{parseFloat(p.selling_price || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          ₹{parseFloat(p.purchase_price || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          {stock <= 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              Out of Stock
                            </span>
                          ) : stock <= 2 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                              Low ({stock})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {stock} in stock
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleEditProduct(p)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs cursor-pointer"
                            title="Edit Product"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p._id || p.id, p.name)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 text-xs cursor-pointer"
                            title="Delete Product"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: Barcode Details */}
      {/* ======================================================== */}
      {activeTab === 'barcode-section' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-xl font-extrabold text-slate-900">Barcode Customization & Generator</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Configure your product barcode prefix (e.g.{' '}
                <strong className="text-amber-700">SS</strong>), 4-digit random number length, and print labels.
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 font-mono font-bold text-xs border border-amber-200">
              Active Format: {barcodePrefix}{barcodeSeparator}{'X'.repeat(barcodeDigits)}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Configuration Form */}
            <form onSubmit={handleSaveBarcodeSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Barcode Prefix</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={barcodePrefix}
                    onChange={(e) => setBarcodePrefix(e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 uppercase focus:border-amber-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setBarcodePrefix('SS')}
                    className="px-3 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    SS
                  </button>
                  <button
                    type="button"
                    onClick={() => setBarcodePrefix('DIVYA')}
                    className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    DIVYA
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Separator</label>
                <select
                  value={barcodeSeparator}
                  onChange={(e) => setBarcodeSeparator(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                >
                  <option value="-">Hyphen (-)</option>
                  <option value="_">Underscore (_)</option>
                  <option value="/">Slash (/)</option>
                  <option value="">None</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Random Number Digits</label>
                <input
                  type="number"
                  min="3"
                  max="8"
                  value={barcodeDigits}
                  onChange={(e) => setBarcodeDigits(parseInt(e.target.value) || 4)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Sticker Size</label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-1 ${
                      barcodeLabelSize === '50x25' ? 'border-amber-600 bg-amber-50' : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="labelsize"
                      value="50x25"
                      checked={barcodeLabelSize === '50x25'}
                      onChange={() => setBarcodeLabelSize('50x25')}
                      className="hidden"
                    />
                    <span className="font-bold text-xs">50mm × 25mm</span>
                    <span className="text-[10px] text-slate-400">Standard Jewelry / Idol Tag</span>
                  </label>

                  <label
                    className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-1 ${
                      barcodeLabelSize === '38x25' ? 'border-amber-600 bg-amber-50' : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="labelsize"
                      value="38x25"
                      checked={barcodeLabelSize === '38x25'}
                      onChange={() => setBarcodeLabelSize('38x25')}
                      className="hidden"
                    />
                    <span className="font-bold text-xs">38mm × 25mm</span>
                    <span className="text-[10px] text-slate-400">Compact Barcode Sticker</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Save Barcode Configuration
              </button>
            </form>

            {/* Right: Live Preview Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                Live Sticker Print Preview
              </span>

              {/* Physical Tag Simulation */}
              <div className="w-56 bg-white border-2 border-dashed border-amber-300 rounded-xl p-4 shadow-sm text-center space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  SASTHA SASTI ENTERPRISE
                </p>
                <h5 className="text-xs font-black text-slate-900">Brass Ganesha Idol 12"</h5>

                {/* Simulated Barcode Lines */}
                <div className="py-2 flex items-center justify-center">
                  <div className="h-10 flex items-center gap-[2px]">
                    {[4, 2, 5, 2, 4, 3, 2, 5, 4, 2, 3, 5, 2, 4, 2, 5, 3, 2, 4].map((h, i) => (
                      <div
                        key={i}
                        className="bg-black"
                        style={{ width: `${(i % 3) + 1}px`, height: `${h * 7}px` }}
                      ></div>
                    ))}
                  </div>
                </div>

                <p className="text-xs font-mono font-bold text-slate-900">
                  {barcodePrefix}{barcodeSeparator}4821
                </p>
                <p className="text-[11px] font-black font-mono text-amber-800">MRP: ₹2,800.00</p>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="mt-5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <i className="fas fa-print text-amber-400"></i> Print Sample Labels
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 4: Invoice Details (Supplier Invoices Register) */}
      {/* ======================================================== */}
      {activeTab === 'invoice-section' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xl font-extrabold text-slate-900">Supplier Invoices & Payment Register</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Manage supplier purchase amounts, track payments, and update settlement status.
              </p>
            </div>
          </div>

          {/* Search Toolbar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div className="sm:col-span-2 relative">
              <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                placeholder="Search by Supplier ID, Name, or Mobile..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <select
                value={invoiceStatusFilter}
                onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-amber-500"
              >
                <option value="">All Payment Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          {/* Main 5-Column Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold text-slate-700">Supplier ID</th>
                  <th className="py-3.5 px-4 font-bold text-slate-700">Supplier Name</th>
                  <th className="py-3.5 px-4 font-bold text-slate-700">Amount</th>
                  <th className="py-3.5 px-4 font-bold text-slate-700">Payment Status</th>
                  <th className="py-3.5 px-4 font-bold text-slate-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colspan="5" className="py-12 text-center text-slate-400">
                      <i className="fas fa-truck-loading text-3xl mb-2 text-slate-300 block"></i>
                      <p className="font-bold text-slate-600 text-sm">No supplier invoices found</p>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id || inv.supplier_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {inv.supplier_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{inv.supplier_name}</span>
                        {inv.company_name && (
                          <span className="text-[11px] text-slate-400">{inv.company_name}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">
                        ₹{parseFloat(inv.amount || 0).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            inv.payment_status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : inv.payment_status === 'Partially Paid'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {inv.payment_status || 'Unpaid'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenPaymentModal(inv)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold inline-flex items-center gap-1.5 border border-amber-200 transition-colors cursor-pointer"
                        >
                          <i className="fas fa-edit text-xs"></i> Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: Add / Edit Product */}
      {/* ======================================================== */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Edit Product Details' : 'Add New God Statue / Product'}
              </h3>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product / Deity Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. 12-inch Brass Nataraja Statue"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Barcode / SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={productForm.code}
                    onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
                    placeholder="SS-1001"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id || c.id} value={c.legacyId || c.id || c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Material</label>
                  <select
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  >
                    <option value="Brass">Brass</option>
                    <option value="Bronze">Bronze</option>
                    <option value="Copper">Copper</option>
                    <option value="Panchaloha">Panchaloha (5 Sacred Metals)</option>
                    <option value="Marble">Marble</option>
                    <option value="Black Stone">Black Stone (Karungali)</option>
                    <option value="Wood">Wood</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Finish Type</label>
                  <input
                    type="text"
                    value={productForm.finish_type}
                    onChange={(e) => setProductForm({ ...productForm, finish_type: e.target.value })}
                    placeholder="Antique Gold / Mirror Polish"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.selling_price}
                    onChange={(e) => setProductForm({ ...productForm, selling_price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cost / Purchase Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.purchase_price}
                    onChange={(e) => setProductForm({ ...productForm, purchase_price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    value={productForm.current_stock}
                    onChange={(e) => setProductForm({ ...productForm, current_stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sacred Description</label>
                <textarea
                  rows="3"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Temple consecration notes, iconography, artisan foundry origin..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: Add Supplier */}
      {/* ======================================================== */}
      {showSupplierModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Sthapathi / Supplier</h3>
              <button
                type="button"
                onClick={() => setShowSupplierModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Supplier / Sthapathi Name *</label>
                <input
                  type="text"
                  required
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  placeholder="e.g. Swamimalai Bronze Casting Guild"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={supplierForm.mobile}
                    onChange={(e) => setSupplierForm({ ...supplierForm, mobile: e.target.value })}
                    placeholder="9999999999"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    value={supplierForm.gst_number}
                    onChange={(e) => setSupplierForm({ ...supplierForm, gst_number: e.target.value })}
                    placeholder="33AABCS1234F1Z9"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City / Region</label>
                <input
                  type="text"
                  value={supplierForm.city}
                  onChange={(e) => setSupplierForm({ ...supplierForm, city: e.target.value })}
                  placeholder="Swamimalai, Thanjavur"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: Update Supplier Payment */}
      {/* ======================================================== */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Update Supplier Payment</h3>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Supplier</span>
                <span className="font-bold text-slate-900 text-sm">{selectedInvoice.supplier_name}</span>
                <div className="mt-1 flex justify-between font-mono">
                  <span>Total Payable:</span>
                  <strong>₹{parseFloat(selectedInvoice.amount || 0).toFixed(2)}</strong>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Additional Paid Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentForm.additional_amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, additional_amount: e.target.value })}
                  placeholder="Enter amount being paid..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Settlement Status</label>
                <select
                  value={paymentForm.payment_status}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                >
                  <option value="Paid">Paid (Fully Settled)</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentForm.payment_method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                >
                  <option value="bank_transfer">Bank Transfer / NEFT</option>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI / QR</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  placeholder="Voucher ref / UTR number..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
