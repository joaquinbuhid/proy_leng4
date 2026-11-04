import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);
const ICONS = { success: 'check-circle-fill', danger: 'x-octagon-fill', info: 'info-circle-fill', warning: 'exclamation-triangle-fill' };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const notify = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 2000 }} aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast show pf-toast pf-toast-${t.type}`} role="status">
            <div className="toast-body d-flex align-items-center gap-2">
              <i className={`bi bi-${ICONS[t.type]}`} />
              <span className="flex-grow-1">{t.message}</span>
              <button type="button" className="btn-close btn-close-white" aria-label="Cerrar" onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
