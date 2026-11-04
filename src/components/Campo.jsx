// Campo de formulario con etiqueta, ayuda y mensaje de error (Bootstrap).
export default function Campo({ id, label, valor, error, ayuda, onChange, type = 'text', as, children, ...resto }) {
  const clase = `${as === 'select' ? 'form-select' : 'form-control'}${error ? ' is-invalid' : ''}`;
  const props = { id, name: id, className: clase, value: valor, onChange, 'aria-invalid': !!error, ...resto };

  let control;
  if (as === 'select') control = <select {...props}>{children}</select>;
  else if (as === 'textarea') control = <textarea {...props} />;
  else control = <input type={type} {...props} />;

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      {control}
      {ayuda && !error && <div className="form-text">{ayuda}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
