import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type = 'success', message = '', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, message };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  // Expose globally to window.showToast for direct compatibility with scripts/legacy patterns
  useEffect(() => {
    window.showToast = showToast;
    return () => {
      delete window.showToast;
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Floating Toast Container (Bottom-Right matching C:\xampp\htdocs\billing\billingsoftwaregod) */}
      <div
        id="toast-container"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none px-3 sm:px-0"
        role="region"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          let bgClass = 'bg-white border-slate-200 text-slate-800 shadow-xl';
          let iconClass = 'fas fa-info-circle text-indigo-500';
          let accentBorder = 'border-l-4 border-l-indigo-500';

          if (toast.type === 'success') {
            bgClass = 'bg-emerald-50/95 border-emerald-200 text-emerald-950 shadow-emerald-500/10 shadow-lg';
            iconClass = 'fas fa-check-circle text-emerald-600';
            accentBorder = 'border-l-4 border-l-emerald-500';
          } else if (toast.type === 'error' || toast.type === 'danger') {
            bgClass = 'bg-rose-50/95 border-rose-200 text-rose-950 shadow-rose-500/10 shadow-lg';
            iconClass = 'fas fa-exclamation-circle text-rose-600';
            accentBorder = 'border-l-4 border-l-rose-500';
          } else if (toast.type === 'warning') {
            bgClass = 'bg-amber-50/95 border-amber-200 text-amber-950 shadow-amber-500/10 shadow-lg';
            iconClass = 'fas fa-exclamation-triangle text-amber-600';
            accentBorder = 'border-l-4 border-l-amber-500';
          } else if (toast.type === 'info') {
            bgClass = 'bg-indigo-50/95 border-indigo-200 text-indigo-950 shadow-indigo-500/10 shadow-lg';
            iconClass = 'fas fa-info-circle text-indigo-600';
            accentBorder = 'border-l-4 border-l-indigo-500';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-xl p-3.5 border ${bgClass} ${accentBorder} flex items-center justify-between gap-3 transform transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-3 backdrop-blur-md`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <i className={`${iconClass} text-lg shrink-0`}></i>
                <div className="text-xs font-bold leading-snug break-words">
                  {toast.message}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors shrink-0 cursor-pointer"
                aria-label="Close notification"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if invoked outside ToastProvider
    return {
      showToast: (type, msg) => {
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast(type, msg);
        } else {
          console.log(`[Toast ${type}]: ${msg}`);
        }
      },
      removeToast: () => {},
    };
  }
  return context;
};

export default ToastContext;
