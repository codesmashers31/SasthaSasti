import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function BarcodeSettings() {
  const [prefix, setPrefix] = useState('SS');
  const [separator, setSeparator] = useState('-');
  const [numberLength, setNumberLength] = useState(4);
  const [stickerSize, setStickerSize] = useState('50x25');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/barcode/settings');
      if (res && res.data) {
        if (res.data.prefix) setPrefix(res.data.prefix);
        if (res.data.separator !== undefined) setSeparator(res.data.separator);
        if (res.data.numberLength) setNumberLength(res.data.numberLength);
      }
    } catch {}
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/barcode/settings', {
        barcode_prefix: prefix,
        barcode_separator: separator,
        barcode_number_length: numberLength,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 select-none">
      {/* Top Breadcrumbs & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/" className="hover:text-amber-600 transition-colors">Dashboard</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-amber-600 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-slate-600 font-semibold">Barcode Customization</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 text-lg">
              <i className="fas fa-barcode"></i>
            </span>
            <span>Barcode Customization & Generator</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure your product barcode prefix (e.g. <strong className="text-amber-700">SS</strong>), 4-digit random number length, and POS scanner compatibility.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <i className="fas fa-boxes text-slate-400"></i>
            <span>View Products</span>
          </Link>
          <Link
            to="/pos"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <i className="fas fa-cash-register text-amber-400"></i>
            <span>Open POS Billing</span>
          </Link>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3">
          <i className="fas fa-check-circle text-emerald-600 text-base"></i>
          <span>Barcode rules and generation format saved successfully!</span>
        </div>
      )}

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Settings Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                <i className="fas fa-sliders-h"></i>
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Barcode Generation Rules</h2>
                <p className="text-[11px] text-slate-400">Customize starting word, digit count, and formatting</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Format: {prefix}{separator}{'X'.repeat(numberLength)}</span>
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* 1. Barcode Prefix */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Barcode Prefix / Starting Word <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">e.g., SS, DIVYA, BAR</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                  <i className="fas fa-font"></i>
                </div>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-24 py-2.5 text-sm font-bold text-slate-900 uppercase tracking-wider focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                />
                <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPrefix('SS')}
                    className="px-2 py-1 text-[10px] font-extrabold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors cursor-pointer"
                  >
                    SS
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrefix('DIVYA')}
                    className="px-2 py-1 text-[10px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    DIVYA
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrefix('BAR')}
                    className="px-2 py-1 text-[10px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    BAR
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Separator */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Separator Character</label>
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { val: '-', label: 'Hyphen (-)' },
                  { val: '_', label: 'Underscore (_)' },
                  { val: '/', label: 'Slash (/)' },
                  { val: '', label: 'None' },
                ].map((s) => (
                  <label
                    key={s.val}
                    className={`cursor-pointer border rounded-xl p-2.5 flex items-center gap-2 transition-all text-xs ${
                      separator === s.val
                        ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500 text-amber-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sep"
                      value={s.val}
                      checked={separator === s.val}
                      onChange={() => setSeparator(s.val)}
                      className="hidden"
                    />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Number Length */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Random Number Digits (3 to 8)
              </label>
              <input
                type="number"
                min="3"
                max="8"
                value={numberLength}
                onChange={(e) => setNumberLength(parseInt(e.target.value) || 4)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none"
              />
            </div>

            {/* 4. Label Sticker Size */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Print Sticker Format</label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-1 ${
                    stickerSize === '50x25' ? 'border-amber-600 bg-amber-50' : 'border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="stsize"
                    value="50x25"
                    checked={stickerSize === '50x25'}
                    onChange={() => setStickerSize('50x25')}
                    className="hidden"
                  />
                  <span className="font-bold text-xs">50mm × 25mm</span>
                  <span className="text-[10px] text-slate-400">Jewelry / God Statue Hangtag</span>
                </label>

                <label
                  className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-1 ${
                    stickerSize === '38x25' ? 'border-amber-600 bg-amber-50' : 'border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="stsize"
                    value="38x25"
                    checked={stickerSize === '38x25'}
                    onChange={() => setStickerSize('38x25')}
                    className="hidden"
                  />
                  <span className="font-bold text-xs">38mm × 25mm</span>
                  <span className="text-[10px] text-slate-400">Compact Barcode Sticker</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save Barcode Configuration'}
            </button>
          </form>
        </div>

        {/* Right Column: Live Printable Label Preview */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Physical Label Preview
          </span>

          <div className="inline-block p-4 bg-white border-2 border-dashed border-amber-300 rounded-2xl shadow-sm text-center w-64 space-y-1">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              SASTHA SASTI ENTERPRISE
            </h5>
            <h4 className="text-xs font-black text-slate-900">Brass Murugan Idol 12"</h4>

            {/* Barcode Lines Graphic */}
            <div className="py-2 flex items-center justify-center">
              <div className="h-10 flex items-center gap-[2px]">
                {[5, 3, 5, 2, 4, 3, 5, 2, 4, 2, 5, 3, 2, 5, 4, 2, 3, 5, 2, 4].map((h, i) => (
                  <div
                    key={i}
                    className="bg-slate-950"
                    style={{ width: `${(i % 3) + 1}px`, height: `${h * 7}px` }}
                  ></div>
                ))}
              </div>
            </div>

            <p className="font-mono font-bold text-xs text-slate-900 tracking-wider">
              {prefix}{separator}4821
            </p>
            <p className="text-[11px] font-black font-mono text-amber-800">MRP: ₹2,800.00</p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-print text-amber-400"></i> Print Barcode Labels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
