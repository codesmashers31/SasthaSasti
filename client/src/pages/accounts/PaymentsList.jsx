import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export default function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [voucherType, setVoucherType] = useState('received'); // 'received' or 'paid'
  const [selectedPartyId, setSelectedPartyId] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [payRes, accRes, custRes, supRes] = await Promise.all([
        api.get('/payments'),
        api.get('/accounts'),
        api.get('/customers'),
        api.get('/suppliers'),
      ]);
      if (payRes && payRes.data) setPayments(payRes.data);
      if (accRes && accRes.data) {
        setAccounts(accRes.data);
        if (accRes.data.length > 0 && !selectedAccountId) {
          setSelectedAccountId(accRes.data[0]._id || accRes.data[0].id);
        }
      }
      if (custRes && custRes.data) setCustomers(custRes.data);
      if (supRes && supRes.data) setSuppliers(supRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openVoucherModal = (type) => {
    setVoucherType(type);
    setSelectedPartyId('');
    setAmount('');
    setNotes('');
    setShowModal(true);
  };

  const handleSaveVoucher = async (e) => {
    e.preventDefault();
    try {
      let partyName = 'Direct';
      if (voucherType === 'received') {
        const c = customers.find((cust) => String(cust._id || cust.id || cust.legacyId) === String(selectedPartyId));
        if (c) partyName = c.name;
      } else {
        const s = suppliers.find((sup) => String(sup._id || sup.id || sup.legacyId) === String(selectedPartyId));
        if (s) partyName = s.name;
      }

      const payload = {
        payment_type: voucherType,
        party_name: partyName,
        account_id: selectedAccountId,
        amount: parseFloat(amount) || 0,
        payment_method: paymentMethod,
        payment_date: paymentDate,
        notes,
      };

      await api.post('/payments', payload);
      alert('Payment voucher saved successfully!');
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to record voucher');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Payment Receipts & Supplier Disbursements
          </h1>
          <p className="text-xs text-slate-500">
            Collect customer ledger dues, pay sthapathi foundry invoices, and record direct vouchers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openVoucherModal('received')}
            className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <i className="fas fa-hand-holding-usd"></i> Receive Customer Payment
          </button>
          <button
            type="button"
            onClick={() => openVoucherModal('paid')}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <i className="fas fa-paper-plane"></i> Pay Supplier / Sthapathi
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold text-slate-700">Payment No</th>
                <th className="py-3.5 px-4 font-bold text-slate-700">Date</th>
                <th className="py-3.5 px-4 font-bold text-slate-700">Type</th>
                <th className="py-3.5 px-4 font-bold text-slate-700">Party</th>
                <th className="py-3.5 px-4 font-bold text-slate-700">Account</th>
                <th className="py-3.5 px-4 font-bold text-slate-700">Amount</th>
                <th className="py-3.5 px-4 font-bold text-slate-700">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-sans">
                    <i className="fas fa-spinner fa-spin text-2xl text-amber-600 mb-2"></i>
                    <p className="text-xs">Loading payment transactions...</p>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-sans">
                    <i className="fas fa-receipt text-3xl mb-2 text-slate-300 block"></i>
                    <p className="font-bold text-slate-600 text-sm">No payment records found.</p>
                  </td>
                </tr>
              ) : (
                payments.map((pay) => (
                  <tr key={pay._id || pay.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{pay.payment_no}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-sans">
                      {new Date(pay.payment_date || pay.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          pay.payment_type === 'received'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {pay.payment_type === 'received' ? 'Receipt (+)' : 'Payment (-)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                      {pay.party_name || 'Direct'}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-700">
                      {pay.account_name || 'Cash Account'}
                    </td>
                    <td
                      className={`py-3.5 px-4 font-black text-sm ${
                        pay.payment_type === 'received' ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      ₹{parseFloat(pay.amount || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[10px] font-bold text-slate-500 font-sans">
                      {pay.payment_method || 'cash'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Voucher Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {voucherType === 'received' ? 'Receive Customer Payment' : 'Pay Supplier / Sthapathi'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSaveVoucher} className="space-y-3.5 text-xs">
              {voucherType === 'received' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Customer</label>
                  <select
                    value={selectedPartyId}
                    onChange={(e) => setSelectedPartyId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none cursor-pointer"
                  >
                    <option value="">Choose Customer...</option>
                    {customers.map((c) => (
                      <option key={c._id || c.id} value={c.legacyId || c.id || c._id}>
                        {c.name} {c.mobile ? `(${c.mobile})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Supplier / Sthapathi</label>
                  <select
                    value={selectedPartyId}
                    onChange={(e) => setSelectedPartyId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none cursor-pointer"
                  >
                    <option value="">Choose Supplier...</option>
                    {suppliers.map((s) => (
                      <option key={s._id || s.id} value={s.legacyId || s.id || s._id}>
                        {s.name} {s.city ? `(${s.city})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Account</label>
                <select
                  required
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-amber-500 outline-none cursor-pointer"
                >
                  {accounts.map((acc) => (
                    <option key={acc._id || acc.id} value={acc.legacyId || acc.id || acc._id}>
                      {acc.name} (Bal: ₹{parseFloat(acc.current_balance || 0).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI / QR</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Narration</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cleared bill INV-0012, festival advance..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
