import React, { useState, useEffect, useMemo } from 'react';
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
  const [productSupplierFilter, setProductSupplierFilter] = useState('');
  const [productStockFilter, setProductStockFilter] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierStatusFilter, setSupplierStatusFilter] = useState('');
  const [supplierProductsFilter, setSupplierProductsFilter] = useState('');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('');

  // Modals State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showSupplierSheetModal, setShowSupplierSheetModal] = useState(false);
  const [selectedSupplierForSheet, setSelectedSupplierForSheet] = useState(null);

  // Supplier Combobox State in Product Modal
  const [supplierComboboxOpen, setSupplierComboboxOpen] = useState(false);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');

  // Barcode Configuration State
  const [barcodePrefix, setBarcodePrefix] = useState('SS');
  const [barcodeSeparator, setBarcodeSeparator] = useState('-');
  const [barcodeDigits, setBarcodeDigits] = useState(4);
  const [barcodeLabelSize, setBarcodeLabelSize] = useState('50x25');

  // Multi-Product Entry Form State (Exact match to C:\xampp\htdocs\billing\billingsoftwaregod)
  const initialProductRow = () => ({
    id: '',
    name: '',
    category: '',
    subcategory: '',
    units: 5,
    piece_rate: 1500,
    purchase_price: 7500,
    margin_percentage: 60.0,
    selling_price: 2400,
    gst: 12,
    barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
  });

  const [productDetailForm, setProductDetailForm] = useState({
    supplier_id: '',
    supply_date: new Date().toISOString().split('T')[0],
    products: [initialProductRow()],
    total_amount_purchased: 7500,
    payment_methods: {
      Cash: false,
      Card: false,
      UPI: false,
      'Bank Transfer': false,
      Credit: false,
    },
    payment_amounts: {
      Cash: '',
      Card: '',
      UPI: '',
      'Bank Transfer': '',
      Credit: '',
    },
    total_amount_paid: 0,
    balance_amount: 7500,
    gst_percent: 12,
    tax_inclusive: 'Yes',
    offer_available: 'No',
    offer_type: '%',
    offer_amount: '',
    offer_start: '',
    offer_end: '',
    status: 'active',
  });

  // Supplier Full & Quick Modals State
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showQuickSupplierModal, setShowQuickSupplierModal] = useState(false);
  const [showViewSupplierModal, setShowViewSupplierModal] = useState(false);
  const [selectedSupplierForView, setSelectedSupplierForView] = useState(null);

  const initialSupplierProductRow = () => ({
    name: '',
    category: '',
    subcategory: '',
    units: 1,
    piece_rate: 0,
    purchase_price: 0,
    margin_percentage: 60.0,
    selling_price: 0,
    gst: 12,
    barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
  });

  const [fullSupplierForm, setFullSupplierForm] = useState({
    id: null,
    supplier_name: '',
    mobile_number: '',
    email: '',
    purchase_date: new Date().toISOString().split('T')[0],
    address: '',
    city: 'Swamimalai',
    state: 'Tamil Nadu',
    gst_number: '',
    status: 'Active',
    products: [],
    total_amount_purchased: 0,
    payment_methods: {
      Cash: false,
      Card: false,
      UPI: false,
      'Bank Transfer': false,
      Credit: false,
    },
    payment_amounts: {
      Cash: '',
      Card: '',
      UPI: '',
      'Bank Transfer': '',
      Credit: '',
    },
    total_amount_paid: 0,
    balance_amount: 0,
    payment_status: 'Unpaid',
  });

  const [quickSupplierForm, setQuickSupplierForm] = useState({
    name: '',
    mobile: '',
    city: 'Swamimalai',
    gst_number: '',
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
        api.get('/products?limit=500'),
        api.get('/suppliers?limit=500'),
        api.get('/categories'),
        api.get('/subcategories'),
        api.get('/billing/supplier-invoices').catch(() => ({ data: [] })),
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
      console.error('Error fetching catalog data:', err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Product Detail Modal Handlers
  // -------------------------------------------------------------------------
  const openProductModal = (forSupplierId = null) => {
    setEditingProductId(null);
    const initialRow = initialProductRow();
    const initTotal = initialRow.purchase_price;

    setProductDetailForm({
      supplier_id: forSupplierId || (suppliers[0]?._id || suppliers[0]?.legacyId || ''),
      supply_date: new Date().toISOString().split('T')[0],
      products: [initialRow],
      total_amount_purchased: initTotal,
      payment_methods: {
        Cash: false,
        Card: false,
        UPI: false,
        'Bank Transfer': false,
        Credit: false,
      },
      payment_amounts: {
        Cash: '',
        Card: '',
        UPI: '',
        'Bank Transfer': '',
        Credit: '',
      },
      total_amount_paid: 0,
      balance_amount: initTotal,
      gst_percent: 12,
      tax_inclusive: 'Yes',
      offer_available: 'No',
      offer_type: '%',
      offer_amount: '',
      offer_start: '',
      offer_end: '',
      status: 'active',
    });
    setSupplierSearchTerm('');
    setSupplierComboboxOpen(false);
    setShowProductModal(true);
  };

  const handleEditSingleProduct = (prod) => {
    setEditingProductId(prod._id || prod.id);
    const pieceRate = prod.piece_rate || (prod.current_stock > 0 ? prod.purchase_price / prod.current_stock : prod.purchase_price) || 0;
    const units = prod.current_stock || 1;
    const margin = prod.margin_percentage || 60;
    const purchaseTotal = prod.purchase_price > 0 ? prod.purchase_price : units * pieceRate;

    const row = {
      id: prod._id || prod.id,
      name: prod.name || '',
      category: prod.category_name || '',
      subcategory: prod.subcategory_name || '',
      units: units,
      piece_rate: pieceRate,
      purchase_price: purchaseTotal,
      margin_percentage: margin,
      selling_price: prod.selling_price || 0,
      gst: prod.gst_percent || 12,
      barcode: prod.barcode || prod.sku,
    };

    setProductDetailForm({
      supplier_id: prod.supplier_id || '',
      supply_date: new Date().toISOString().split('T')[0],
      products: [row],
      total_amount_purchased: purchaseTotal,
      payment_methods: {
        Cash: false,
        Card: false,
        UPI: false,
        'Bank Transfer': false,
        Credit: false,
      },
      payment_amounts: {
        Cash: '',
        Card: '',
        UPI: '',
        'Bank Transfer': '',
        Credit: '',
      },
      total_amount_paid: 0,
      balance_amount: purchaseTotal,
      gst_percent: prod.gst_percent || 12,
      tax_inclusive: 'Yes',
      offer_available: 'No',
      offer_type: '%',
      offer_amount: '',
      offer_start: '',
      offer_end: '',
      status: prod.status || 'active',
    });
    setShowProductModal(true);
  };

  const addProductRow = () => {
    const newRow = initialProductRow();
    const updatedProducts = [...productDetailForm.products, newRow];
    recalculateBatchTotals(updatedProducts, productDetailForm.payment_amounts);
  };

  const removeProductRow = (index) => {
    if (productDetailForm.products.length <= 1) {
      alert('At least one product is required.');
      return;
    }
    const updatedProducts = productDetailForm.products.filter((_, i) => i !== index);
    recalculateBatchTotals(updatedProducts, productDetailForm.payment_amounts);
  };

  const handleProductRowChange = (index, field, value) => {
    const updated = [...productDetailForm.products];
    const row = { ...updated[index], [field]: value };

    if (field === 'units' || field === 'piece_rate') {
      const u = Math.max(0, parseFloat(field === 'units' ? value : row.units) || 0);
      const pr = Math.max(0, parseFloat(field === 'piece_rate' ? value : row.piece_rate) || 0);
      row.purchase_price = Math.round(u * pr * 100) / 100;

      const margin = parseFloat(row.margin_percentage) || 60;
      if (pr > 0) {
        row.selling_price = Math.round((pr + pr * (margin / 100)) * 100) / 100;
      }
    } else if (field === 'margin_percentage') {
      const margin = parseFloat(value) || 0;
      const pr = parseFloat(row.piece_rate) || 0;
      if (pr > 0) {
        row.selling_price = Math.round((pr + pr * (margin / 100)) * 100) / 100;
      }
    } else if (field === 'selling_price') {
      const sp = parseFloat(value) || 0;
      const pr = parseFloat(row.piece_rate) || 0;
      if (pr > 0) {
        row.margin_percentage = Math.round(((sp - pr) / pr) * 10000) / 100;
      }
    }

    updated[index] = row;
    recalculateBatchTotals(updated, productDetailForm.payment_amounts);
  };

  const recalculateBatchTotals = (updatedProducts, updatedPaymentAmounts) => {
    const totalPurchased = updatedProducts.reduce(
      (sum, p) => sum + (parseFloat(p.purchase_price) || 0),
      0
    );

    const totalPaid = Object.values(updatedPaymentAmounts).reduce(
      (sum, val) => sum + (parseFloat(val) || 0),
      0
    );

    const balance = Math.max(0, totalPurchased - totalPaid);

    setProductDetailForm((prev) => ({
      ...prev,
      products: updatedProducts,
      total_amount_purchased: Math.round(totalPurchased * 100) / 100,
      total_amount_paid: Math.round(totalPaid * 100) / 100,
      balance_amount: Math.round(balance * 100) / 100,
    }));
  };

  const handlePaymentCheckboxChange = (method) => {
    const isCurrentlyChecked = productDetailForm.payment_methods[method];
    const newMethods = { ...productDetailForm.payment_methods, [method]: !isCurrentlyChecked };
    const newAmounts = { ...productDetailForm.payment_amounts };

    if (isCurrentlyChecked) {
      newAmounts[method] = '';
    }

    setProductDetailForm((prev) => ({
      ...prev,
      payment_methods: newMethods,
      payment_amounts: newAmounts,
    }));
    recalculateBatchTotals(productDetailForm.products, newAmounts);
  };

  const handlePaymentAmountChange = (method, value) => {
    const newAmounts = { ...productDetailForm.payment_amounts, [method]: value };
    recalculateBatchTotals(productDetailForm.products, newAmounts);
  };

  const handleSaveProductDetail = async (e) => {
    e.preventDefault();
    if (!productDetailForm.supplier_id) {
      alert('Please select or add a supplier.');
      return;
    }

    try {
      setLoading(true);
      const chosenMethods = Object.keys(productDetailForm.payment_methods).filter(
        (k) => productDetailForm.payment_methods[k]
      );

      const payload = {
        supplier_id: productDetailForm.supplier_id,
        supply_date: productDetailForm.supply_date,
        products: productDetailForm.products,
        total_amount_purchased: productDetailForm.total_amount_purchased,
        total_amount_paid: productDetailForm.total_amount_paid,
        balance_amount: productDetailForm.balance_amount,
        prod_payment_methods: chosenMethods,
        prod_payment_amount_cash: parseFloat(productDetailForm.payment_amounts.Cash) || 0,
        prod_payment_amount_card: parseFloat(productDetailForm.payment_amounts.Card) || 0,
        prod_payment_amount_upi: parseFloat(productDetailForm.payment_amounts.UPI) || 0,
        prod_payment_amount_bank: parseFloat(productDetailForm.payment_amounts['Bank Transfer']) || 0,
        prod_payment_amount_credit: parseFloat(productDetailForm.payment_amounts.Credit) || 0,
        prod_gst: productDetailForm.gst_percent,
        prod_tax_inclusive: productDetailForm.tax_inclusive,
        prod_offer_available: productDetailForm.offer_available,
        prod_offer_type: productDetailForm.offer_type,
        prod_offer_amount: productDetailForm.offer_amount,
        prod_offer_start: productDetailForm.offer_start,
        prod_offer_end: productDetailForm.offer_end,
        prod_status: productDetailForm.status,
      };

      const res = await api.post('/products/save-detail', payload);
      if (res && res.success) {
        alert(res.message || 'Product(s) added successfully!');
        setShowProductModal(false);
        fetchInitialData();
      }
    } catch (err) {
      alert(err.message || 'Failed to save product details');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Supplier CRUD & Workflows (Matching C:\xampp\htdocs\billing\billingsoftwaregod)
  // -------------------------------------------------------------------------
  const openAddSupplierModal = () => {
    setFullSupplierForm({
      id: null,
      supplier_name: '',
      mobile_number: '',
      email: '',
      purchase_date: new Date().toISOString().split('T')[0],
      address: '',
      city: 'Swamimalai',
      state: 'Tamil Nadu',
      gst_number: '',
      status: 'Active',
      products: [],
      total_amount_purchased: 0,
      payment_methods: {
        Cash: false,
        Card: false,
        UPI: false,
        'Bank Transfer': false,
        Credit: false,
      },
      payment_amounts: {
        Cash: '',
        Card: '',
        UPI: '',
        'Bank Transfer': '',
        Credit: '',
      },
      total_amount_paid: 0,
      balance_amount: 0,
      payment_status: 'Unpaid',
    });
    setShowSupplierModal(true);
  };

  const openEditSupplierModal = (s) => {
    const suppProds = products.filter(
      (p) => String(p.supplier_id) === String(s._id) || String(p.supplier_id) === String(s.legacyId) || p.supplier_name === s.name
    );
    const suppRows = suppProds.map((p) => ({
      product_id: p._id,
      name: p.name,
      category: p.category_name || (p.category_id && p.category_id.name) || '',
      subcategory: p.subcategory_name || (p.subcategory_id && p.subcategory_id.name) || '',
      units: p.current_stock || 1,
      piece_rate: p.piece_rate || p.purchase_price || 0,
      purchase_price: p.purchase_price || (p.piece_rate * (p.current_stock || 1)) || 0,
      margin_percentage: p.margin_percentage !== undefined ? p.margin_percentage : 60,
      selling_price: p.selling_price || 0,
      gst: p.gst_percent || 12,
      barcode: p.barcode || '',
    }));

    const pmString = (s.payment_methods || 'Cash').toLowerCase();
    const pmState = {
      Cash: pmString.includes('cash'),
      Card: pmString.includes('card'),
      UPI: pmString.includes('upi'),
      'Bank Transfer': pmString.includes('bank') || pmString.includes('transfer'),
      Credit: pmString.includes('credit'),
    };

    const pmAmounts = {
      Cash: s.payment_amount_cash || (pmState.Cash ? s.total_paid : '') || '',
      Card: s.payment_amount_card || (pmState.Card ? s.total_paid : '') || '',
      UPI: s.payment_amount_upi || (pmState.UPI ? s.total_paid : '') || '',
      'Bank Transfer': s.payment_amount_bank || (pmState['Bank Transfer'] ? s.total_paid : '') || '',
      Credit: s.payment_amount_credit || (pmState.Credit ? s.total_paid : '') || '',
    };

    const totalPurch = s.total_purchased || (suppRows.reduce((sum, r) => sum + (parseFloat(r.purchase_price) || 0), 0)) || 0;
    const totalPaid = s.total_paid || 0;
    const balance = Math.max(0, totalPurch - totalPaid);

    setFullSupplierForm({
      id: s._id || s.id,
      supplier_name: s.name || s.supplier_name || '',
      mobile_number: s.mobile || s.mobile_number || '',
      email: s.email || '',
      purchase_date: s.purchase_date || new Date().toISOString().split('T')[0],
      address: s.address || '',
      city: s.city || 'Swamimalai',
      state: s.state || 'Tamil Nadu',
      gst_number: s.gst_number || s.gstin || '',
      status: (s.status || 'Active').toLowerCase() === 'active' ? 'Active' : 'Inactive',
      products: suppRows,
      total_amount_purchased: totalPurch,
      payment_methods: pmState,
      payment_amounts: pmAmounts,
      total_amount_paid: totalPaid,
      balance_amount: balance,
      payment_status: balance <= 0 ? 'Paid' : totalPaid > 0 ? 'Partially Paid' : 'Unpaid',
    });
    setShowSupplierModal(true);
  };

  const openViewSupplier = (s) => {
    setSelectedSupplierForView(s);
    setShowViewSupplierModal(true);
  };

  const handleDeleteSupplier = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete supplier "${name}"? This action cannot be undone.`)) return;
    try {
      await api.delete(`/suppliers/${id}`);
      fetchInitialData();
    } catch (err) {
      alert(err.message || 'Failed to delete supplier');
    }
  };

  const openQuickAddSupplierModal = () => {
    setQuickSupplierForm({
      name: '',
      mobile: '',
      city: 'Swamimalai',
      gst_number: '',
    });
    setShowQuickSupplierModal(true);
  };

  const handleQuickSupplierSubmit = async (e) => {
    e.preventDefault();
    if (!quickSupplierForm.name.trim() || !quickSupplierForm.mobile.trim()) {
      alert('Supplier name and mobile number are required.');
      return;
    }
    try {
      const payload = {
        name: quickSupplierForm.name.trim(),
        mobile: quickSupplierForm.mobile.trim(),
        city: quickSupplierForm.city.trim() || 'Swamimalai',
        gst_number: quickSupplierForm.gst_number.trim().toUpperCase(),
        gstin: quickSupplierForm.gst_number.trim().toUpperCase(),
        status: 'active',
      };
      const res = await api.post('/suppliers', payload);
      alert('Supplier registered successfully!');
      setShowQuickSupplierModal(false);

      if (res && res.data) {
        const newSupp = res.data;
        setProductDetailForm((prev) => ({
          ...prev,
          supplier_id: newSupp._id || newSupp.legacyId || newSupp.id,
        }));
      }
      fetchInitialData();
    } catch (err) {
      alert(err.message || 'Failed to save supplier');
    }
  };

  const addSupplierProductRow = () => {
    setFullSupplierForm((prev) => {
      const newProducts = [...prev.products, initialSupplierProductRow()];
      const totalPurchased = newProducts.reduce((sum, r) => sum + (parseFloat(r.purchase_price) || 0), 0);
      const balance = Math.max(0, totalPurchased - prev.total_amount_paid);
      return {
        ...prev,
        products: newProducts,
        total_amount_purchased: totalPurchased,
        balance_amount: balance,
        payment_status: balance <= 0 ? 'Paid' : prev.total_amount_paid > 0 ? 'Partially Paid' : 'Unpaid',
      };
    });
  };

  const updateSupplierProductRow = (idx, field, value) => {
    setFullSupplierForm((prev) => {
      const newProducts = [...prev.products];
      const row = { ...newProducts[idx], [field]: value };

      if (field === 'units' || field === 'piece_rate') {
        const u = Math.max(0, parseInt(field === 'units' ? value : row.units) || 0);
        const pr = Math.max(0, parseFloat(field === 'piece_rate' ? value : row.piece_rate) || 0);
        row.units = u;
        row.piece_rate = pr;
        row.purchase_price = u * pr;
        const m = parseFloat(row.margin_percentage) || 60;
        row.selling_price = Math.round((pr * (1 + m / 100)) * 100) / 100;
      } else if (field === 'margin_percentage') {
        const m = parseFloat(value) || 0;
        row.margin_percentage = m;
        row.selling_price = Math.round((row.piece_rate * (1 + m / 100)) * 100) / 100;
      } else if (field === 'selling_price') {
        const sp = parseFloat(value) || 0;
        row.selling_price = sp;
        if (row.piece_rate > 0) {
          row.margin_percentage = Math.round((((sp - row.piece_rate) / row.piece_rate) * 100) * 100) / 100;
        }
      }

      newProducts[idx] = row;
      const totalPurchased = newProducts.reduce((sum, r) => sum + (parseFloat(r.purchase_price) || 0), 0);
      const balance = Math.max(0, totalPurchased - prev.total_amount_paid);

      return {
        ...prev,
        products: newProducts,
        total_amount_purchased: totalPurchased,
        balance_amount: balance,
        payment_status: balance <= 0 ? 'Paid' : prev.total_amount_paid > 0 ? 'Partially Paid' : 'Unpaid',
      };
    });
  };

  const removeSupplierProductRow = (idx) => {
    setFullSupplierForm((prev) => {
      const newProducts = prev.products.filter((_, i) => i !== idx);
      const totalPurchased = newProducts.reduce((sum, r) => sum + (parseFloat(r.purchase_price) || 0), 0);
      const balance = Math.max(0, totalPurchased - prev.total_amount_paid);
      return {
        ...prev,
        products: newProducts,
        total_amount_purchased: totalPurchased,
        balance_amount: balance,
        payment_status: balance <= 0 ? 'Paid' : prev.total_amount_paid > 0 ? 'Partially Paid' : 'Unpaid',
      };
    });
  };

  const toggleSupplierPaymentMethod = (method) => {
    setFullSupplierForm((prev) => {
      const nextChecked = !prev.payment_methods[method];
      const newMethods = { ...prev.payment_methods, [method]: nextChecked };
      const newAmounts = {
        ...prev.payment_amounts,
        [method]: nextChecked ? prev.payment_amounts[method] || '' : '',
      };

      const totalPaid = Object.keys(newAmounts).reduce((sum, k) => {
        return sum + (newMethods[k] ? parseFloat(newAmounts[k]) || 0 : 0);
      }, 0);

      const balance = Math.max(0, prev.total_amount_purchased - totalPaid);
      return {
        ...prev,
        payment_methods: newMethods,
        payment_amounts: newAmounts,
        total_amount_paid: totalPaid,
        balance_amount: balance,
        payment_status: balance <= 0 ? 'Paid' : totalPaid > 0 ? 'Partially Paid' : 'Unpaid',
      };
    });
  };

  const onSupplierPaymentAmountChange = (method, val) => {
    setFullSupplierForm((prev) => {
      const newAmounts = { ...prev.payment_amounts, [method]: val };
      const totalPaid = Object.keys(newAmounts).reduce((sum, k) => {
        return sum + (prev.payment_methods[k] ? parseFloat(newAmounts[k]) || 0 : 0);
      }, 0);

      const balance = Math.max(0, prev.total_amount_purchased - totalPaid);
      return {
        ...prev,
        payment_amounts: newAmounts,
        total_amount_paid: totalPaid,
        balance_amount: balance,
        payment_status: balance <= 0 ? 'Paid' : totalPaid > 0 ? 'Partially Paid' : 'Unpaid',
      };
    });
  };

  const onSupplierTotalPurchasedChange = (val) => {
    const purch = parseFloat(val) || 0;
    setFullSupplierForm((prev) => {
      const balance = Math.max(0, purch - prev.total_amount_paid);
      return {
        ...prev,
        total_amount_purchased: purch,
        balance_amount: balance,
        payment_status: balance <= 0 ? 'Paid' : prev.total_amount_paid > 0 ? 'Partially Paid' : 'Unpaid',
      };
    });
  };

  const handleFullSupplierSubmit = async (e) => {
    e.preventDefault();
    if (!fullSupplierForm.supplier_name.trim()) {
      alert('Supplier name is required.');
      return;
    }
    if (!fullSupplierForm.mobile_number.trim()) {
      alert('Mobile number is required.');
      return;
    }

    try {
      const selectedMethods = Object.keys(fullSupplierForm.payment_methods).filter(
        (k) => fullSupplierForm.payment_methods[k]
      );

      const payload = {
        supplier_id: fullSupplierForm.id,
        supplier_name: fullSupplierForm.supplier_name.trim(),
        mobile_number: fullSupplierForm.mobile_number.trim(),
        email: fullSupplierForm.email.trim(),
        purchase_date: fullSupplierForm.purchase_date,
        address: fullSupplierForm.address.trim(),
        city: fullSupplierForm.city.trim() || 'Swamimalai',
        state: fullSupplierForm.state.trim() || 'Tamil Nadu',
        gst_number: fullSupplierForm.gst_number.trim().toUpperCase(),
        status: (fullSupplierForm.status || 'Active').toLowerCase(),
        products: fullSupplierForm.products,
        total_amount_purchased: fullSupplierForm.total_amount_purchased,
        payment_methods: selectedMethods.join(', '),
        payment_amount_cash: fullSupplierForm.payment_amounts.Cash || 0,
        payment_amount_card: fullSupplierForm.payment_amounts.Card || 0,
        payment_amount_upi: fullSupplierForm.payment_amounts.UPI || 0,
        payment_amount_bank: fullSupplierForm.payment_amounts['Bank Transfer'] || 0,
        payment_amount_credit: fullSupplierForm.payment_amounts.Credit || 0,
        total_amount_paid: fullSupplierForm.total_amount_paid,
        balance_amount: fullSupplierForm.balance_amount,
      };

      await api.post('/suppliers/save-with-products', payload);
      alert(fullSupplierForm.id ? 'Supplier updated successfully!' : 'Supplier registered successfully!');
      setShowSupplierModal(false);
      fetchInitialData();
    } catch (err) {
      alert(err.message || 'Failed to save supplier');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete product "${name}" from catalog?`)) return;
    try {
      await api.delete(`/products/${id}`);
      fetchInitialData();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  // -------------------------------------------------------------------------
  // Supplier Products Detailed Sheet Modal
  // -------------------------------------------------------------------------
  const openSupplierSheet = (supplier) => {
    setSelectedSupplierForSheet(supplier);
    setShowSupplierSheetModal(true);
  };

  // -------------------------------------------------------------------------
  // KPI Calculations (Exact to C:\xampp\htdocs\billing\billingsoftwaregod)
  // -------------------------------------------------------------------------
  const totalCatalogItems = products.length;
  const totalBoughtUnits = products.reduce((sum, p) => sum + (parseInt(p.total_purchased_qty || p.current_stock) || 0), 0);
  const totalInvestedInvert = products.reduce((sum, p) => {
    const cost = parseFloat(p.purchase_price) || 0;
    const qty = parseInt(p.total_purchased_qty || p.current_stock) || 0;
    return sum + (cost > 0 ? (cost * (p.current_stock > 0 ? 1 : 0)) : (parseFloat(p.piece_rate || 0) * qty));
  }, 0);
  const totalSoldValue = products.reduce((sum, p) => {
    const sp = parseFloat(p.selling_price) || 0;
    const sold = parseInt(p.total_sold_qty) || 0;
    return sum + sp * sold;
  }, 0);

  // -------------------------------------------------------------------------
  // Filtered Tables
  // -------------------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = productSearch.toLowerCase();
      const matchesSearch =
        !productSearch ||
        p.name?.toLowerCase().includes(q) ||
        p.code?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.barcode?.toLowerCase().includes(q) ||
        p.supplier_name?.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q);

      const matchesCat = !productCatFilter || String(p.category_id) === String(productCatFilter) || p.category_name === productCatFilter;
      const matchesSupp = !productSupplierFilter || String(p.supplier_id) === String(productSupplierFilter) || p.supplier_name === productSupplierFilter;

      let matchesStock = true;
      const stock = parseInt(p.current_stock) || 0;
      if (productStockFilter === 'in_stock') matchesStock = stock > 0;
      if (productStockFilter === 'low_stock') matchesStock = stock <= (p.min_stock_alert || 2) && stock > 0;
      if (productStockFilter === 'out_of_stock') matchesStock = stock <= 0;

      return matchesSearch && matchesCat && matchesSupp && matchesStock;
    });
  }, [products, productSearch, productCatFilter, productSupplierFilter, productStockFilter]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const q = supplierSearch.toLowerCase();
      const matchesSearch =
        !supplierSearch ||
        s.name?.toLowerCase().includes(q) ||
        s.mobile?.includes(q) ||
        s.city?.toLowerCase().includes(q) ||
        s.gstin?.toLowerCase().includes(q) ||
        s.supplier_code?.toLowerCase().includes(q);

      const matchesStatus =
        !supplierStatusFilter ||
        (supplierStatusFilter.toLowerCase() === 'active' ? s.status?.toLowerCase() === 'active' : s.status?.toLowerCase() === 'inactive');

      let matchesProducts = true;
      const pCount = s.product_count || (s.products_supplied ? s.products_supplied.length : 0);
      if (supplierProductsFilter === 'with_products') matchesProducts = pCount > 0;
      if (supplierProductsFilter === 'no_products') matchesProducts = pCount === 0;

      return matchesSearch && matchesStatus && matchesProducts;
    });
  }, [suppliers, supplierSearch, supplierStatusFilter, supplierProductsFilter]);

  // Selected supplier name in combobox
  const selectedSupplierObj = suppliers.find(
    (s) => String(s._id) === String(productDetailForm.supplier_id) || String(s.legacyId) === String(productDetailForm.supplier_id) || String(s.id) === String(productDetailForm.supplier_id)
  );

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12 select-none">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Product Management</h1>
          <p className="text-xs text-slate-500">Select an entry module below to manage your catalog and billing details</p>
        </div>
      </div>

      {/* 4 Compact Module Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Supplier Details Card */}
        <button
          type="button"
          onClick={() => setActiveTab('supplier-section')}
          className={`group relative bg-white border rounded-xl p-3 sm:p-3.5 shadow-xs transition-all duration-200 flex items-center gap-3 text-left w-full outline-none cursor-pointer ${
            activeTab === 'supplier-section'
              ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
              : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
              activeTab === 'supplier-section'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white'
            }`}
          >
            <i className="fas fa-truck text-base"></i>
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors truncate">
              Supplier Details
            </h3>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">Vendors & products</p>
          </div>
        </button>

        {/* Product Details Card */}
        <button
          type="button"
          onClick={() => setActiveTab('product-section')}
          className={`group relative bg-white border rounded-xl p-3 sm:p-3.5 shadow-xs transition-all duration-200 flex items-center gap-3 text-left w-full outline-none cursor-pointer ${
            activeTab === 'product-section'
              ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
              : 'border-slate-200 hover:border-amber-300 hover:shadow-md'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
              activeTab === 'product-section'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-500 group-hover:text-white'
            }`}
          >
            <i className="fas fa-box-open text-base"></i>
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-700 transition-colors truncate">
              Product Details
            </h3>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">Catalog & inventory</p>
          </div>
        </button>

        {/* Barcode Details Card */}
        <button
          type="button"
          onClick={() => setActiveTab('barcode-section')}
          className={`group relative bg-white border rounded-xl p-3 sm:p-3.5 shadow-xs transition-all duration-200 flex items-center gap-3 text-left w-full outline-none cursor-pointer ${
            activeTab === 'barcode-section'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
              : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
              activeTab === 'barcode-section'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white'
            }`}
          >
            <i className="fas fa-barcode text-base"></i>
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
              Barcode Details
            </h3>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">Print labels & tags</p>
          </div>
        </button>

        {/* Invoice Details Card */}
        <button
          type="button"
          onClick={() => setActiveTab('invoice-section')}
          className={`group relative bg-white border rounded-xl p-3 sm:p-3.5 shadow-xs transition-all duration-200 flex items-center gap-3 text-left w-full outline-none cursor-pointer ${
            activeTab === 'invoice-section'
              ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-md'
              : 'border-slate-200 hover:border-rose-300 hover:shadow-md'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
              activeTab === 'invoice-section'
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-500 group-hover:text-white'
            }`}
          >
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

      {/* ========================================================================= */}
      {/* 1. SUPPLIER SECTION */}
      {/* ========================================================================= */}
      {activeTab === 'supplier-section' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="text-xl font-extrabold text-slate-900">Supplier Management</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Add new suppliers and manage product associations.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddSupplierModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-plus"></i> Add Supplier
            </button>
          </div>

          {/* Supplier Search & Filters Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              <div className="lg:col-span-5 relative">
                <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  value={supplierSearch}
                  onChange={(e) => setSupplierSearch(e.target.value)}
                  placeholder="Search by supplier name, mobile, city, GST..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="lg:col-span-2">
                <select
                  value={supplierStatusFilter}
                  onChange={(e) => setSupplierStatusFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                </select>
              </div>

              <div className="lg:col-span-3">
                <select
                  value={supplierProductsFilter}
                  onChange={(e) => setSupplierProductsFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="">All Suppliers</option>
                  <option value="with_products">Has Products (&gt; 0)</option>
                  <option value="no_products">No Products Associated (0)</option>
                </select>
              </div>

              <div className="lg:col-span-2 flex items-center justify-end gap-2">
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100 whitespace-nowrap">
                  {filteredSuppliers.length} Suppliers
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
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      <i className="fas fa-truck text-3xl mb-2 text-slate-300 block"></i>
                      <p className="font-bold text-slate-600 text-sm">No suppliers found</p>
                      <p className="text-xs mt-1">Click "Add Supplier" to create your first vendor.</p>
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((s) => {
                    const suppProducts = products.filter(
                      (p) => String(p.supplier_id) === String(s.legacyId) || String(p.supplier_id) === String(s._id) || p.supplier_name === s.name
                    );
                    const count = suppProducts.length;

                    return (
                      <tr key={s._id || s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer" title="Supplier Name">{s.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                            <span><i className="fas fa-map-marker-alt text-slate-400 mr-1"></i>{s.city || 'Tamil Nadu'}</span>
                            {s.email && <span>• <i className="fas fa-envelope text-slate-400 mx-1"></i>{s.email}</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{s.mobile || '—'}</td>
                        <td className="py-3 px-4">
                          {count > 0 ? (
                            <button
                              type="button"
                              onClick={() => openSupplierSheet(s)}
                              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white transition-all font-bold text-xs shadow-xs border border-indigo-200 hover:border-indigo-600 cursor-pointer"
                              title={`Click to view all ${count} products & sales sheet`}
                            >
                              <i className="fas fa-boxes text-indigo-500 group-hover:text-white transition-colors"></i>
                              <span>{count} Products</span>
                              <span className="text-[9px] bg-white text-indigo-700 group-hover:bg-indigo-500 group-hover:text-white px-1.5 py-0.5 rounded-md border border-indigo-200 group-hover:border-indigo-400 font-extrabold uppercase tracking-wider transition-colors">
                                View Sheet
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openProductModal(s._id || s.legacyId)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-800 transition-all font-semibold text-xs border border-slate-200 cursor-pointer"
                              title="No products associated yet. Click to add products"
                            >
                              <i className="fas fa-plus text-[10px]"></i>
                              <span>0 Products</span>
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-600 font-semibold">{s.gstin || s.gst_number || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              (s.status || 'active').toLowerCase() === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {(s.status || 'active').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openSupplierSheet(s)}
                              title="View Products & Sales Sheet"
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white text-indigo-600 text-xs flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                            >
                              <i className="fas fa-table"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => openViewSupplier(s)}
                              title="View Supplier Profile"
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-600 text-xs flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditSupplierModal(s)}
                              title="Edit Supplier"
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-50 text-amber-600 text-xs flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSupplier(s._id || s.id, s.name)}
                              title="Delete Supplier"
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 text-xs flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
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

      {/* ========================================================================= */}
      {/* 2. PRODUCT MANAGEMENT SECTION (Exact C:\xampp\htdocs\billing\billingsoftwaregod) */}
      {/* ========================================================================= */}
      {activeTab === 'product-section' && (
        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 shadow-inner space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left mb-2">
            <div>
              <h4 className="text-xl font-extrabold text-amber-900">Product Management</h4>
              <p className="text-xs text-amber-600/80 mt-1 font-medium">
                Add new products to your catalog, track investments (Invert), and monitor sales.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openProductModal()}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <i className="fas fa-plus"></i> Add Products Detail
            </button>
          </div>

          {/* Product Overview KPI Cards: Evlo Vangunom, Evlo Invert, Evlo Sales */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white border border-amber-200/90 rounded-xl p-3 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-amber-700/80 block">
                <i className="fas fa-boxes text-amber-500 mr-1"></i> Total Catalog Items
              </span>
              <span className="text-base sm:text-lg font-black text-amber-950 font-mono">
                {totalCatalogItems} Products
              </span>
            </div>

            <div className="bg-white border border-indigo-200/90 rounded-xl p-3 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-indigo-700/80 block">
                <i className="fas fa-truck-loading text-indigo-500 mr-1"></i> Total Bought (Vangunom)
              </span>
              <span className="text-base sm:text-lg font-black text-indigo-950 font-mono">
                {totalBoughtUnits} Units
              </span>
            </div>

            <div className="bg-white border border-amber-200/90 rounded-xl p-3 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-amber-700/80 block">
                <i className="fas fa-coins text-amber-600 mr-1"></i> Total Invested (Invert)
              </span>
              <span className="text-base sm:text-lg font-black text-amber-900 font-mono">
                ₹{totalInvestedInvert.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-white border border-emerald-200/90 rounded-xl p-3 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-emerald-700/80 block">
                <i className="fas fa-chart-line text-emerald-600 mr-1"></i> Total Sales (Sold Value)
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-900 font-mono">
                ₹{totalSoldValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Product Search & Filter Controls */}
          <div className="bg-white p-4 rounded-xl border border-amber-200/90 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              <div className="lg:col-span-4 relative">
                <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search product name, SKU, barcode, supplier..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-amber-500 font-medium"
                />
                {productSearch && (
                  <button
                    type="button"
                    onClick={() => setProductSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <i className="fas fa-times-circle"></i>
                  </button>
                )}
              </div>

              <div className="lg:col-span-3">
                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-amber-500 font-medium"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id || c.id} value={c.legacyId || c.id || c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-3">
                <select
                  value={productSupplierFilter}
                  onChange={(e) => setProductSupplierFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-amber-500 font-medium"
                >
                  <option value="">All Suppliers</option>
                  {suppliers.map((s) => (
                    <option key={s._id || s.id} value={s.legacyId || s._id || s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <select
                  value={productStockFilter}
                  onChange={(e) => setProductStockFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-amber-500 font-medium"
                >
                  <option value="">All Stock</option>
                  <option value="in_stock">In Stock (&gt; 0)</option>
                  <option value="low_stock">Low Stock (≤ Min)</option>
                  <option value="out_of_stock">Out of Stock (0)</option>
                </select>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-amber-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setProductSearch('');
                    setProductCatFilter('');
                    setProductSupplierFilter('');
                    setProductStockFilter('');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="fas fa-undo text-[10px]"></i> Reset Filters
                </button>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-200 whitespace-nowrap">
                  {filteredProducts.length} Products
                </span>
              </div>
            </div>
          </div>

          {/* Product Table (Exact columns matching C:\xampp\htdocs\billing\billingsoftwaregod) */}
          <div className="overflow-x-auto rounded-xl border border-amber-200">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-amber-100/60 text-amber-800 uppercase text-[10px] font-extrabold border-b border-amber-200 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[200px]">Product & Barcode</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[130px]">Category & Vendor</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[150px]">Unit Rates (Cost / Sell)</th>
                  <th className="py-3.5 px-4 text-center whitespace-nowrap min-w-[180px]">
                    Stock Movement (Vangunom / Sold / Stock)
                  </th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[180px]">
                    Total Investment & Sales (Invert / Sales)
                  </th>
                  <th className="py-3.5 px-4 text-center whitespace-nowrap min-w-[70px]">GST</th>
                  <th className="py-3.5 px-4 text-center whitespace-nowrap min-w-[90px]">Status</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[110px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 bg-white">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-amber-400">
                      <i className="fas fa-box-open text-3xl mb-3 block text-amber-300"></i>
                      <p className="font-bold text-amber-600 text-sm">No products found</p>
                      <p className="text-xs mt-1">Click "Add Products Detail" to create your first entry.</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const stock = parseInt(p.current_stock) || 0;
                    const sold = parseInt(p.total_sold_qty) || 0;
                    const bought = parseInt(p.total_purchased_qty || stock + sold) || stock;
                    const pieceRate = parseFloat(p.piece_rate) || (bought > 0 ? parseFloat(p.purchase_price) / bought : parseFloat(p.purchase_price)) || 0;
                    const sellPrice = parseFloat(p.selling_price) || 0;
                    const margin = parseFloat(p.margin_percentage) || 60;
                    const totalInvert = bought * pieceRate;
                    const totalSalesRevenue = sold * sellPrice;

                    return (
                      <tr key={p._id || p.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <strong className="text-slate-900 font-bold block text-sm">{p.name}</strong>
                          <span className="font-mono text-[11px] text-amber-800 font-bold">{p.sku || p.code}</span>
                          <span className="font-mono text-[10px] text-slate-400 block">{p.barcode || '—'}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {p.category_name || 'General'}
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-1 font-medium">{p.supplier_name || 'Direct'}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <div className="text-slate-700 text-xs">
                            Cost: <strong>₹{pieceRate.toFixed(2)}</strong>
                          </div>
                          <div className="text-emerald-700 font-bold text-xs">
                            Sell: ₹{sellPrice.toFixed(2)}{' '}
                            <span className="text-[10px] text-amber-600 font-semibold font-sans">({margin}%)</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          <div className="flex items-center justify-center gap-1.5 text-xs">
                            <span className="text-indigo-700 font-bold" title="Total Bought (Vangunom)">
                              {bought}
                            </span>
                            <span className="text-slate-300">/</span>
                            <span className="text-emerald-600 font-bold" title="Sold">
                              {sold}
                            </span>
                            <span className="text-slate-300">/</span>
                            <span
                              className={`font-black ${
                                stock <= 0 ? 'text-rose-600' : stock <= 2 ? 'text-amber-600' : 'text-slate-900'
                              }`}
                              title="Current Stock"
                            >
                              {stock}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono">
                          <div className="text-amber-800 text-xs font-bold">
                            Inv: ₹{totalInvert.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-emerald-700 text-xs font-bold">
                            Sale: ₹{totalSalesRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="text-[10px] font-bold text-slate-600 font-mono">{p.gst_percent || 12}%</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              stock <= 0
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : (p.status || 'active').toLowerCase() === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {stock <= 0 ? 'Out of Stock' : p.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleEditSingleProduct(p)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs cursor-pointer border border-amber-200"
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

      {/* ========================================================================= */}
      {/* 3. BARCODE DETAILS SECTION */}
      {/* ========================================================================= */}
      {activeTab === 'barcode-section' && (
        <div className="bg-white border border-emerald-200/90 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-xl font-extrabold text-emerald-950">Barcode Management</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Generate and print barcode labels for products and inventory shelves.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-barcode"></i> Print All Barcodes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">Prefix</label>
              <input
                type="text"
                value={barcodePrefix}
                onChange={(e) => setBarcodePrefix(e.target.value.toUpperCase())}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono font-bold"
              />
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">Separator</label>
              <input
                type="text"
                value={barcodeSeparator}
                onChange={(e) => setBarcodeSeparator(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono"
              />
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">Label Size</label>
              <select
                value={barcodeLabelSize}
                onChange={(e) => setBarcodeLabelSize(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
              >
                <option value="50x25">50mm x 25mm (Standard)</option>
                <option value="38x25">38mm x 25mm (Compact)</option>
                <option value="100x50">100mm x 50mm (Large Altar)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. INVOICE DETAILS SECTION */}
      {/* ========================================================================= */}
      {activeTab === 'invoice-section' && (
        <div className="bg-white border border-rose-200/90 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <h4 className="text-xl font-extrabold text-slate-900">Supplier Invoices Register</h4>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Manage supplier purchase amounts, track payments, and update settlement status.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold text-slate-700">Supplier</th>
                  <th className="py-3.5 px-4 font-bold text-slate-700">Purchased Amount</th>
                  <th className="py-3.5 px-4 font-bold text-slate-700">Paid Amount</th>
                  <th className="py-3.5 px-4 font-bold text-slate-700">Balance Due</th>
                  <th className="py-3.5 px-4 font-bold text-slate-700">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400">
                      No supplier invoices available yet.
                    </td>
                  </tr>
                ) : (
                  suppliers.map((s) => (
                    <tr key={s._id || s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{s.name}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        ₹{(s.total_purchased || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                        ₹{(s.total_paid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-700">
                        ₹{(s.balance_due || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.payment_status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : s.payment_status === 'Partially Paid'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {s.payment_status || 'Unpaid'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EXACT "Add Products Detail" MODAL (from C:\xampp\htdocs\billing\billingsoftwaregod) */}
      {/* ========================================================================= */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs overflow-y-auto flex items-center justify-center p-3 sm:p-6 py-8">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl relative animate-in fade-in zoom-in-95 my-auto max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-20 shadow-xs">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <i className="fas fa-box-open text-amber-600"></i>
                <span>{editingProductId ? 'Edit Product Details' : 'Add Products Detail'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-colors cursor-pointer"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProductDetail} id="product-detail-modal-form" className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* 1. Supplier Information */}
              <div className="bg-indigo-50/30 p-5 rounded-xl border border-indigo-100">
                <h4 className="text-sm font-bold text-slate-800 border-b border-indigo-200 pb-2 mb-4 flex items-center gap-2">
                  <i className="fas fa-truck text-indigo-500"></i>
                  <span>1. Supplier Information</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Supplier Combobox */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Supplier Name <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={openQuickAddSupplierModal}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <i className="fas fa-plus-circle text-xs"></i> + New Supplier
                      </button>
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSupplierComboboxOpen(!supplierComboboxOpen)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-left flex items-center justify-between outline-none focus:border-indigo-500 hover:border-slate-300 shadow-xs cursor-pointer"
                      >
                        <span className={`truncate font-medium ${selectedSupplierObj ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                          {selectedSupplierObj ? selectedSupplierObj.name : 'Select or search supplier...'}
                        </span>
                        <i className="fas fa-chevron-down text-xs text-slate-400"></i>
                      </button>

                      {supplierComboboxOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                          <div className="p-2 border-b border-slate-100 bg-slate-50 relative">
                            <i className="fas fa-search absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input
                              type="text"
                              value={supplierSearchTerm}
                              onChange={(e) => setSupplierSearchTerm(e.target.value)}
                              placeholder="Search supplier by name, mobile, city..."
                              className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500 font-medium"
                              autoFocus
                            />
                          </div>

                          <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                            {suppliers
                              .filter((s) => !supplierSearchTerm || s.name?.toLowerCase().includes(supplierSearchTerm.toLowerCase()))
                              .map((s) => (
                                <button
                                  key={s._id || s.id}
                                  type="button"
                                  onClick={() => {
                                    setProductDetailForm((prev) => ({ ...prev, supplier_id: s._id || s.legacyId || s.id }));
                                    setSupplierComboboxOpen(false);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 transition-colors flex items-center justify-between cursor-pointer"
                                >
                                  <div>
                                    <strong className="text-slate-900 block">{s.name}</strong>
                                    <span className="text-[10px] text-slate-400 font-mono">{s.mobile || s.city || 'Vendor'}</span>
                                  </div>
                                  <span className="text-[10px] font-mono text-indigo-700 font-bold">{s.supplier_code || 'SUP'}</span>
                                </button>
                              ))}
                          </div>

                          <div className="p-2 border-t border-slate-100 bg-slate-50">
                            <button
                              type="button"
                              onClick={() => {
                                setSupplierComboboxOpen(false);
                                openQuickAddSupplierModal();
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-between border border-indigo-200 cursor-pointer"
                            >
                              <span className="flex items-center gap-1.5">
                                <i className="fas fa-user-plus text-indigo-600"></i>
                                <span>+ Add New Supplier</span>
                              </span>
                              <span className="text-[10px] bg-white text-indigo-600 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider font-black">
                                Quick Add
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Supply Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Supply / Purchase Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={productDetailForm.supply_date}
                      onChange={(e) => setProductDetailForm({ ...productDetailForm, supply_date: e.target.value })}
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono outline-none focus:border-indigo-500 transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Products Supplied (Multi-row dynamic fields) */}
              <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <i className="fas fa-box-open text-amber-500"></i>
                    <span>2. Products Supplied</span>
                  </h4>
                  <button
                    type="button"
                    onClick={addProductRow}
                    className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <i className="fas fa-plus"></i> Add Another Product
                  </button>
                </div>

                <div className="space-y-4">
                  {productDetailForm.products.map((row, idx) => (
                    <div
                      key={idx}
                      className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-amber-200 rounded-xl bg-white shadow-xs"
                    >
                      {productDetailForm.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProductRow(idx)}
                          className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors shadow-sm cursor-pointer z-10"
                          title="Remove product"
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                      )}

                      {/* Product Name */}
                      <div className="md:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">
                          Product Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={row.name}
                          onChange={(e) => handleProductRowChange(idx, 'name', e.target.value)}
                          placeholder="e.g. Brass Ganesha Idol"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-amber-500 font-semibold text-slate-900"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">
                          Category <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          list="cat-datalist"
                          value={row.category}
                          onChange={(e) => handleProductRowChange(idx, 'category', e.target.value)}
                          placeholder="Search or type Category"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-amber-500 font-medium"
                        />
                      </div>

                      {/* Subcategory */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Subcategory</label>
                        <input
                          type="text"
                          list="subcat-datalist"
                          value={row.subcategory}
                          onChange={(e) => handleProductRowChange(idx, 'subcategory', e.target.value)}
                          placeholder="Search or type Subcat"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-amber-500 font-medium"
                        />
                      </div>

                      {/* Pieces Count */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Pieces Count</label>
                        <input
                          type="number"
                          min="0"
                          value={row.units}
                          onChange={(e) => handleProductRowChange(idx, 'units', e.target.value)}
                          placeholder="e.g. 10"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* One Piece Rate */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">One Piece Rate (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={row.piece_rate}
                          onChange={(e) => handleProductRowChange(idx, 'piece_rate', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Total Purchase Price (Read-only) */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Total Purchase Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={row.purchase_price}
                          readOnly
                          className="w-full bg-slate-100 border border-slate-200 text-slate-600 font-bold font-mono rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-not-allowed"
                        />
                      </div>

                      {/* Margin Percentage */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Margin Percentage (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={row.margin_percentage}
                          onChange={(e) => handleProductRowChange(idx, 'margin_percentage', e.target.value)}
                          placeholder="60.00"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Selling Price */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={row.selling_price}
                          onChange={(e) => handleProductRowChange(idx, 'selling_price', e.target.value)}
                          className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold font-mono rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* GST */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">GST (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={row.gst}
                          onChange={(e) => handleProductRowChange(idx, 'gst', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Barcode */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Barcode (Auto)</label>
                        <input
                          type="text"
                          value={row.barcode}
                          readOnly
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 font-mono outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Datalists for categories and subcategories */}
                <datalist id="cat-datalist">
                  {categories.map((c) => (
                    <option key={c._id || c.id} value={c.name} />
                  ))}
                </datalist>
                <datalist id="subcat-datalist">
                  {subcategories.map((s) => (
                    <option key={s._id || s.id} value={s.name} />
                  ))}
                </datalist>
              </div>

              {/* 3. Payment Information */}
              <div className="bg-emerald-50/30 p-5 rounded-xl border border-emerald-100 space-y-4">
                <h4 className="text-sm font-bold text-slate-800 border-b border-emerald-200 pb-2 flex items-center gap-2">
                  <i className="fas fa-credit-card text-emerald-500"></i>
                  <span>3. Payment Information</span>
                </h4>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Amount Purchased (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productDetailForm.total_amount_purchased}
                    readOnly
                    className="w-full md:w-1/3 bg-white border border-slate-200 text-slate-800 font-bold font-mono rounded-xl px-3 py-2 text-sm outline-none cursor-not-allowed"
                  />
                </div>

                <label className="block text-xs font-bold text-slate-700 mb-2">Select Payment Methods</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  {['Cash', 'Card', 'UPI', 'Bank Transfer', 'Credit'].map((method) => (
                    <div
                      key={method}
                      className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-2 hover:border-emerald-300 transition-all"
                    >
                      <label className="flex items-center gap-2 cursor-pointer w-full select-none">
                        <input
                          type="checkbox"
                          checked={productDetailForm.payment_methods[method]}
                          onChange={() => handlePaymentCheckboxChange(method)}
                          className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-700">{method}</span>
                      </label>

                      {productDetailForm.payment_methods[method] && (
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={productDetailForm.payment_amounts[method]}
                          onChange={(e) => handlePaymentAmountChange(method, e.target.value)}
                          placeholder={`${method} (₹)`}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-emerald-500 font-mono font-bold animate-in fade-in"
                          autoFocus
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-emerald-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Amount Paid (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={productDetailForm.total_amount_paid}
                      readOnly
                      className="w-full bg-emerald-100 border border-emerald-300 text-emerald-900 font-black font-mono rounded-xl px-3 py-2 text-sm outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Balance to Pay (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productDetailForm.balance_amount}
                      readOnly
                      className="w-full bg-rose-50 border border-rose-200 text-rose-800 font-black font-mono rounded-xl px-3 py-2 text-sm outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* 4. GST & Tax */}
              <div className="bg-blue-50/30 p-5 rounded-xl border border-blue-100 space-y-3">
                <h4 className="text-sm font-bold text-slate-800 border-b border-blue-200 pb-2 flex items-center gap-2">
                  <i className="fas fa-file-invoice-dollar text-blue-500"></i>
                  <span>4. GST and Tax Information</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      GST Percentage (%) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={productDetailForm.gst_percent}
                      onChange={(e) => setProductDetailForm({ ...productDetailForm, gst_percent: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tax Inclusive</label>
                    <select
                      value={productDetailForm.tax_inclusive}
                      onChange={(e) => setProductDetailForm({ ...productDetailForm, tax_inclusive: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 5. Offers & Discounts */}
              <div className="bg-fuchsia-50/30 p-5 rounded-xl border border-fuchsia-100 space-y-3">
                <h4 className="text-sm font-bold text-slate-800 border-b border-fuchsia-200 pb-2 flex items-center gap-2">
                  <i className="fas fa-gift text-fuchsia-500"></i>
                  <span>5. Offers and Discounts</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Offer Available</label>
                    <select
                      value={productDetailForm.offer_available}
                      onChange={(e) => setProductDetailForm({ ...productDetailForm, offer_available: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-fuchsia-500"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  {productDetailForm.offer_available === 'Yes' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Offer Type</label>
                        <select
                          value={productDetailForm.offer_type}
                          onChange={(e) => setProductDetailForm({ ...productDetailForm, offer_type: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                        >
                          <option value="%">Percentage (%)</option>
                          <option value="₹">Fixed Amount (₹)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Offer Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={productDetailForm.offer_amount}
                          onChange={(e) => setProductDetailForm({ ...productDetailForm, offer_amount: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none font-mono"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 7. Additional Information */}
              <div className="bg-rose-50/30 p-5 rounded-xl border border-rose-100">
                <h4 className="text-sm font-bold text-slate-800 border-b border-rose-200 pb-2 mb-4 flex items-center gap-2">
                  <i className="fas fa-info-circle text-rose-500"></i>
                  <span>7. Additional Information</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Product Status</label>
                    <select
                      value={productDetailForm.status}
                      onChange={(e) => setProductDetailForm({ ...productDetailForm, status: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-rose-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-end gap-3 sticky bottom-0 z-20">
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="px-5 py-2.5 rounded-xl text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => openProductModal(productDetailForm.supplier_id)}
                className="px-5 py-2.5 rounded-xl text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Reset
              </button>
              <button
                type="submit"
                form="product-detail-modal-form"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-white bg-amber-600 hover:bg-amber-700 text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <i className="fas fa-save"></i>
                <span>{loading ? 'Saving...' : 'Save Product'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. FULL SUPPLIER MODAL (Exact match to C:\xampp\htdocs\billing\billingsoftwaregod) */}
      {/* ========================================================================= */}
      {showSupplierModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-6 py-10">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative animate-in fade-in zoom-in-95 mx-auto">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  {fullSupplierForm.id ? (
                    <>
                      <i className="fas fa-edit text-amber-500"></i> Edit Supplier
                    </>
                  ) : (
                    <>
                      <i className="fas fa-truck-loading text-indigo-600"></i> Add Supplier
                    </>
                  )}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleFullSupplierSubmit} className="p-6 space-y-8">
                {/* 1. Supplier Information */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center">
                    <i className="fas fa-user-tag text-indigo-500 mr-2"></i>1. Supplier Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Supplier Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullSupplierForm.supplier_name}
                        onChange={(e) => setFullSupplierForm({ ...fullSupplierForm, supplier_name: e.target.value })}
                        placeholder="Enter supplier name (e.g. Swamimalai Bronze Heritage Works)"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={fullSupplierForm.mobile_number}
                        onChange={(e) => setFullSupplierForm({ ...fullSupplierForm, mobile_number: e.target.value })}
                        placeholder="Enter mobile number (e.g. 9876543210)"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={fullSupplierForm.email}
                        onChange={(e) => setFullSupplierForm({ ...fullSupplierForm, email: e.target.value })}
                        placeholder="e.g. supplier@domain.com (Optional)"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Purchase Date</label>
                      <input
                        type="date"
                        value={fullSupplierForm.purchase_date}
                        onChange={(e) => setFullSupplierForm({ ...fullSupplierForm, purchase_date: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-900 font-mono"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={fullSupplierForm.address}
                        onChange={(e) => setFullSupplierForm({ ...fullSupplierForm, address: e.target.value })}
                        placeholder="Enter street address / workshop location"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        value={fullSupplierForm.city}
                        onChange={(e) => setFullSupplierForm({ ...fullSupplierForm, city: e.target.value })}
                        placeholder="e.g. Kumbakonam / Thanjavur / Madurai"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                      <input
                        type="text"
                        value={fullSupplierForm.state}
                        onChange={(e) => setFullSupplierForm({ ...fullSupplierForm, state: e.target.value })}
                        placeholder="e.g. Tamil Nadu"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">GST Number</label>
                      <input
                        type="text"
                        value={fullSupplierForm.gst_number}
                        onChange={(e) => setFullSupplierForm({ ...fullSupplierForm, gst_number: e.target.value.toUpperCase() })}
                        placeholder="e.g. 33AABCF9876K1Z2 (Optional)"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase transition-all font-mono text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Supplier Status</label>
                      <select
                        value={fullSupplierForm.status}
                        onChange={(e) => setFullSupplierForm({ ...fullSupplierForm, status: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-900 font-semibold"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Products Supplied */}
                <div className="bg-amber-50/30 p-5 rounded-xl border border-amber-200/80">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-4">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center">
                      <i className="fas fa-box-open text-amber-500 mr-2"></i>2. Products Supplied
                    </h4>
                    <button
                      type="button"
                      onClick={addSupplierProductRow}
                      className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <i className="fas fa-plus mr-1"></i> Add Another Product
                    </button>
                  </div>

                  {fullSupplierForm.products.length === 0 ? (
                    <div className="py-6 text-center text-slate-400 bg-white rounded-xl border border-dashed border-amber-200">
                      <p className="text-xs">No products currently attached. Click "Add Another Product" above if supplying new items.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {fullSupplierForm.products.map((pRow, idx) => (
                        <div
                          key={idx}
                          className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border border-amber-200 rounded-xl bg-white shadow-xs"
                        >
                          <button
                            type="button"
                            onClick={() => removeSupplierProductRow(idx)}
                            className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors shadow-sm cursor-pointer z-10"
                            title="Remove Product"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>

                          <div className="lg:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">Product Name</label>
                            <input
                              type="text"
                              value={pRow.name}
                              onChange={(e) => updateSupplierProductRow(idx, 'name', e.target.value)}
                              placeholder="e.g. Brass Ganesha Idol"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-amber-500 focus:bg-white text-slate-800 font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">Category</label>
                            <input
                              type="text"
                              value={pRow.category}
                              onChange={(e) => updateSupplierProductRow(idx, 'category', e.target.value)}
                              placeholder="e.g. Brass Idols"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-amber-500 focus:bg-white text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">Subcategory</label>
                            <input
                              type="text"
                              value={pRow.subcategory}
                              onChange={(e) => updateSupplierProductRow(idx, 'subcategory', e.target.value)}
                              placeholder="e.g. Ganesha"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-amber-500 focus:bg-white text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">Pieces Count</label>
                            <input
                              type="number"
                              min="0"
                              value={pRow.units}
                              onChange={(e) => updateSupplierProductRow(idx, 'units', e.target.value)}
                              placeholder="e.g. 10"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-amber-500 focus:bg-white text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">One Piece Rate (₹)</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={pRow.piece_rate}
                              onChange={(e) => updateSupplierProductRow(idx, 'piece_rate', e.target.value)}
                              placeholder="e.g. 1500"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold outline-none focus:border-amber-500 focus:bg-white text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">Total Purchase Price (₹)</label>
                            <input
                              type="number"
                              value={pRow.purchase_price}
                              readOnly
                              className="w-full bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-700 cursor-not-allowed"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">Margin % (Default 60%)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={pRow.margin_percentage}
                              onChange={(e) => updateSupplierProductRow(idx, 'margin_percentage', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-amber-500 focus:bg-white text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={pRow.selling_price}
                              onChange={(e) => updateSupplierProductRow(idx, 'selling_price', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-emerald-800 outline-none focus:border-amber-500 focus:bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">GST %</label>
                            <input
                              type="number"
                              value={pRow.gst}
                              onChange={(e) => updateSupplierProductRow(idx, 'gst', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-amber-500 focus:bg-white text-slate-800"
                            />
                          </div>

                          <div className="lg:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">Barcode</label>
                            <input
                              type="text"
                              value={pRow.barcode}
                              onChange={(e) => updateSupplierProductRow(idx, 'barcode', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-amber-500 focus:bg-white text-slate-800"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Payment Information */}
                <div className="bg-emerald-50/30 p-5 rounded-xl border border-emerald-200/80">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2 mb-4">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center">
                      <i className="fas fa-credit-card text-emerald-500 mr-2"></i>3. Payment Information
                    </h4>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        fullSupplierForm.payment_status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : fullSupplierForm.payment_status === 'Partially Paid'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      Status: {fullSupplierForm.payment_status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Amount Purchased (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={fullSupplierForm.total_amount_purchased}
                      onChange={(e) => onSupplierTotalPurchasedChange(e.target.value)}
                      placeholder="0.00"
                      className="w-full md:w-1/2 bg-white border border-slate-300 text-slate-900 font-bold rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                    />
                  </div>

                  <label className="block text-xs font-bold text-slate-700 mb-3">Select Payment Methods</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    {['Cash', 'Card', 'UPI', 'Bank Transfer', 'Credit'].map((method) => {
                      const isChecked = !!fullSupplierForm.payment_methods[method];
                      return (
                        <div
                          key={method}
                          className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-2 hover:border-emerald-300 transition-all"
                        >
                          <label className="flex items-center gap-2 cursor-pointer w-full">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSupplierPaymentMethod(method)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                            />
                            <span className="text-sm font-bold text-slate-700">{method}</span>
                          </label>
                          {isChecked && (
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={fullSupplierForm.payment_amounts[method] || ''}
                              onChange={(e) => onSupplierPaymentAmountChange(method, e.target.value)}
                              placeholder={`${method} (₹)`}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono font-bold text-slate-900"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t border-emerald-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Total Amount Paid (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={fullSupplierForm.total_amount_paid}
                        readOnly
                        className="w-full bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold rounded-xl px-3 py-2 text-sm outline-none font-mono cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Balance to Pay (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={fullSupplierForm.balance_amount}
                        readOnly
                        className="w-full bg-rose-50 border border-rose-200 text-rose-800 font-bold rounded-xl px-3 py-2 text-sm outline-none font-mono cursor-not-allowed"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Formula: Balance = Total Amount Purchased - Total Amount Paid
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-end gap-3 sticky bottom-0 z-10">
                  <button
                    type="button"
                    onClick={() => setShowSupplierModal(false)}
                    className="px-5 py-2.5 rounded-xl text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-sm font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <i className="fas fa-save"></i> Save Supplier
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. QUICK REGISTER SUPPLIER MODAL (Exact match to C:\xampp\htdocs\billing\billingsoftwaregod) */}
      {/* ========================================================================= */}
      {showQuickSupplierModal && (
        <div className="fixed inset-0 z-70 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
              <h3 className="text-sm font-extrabold text-indigo-950 flex items-center gap-2">
                <i className="fas fa-truck text-indigo-600"></i> Quick Register Supplier
              </h3>
              <button
                type="button"
                onClick={() => setShowQuickSupplierModal(false)}
                className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            <form onSubmit={handleQuickSupplierSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Supplier / Artisan Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={quickSupplierForm.name}
                  onChange={(e) => setQuickSupplierForm({ ...quickSupplierForm, name: e.target.value })}
                  placeholder="e.g. Swamimalai Bronze Works"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={quickSupplierForm.mobile}
                  onChange={(e) => setQuickSupplierForm({ ...quickSupplierForm, mobile: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City / Town</label>
                  <input
                    type="text"
                    value={quickSupplierForm.city}
                    onChange={(e) => setQuickSupplierForm({ ...quickSupplierForm, city: e.target.value })}
                    placeholder="Swamimalai"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GST Number (Optional)</label>
                  <input
                    type="text"
                    value={quickSupplierForm.gst_number}
                    onChange={(e) => setQuickSupplierForm({ ...quickSupplierForm, gst_number: e.target.value.toUpperCase() })}
                    placeholder="GSTIN (optional)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowQuickSupplierModal(false)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <i className="fas fa-check"></i> Save & Select Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW SUPPLIER PROFILE MODAL (Exact match to C:\xampp\htdocs\billing\billingsoftwaregod) */}
      {/* ========================================================================= */}
      {showViewSupplierModal && selectedSupplierForView && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-6 py-10">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative animate-in fade-in zoom-in-95 mx-auto">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <i className="fas fa-eye text-indigo-600"></i> View Supplier Details
                </h3>
                <button
                  type="button"
                  onClick={() => setShowViewSupplierModal(false)}
                  className="text-slate-400 hover:text-rose-500 p-2 rounded-xl transition-colors cursor-pointer"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Supplier Profile Info Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {selectedSupplierForView.supplier_code || 'SUP-001'}
                    </span>
                    <h2 className="text-lg font-extrabold text-slate-900 mt-1">{selectedSupplierForView.name}</h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {selectedSupplierForView.city || 'Tamil Nadu'}, {selectedSupplierForView.state || 'Tamil Nadu'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      (selectedSupplierForView.status || 'active').toLowerCase() === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {(selectedSupplierForView.status || 'Active').toUpperCase()}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Mobile Number</span>
                    <strong className="font-mono text-slate-800 text-sm">{selectedSupplierForView.mobile || '—'}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                    <strong className="text-slate-800 text-sm truncate block">{selectedSupplierForView.email || '—'}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">GST Number</span>
                    <strong className="font-mono text-slate-800 text-sm">{selectedSupplierForView.gstin || selectedSupplierForView.gst_number || 'Unregistered'}</strong>
                  </div>
                  <div className="sm:col-span-2 md:col-span-3 bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Workshop / Business Address</span>
                    <strong className="text-slate-800 text-xs block mt-0.5">{selectedSupplierForView.address || '—'}</strong>
                  </div>
                </div>

                {/* Financial KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 block">Total Purchased</span>
                    <span className="text-base font-black text-indigo-950 font-mono">
                      ₹{parseFloat(selectedSupplierForView.total_purchased || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Total Paid</span>
                    <span className="text-base font-black text-emerald-950 font-mono">
                      ₹{parseFloat(selectedSupplierForView.total_paid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                    <span className="text-[10px] uppercase font-bold text-rose-700 block">Outstanding Payable</span>
                    <span className="text-base font-black text-rose-950 font-mono">
                      ₹{parseFloat(selectedSupplierForView.outstanding_balance || selectedSupplierForView.balance_due || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Products Associated */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-700 mb-2 flex items-center justify-between">
                    <span>Products Supplied</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowViewSupplierModal(false);
                        openSupplierSheet(selectedSupplierForView);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <i className="fas fa-table text-[10px]"></i> Open Detailed Sheet
                    </button>
                  </h4>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="py-2 px-3">Product Name</th>
                          <th className="py-2 px-3">Stock</th>
                          <th className="py-2 px-3">Cost Rate</th>
                          <th className="py-2 px-3">Selling Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {products
                          .filter(
                            (p) => String(p.supplier_id) === String(selectedSupplierForView._id) || String(p.supplier_id) === String(selectedSupplierForView.legacyId) || p.supplier_name === selectedSupplierForView.name
                          )
                          .map((p) => (
                            <tr key={p._id || p.id} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-semibold text-slate-900">{p.name}</td>
                              <td className="py-2 px-3 font-mono">{p.current_stock || 0}</td>
                              <td className="py-2 px-3 font-mono">₹{p.piece_rate || p.purchase_price || 0}</td>
                              <td className="py-2 px-3 font-mono font-bold text-emerald-700">₹{p.selling_price || 0}</td>
                            </tr>
                          ))}
                        {products.filter(
                          (p) => String(p.supplier_id) === String(selectedSupplierForView._id) || String(p.supplier_id) === String(selectedSupplierForView.legacyId) || p.supplier_name === selectedSupplierForView.name
                        ).length === 0 && (
                          <tr>
                            <td colSpan="4" className="py-6 text-center text-slate-400">
                              No products found for this supplier.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowViewSupplierModal(false)}
                  className="px-5 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUPPLIER DETAILED PRODUCTS SHEET MODAL (Full Screen / Drag-to-scroll) */}
      {/* ========================================================================= */}
      {showSupplierSheetModal && selectedSupplierForSheet && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs overflow-hidden p-2 sm:p-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full h-[95vh] max-w-[98vw] shadow-2xl relative animate-in fade-in flex flex-col overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white shrink-0 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  <i className="fas fa-warehouse"></i>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">{selectedSupplierForSheet.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {selectedSupplierForSheet.supplier_code || 'SUP-001'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{selectedSupplierForSheet.mobile || '—'} • {selectedSupplierForSheet.city || 'Tamil Nadu'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <i className="fas fa-print"></i> Print
                </button>
                <button
                  type="button"
                  onClick={() => setShowSupplierSheetModal(false)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center cursor-pointer"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* Sheet Table */}
            <div className="overflow-auto flex-1 p-4">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-indigo-50 text-indigo-900 uppercase text-[10px] font-extrabold border-b border-indigo-200">
                  <tr>
                    <th className="py-3 px-4">Product Name & Barcode</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Piece Rate (₹)</th>
                    <th className="py-3 px-4">Selling Price (₹)</th>
                    <th className="py-3 px-4 text-center">Current Stock</th>
                    <th className="py-3 px-4 text-right">Total Invested (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products
                    .filter(
                      (p) =>
                        String(p.supplier_id) === String(selectedSupplierForSheet.legacyId) ||
                        String(p.supplier_id) === String(selectedSupplierForSheet._id) ||
                        p.supplier_name === selectedSupplierForSheet.name
                    )
                    .map((p) => (
                      <tr key={p._id || p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <strong className="text-slate-900 block font-bold">{p.name}</strong>
                          <span className="font-mono text-[10px] text-slate-400">{p.sku || p.barcode}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {p.category_name || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">₹{parseFloat(p.piece_rate || p.purchase_price || 0).toFixed(2)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">₹{parseFloat(p.selling_price || 0).toFixed(2)}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold">{p.current_stock || 0}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-indigo-900">
                          ₹{((parseFloat(p.piece_rate || p.purchase_price) || 0) * (p.current_stock || 0)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
