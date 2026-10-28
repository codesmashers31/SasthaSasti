import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Settings as SettingsIcon, ShieldCheck, Save, Clock } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company'); // 'company' or 'audit'
  const [settings, setSettings] = useState({
    company_name: 'Divya Murti - Sacred God Statue Enterprise',
    company_gstin: '33AAAAA0000A1Z5',
    company_phone: '+91 98401 12233',
    company_address: 'No. 108, Sannathi Street, Madurai, Tamil Nadu - 625001',
    default_gst_percent: '12',
    invoice_prefix: 'DIVYA',
    printer_type: 'thermal_80mm',
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
    if (activeTab === 'audit') fetchAuditLogs();
  }, [activeTab]);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.success && res.settings) {
        setSettings((prev) => ({ ...prev, ...res.settings }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/audit?limit=50');
      if (res.success) setAuditLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.post('/settings', settings);
      alert('Enterprise settings saved successfully');
    } catch (err) {
      alert(err.message || 'Save failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Enterprise Settings & System Audit</h2>
          <p className="text-xs text-slate-500">Store profile, tax defaults, thermal printers, and forensic activity logs</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('company')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'company' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Store Configuration
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'audit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Forensic Audit Trail
          </button>
        </div>
      </div>

      {activeTab === 'company' ? (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 max-w-2xl space-y-4 text-xs">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">Company & GST Profile</h3>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Company / Enterprise Name</label>
            <input
              type="text"
              value={settings.company_name}
              onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">GSTIN Number</label>
              <input
                type="text"
                value={settings.company_gstin}
                onChange={(e) => setSettings({ ...settings, company_gstin: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Store Helpline Phone</label>
              <input
                type="text"
                value={settings.company_phone}
                onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Store Address (Printed on Invoices)</label>
            <textarea
              rows="2"
              value={settings.company_address}
              onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            ></textarea>
          </div>

          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 pt-4">POS Billing Defaults</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Default GST Rate (%)</label>
              <select
                value={settings.default_gst_percent}
                onChange={(e) => setSettings({ ...settings, default_gst_percent: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              >
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12% (Standard)</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Receipt Printer Format</label>
              <select
                value={settings.printer_type}
                onChange={(e) => setSettings({ ...settings, printer_type: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              >
                <option value="thermal_80mm">Thermal 80mm Standard (POS)</option>
                <option value="thermal_58mm">Thermal 58mm Compact</option>
                <option value="a4_laser">A4 Laser GST Tax Invoice</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-amber-600/20 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      ) : (
        /* Forensic Audit Trail View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Staff User</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">Loading audit trail...</td>
                </tr>
              ) : auditLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">No activity logs recorded.</td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 text-slate-500">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{log.user_name || 'System'}</td>
                    <td className="py-3.5 px-4 uppercase text-[10px] font-bold text-slate-600">{log.module}</td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-sm truncate">{log.description}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-400">{log.ip_address || '127.0.0.1'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
