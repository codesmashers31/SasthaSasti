import React, { useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const location = useLocation();
  const mainRef = useRef(null);

  // Reset scroll position on route navigation
  useEffect(() => {
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
      <Navbar />
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)]">
        <Sidebar />
        <main
          ref={mainRef}
          id="main-content-scroll"
          className={`flex-1 ${
            isPos
              ? 'p-2 sm:p-3 overflow-y-auto lg:overflow-hidden h-full'
              : 'overflow-y-auto p-4 sm:p-6'
          } bg-slate-50`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
