import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  // If we already have token and cached user, render instantly (0ms delay)
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('user');
    return !(token && saved);
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Revalidate in background without blocking initial UI render
      api.get('/auth/me')
        .then((res) => {
          if (res?.success && res?.user) {
            setUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        })
        .catch((err) => {
          const status = err?.status || err?.response?.status;
          if (status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const hasPermission = (perm) => {
    if (!user) return false;
    if (user.role_slug === 'super-admin') return true;
    if (user.permissions?.includes('*')) return true;
    return user.permissions?.includes(perm);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
