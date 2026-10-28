import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-xl relative overflow-hidden">
          {/* Top Emblem */}
          <div className="text-center mb-7">
            <div className="w-20 h-20 rounded-2xl bg-transparent flex items-center justify-center mx-auto mb-3.5 overflow-hidden">
              <img
                src="/images/logo.png"
                alt="Sastha Sasti"
                className="w-full h-full object-contain scale-125 transform drop-shadow-sm mix-blend-multiply"
              />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Sastha Sasti Enterprise / Divya Murti
            </h2>
            <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider mt-0.5">
              Enterprise God Statue Management ERP
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <i className="fas fa-exclamation-circle text-rose-500"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username or Staff Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                  <i className="fas fa-user-shield"></i>
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                  <i className="fas fa-key"></i>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
            >
              <i className="fas fa-sign-in-alt"></i>
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>
          </form>

          {/* Quick Demo Logins Helper */}
          <div className="mt-6 pt-5 border-t border-slate-200 text-center">
            <p className="text-[11px] font-bold text-slate-500 mb-2.5">
              Click a Role to Quick-Fill (Password:{' '}
              <code className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
                admin123
              </code>
              )
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setUsername('superadmin');
                  setPassword('admin123');
                }}
                className="py-2 px-1 rounded-xl bg-slate-100 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 border border-slate-200 text-slate-700 font-semibold transition-all cursor-pointer"
              >
                superadmin
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername('priya');
                  setPassword('admin123');
                }}
                className="py-2 px-1 rounded-xl bg-slate-100 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 border border-slate-200 text-slate-700 font-semibold transition-all cursor-pointer"
              >
                priya (Billing)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
