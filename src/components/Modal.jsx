import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Modal controlado por React con estilos de Bootstrap y animación GSAP.
export default function Modal({ show, title, onClose, children, footer, size = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!show) return;
    gsap.fromTo(ref.current, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out' });
    const esc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.classList.remove('modal-open');
    };
  }, [show, onClose]);
  if (!show) return null;
  return (
    <>
      <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="pf-modal-title" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${size}`}>
          <div className="modal-content pf-card" ref={ref}>
            <div className="modal-header border-0">
              <h2 className="modal-title h5" id="pf-modal-title">{title}</h2>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer border-0">{footer}</div>}
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}

export function ConfirmModal({ show, title = '¿Estás seguro?', message, confirmLabel = 'Eliminar', onConfirm, onClose, busy }) {
  return (
    <Modal show={show} title={title} onClose={onClose} footer={
      <>
        <button className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
          {busy && <span className="spinner-border spinner-border-sm me-2" />}{confirmLabel}
        </button>
      </>
    }>
      <p className="mb-0">{message}</p>
    </Modal>
  );
}
