import React, { useRef, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef(null);

  // Reset scroll position and close mobile sidebar on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
      if (typeof mainRef.current.scrollTo === 'function') {
        mainRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname, location.search]);

  const isPos = location.pathname === '/pos' || location.pathname === '/billing';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex flex-1 w-full relative">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        {/* Placeholder to reserve space for desktop fixed sidebar */}
        <div className="hidden lg:block w-64 shrink-0" aria-hidden="true" />
        <main
          ref={mainRef}
          id="main-content-scroll"
          className={`flex-1 min-w-0 ${
            isPos
              ? 'p-2 sm:p-3 overflow-y-auto lg:overflow-hidden'
              : 'p-4 sm:p-6'
          } bg-slate-50`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
