import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Wallet, Building, ArrowUpRight, ArrowDownLeft, Eye, CreditCard } from 'lucide-react';

export default function AccountsList() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/accounts');
      if (res.success) setAccounts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openLedger = async (acc) => {
    setSelectedAccount(acc);
    try {
      setLedgerLoading(true);
      const res = await api.get(`/accounts/${acc._id}/ledger`);
      if (res.success) setLedger(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLedgerLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Financial Accounts & Cash Book Registers</h2>
        <p className="text-xs text-slate-500">Showroom cash drawers, primary bank current accounts, and ledger reconciliations</p>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {accounts.map((acc) => (
          <div key={acc._id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-amber-700">{acc.account_code}</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                  {acc.type}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-base">{acc.name}</h3>
              {acc.bank_name && (
                <p className="text-xs text-slate-500 mt-1">
                  {acc.bank_name} • A/C: {acc.account_number ? `••••${acc.account_number.slice(-4)}` : 'Main'}
                </p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Current Balance</p>
                <h4 className="text-2xl font-black text-slate-900 mt-0.5">
                  ₹{Number(acc.current_balance || 0).toLocaleString('en-IN')}
                </h4>
              </div>

              <button
                onClick={() => openLedger(acc)}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Ledger</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ledger Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Account Ledger Transactions</h3>
                <p className="text-xs text-amber-100">{selectedAccount.name} ({selectedAccount.account_code})</p>
              </div>
              <button
                onClick={() => setSelectedAccount(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between text-xs mb-4">
                <span>Account Current Balance:</span>
                <span className="font-bold text-slate-900 text-sm">₹{Number(selectedAccount.current_balance || 0).toLocaleString('en-IN')}</span>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5 text-right">Amount</th>
                    <th className="p-2.5 text-right">Balance After</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ledgerLoading ? (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-slate-400">Loading ledger...</td>
                    </tr>
                  ) : ledger.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-slate-400">No transactions recorded for this account.</td>
                    </tr>
                  ) : (
                    ledger.map((tx) => (
                      <tr key={tx._id} className="hover:bg-slate-50 transition">
                        <td className="p-2.5 text-slate-500">{tx.transaction_date}</td>
                        <td className="p-2.5 font-medium text-slate-800">{tx.description}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            tx.transaction_type === 'debit'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {tx.transaction_type}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-bold text-slate-900">
                          {tx.transaction_type === 'debit' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="p-2.5 text-right font-mono font-semibold text-slate-700">
                          ₹{Number(tx.balance_after).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
