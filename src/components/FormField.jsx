// Campo de formulario Bootstrap con etiqueta, mensaje de error y contador opcional.
export default function FormField({ label, form, name, as = 'input', type = 'text', hint, max, children, required, ...rest }) {
  const props = form.fieldProps(name);
  const error = form.touched[name] && form.errors[name];
  const Tag = as;
  if (as === 'select') props.className = props.className.replace('form-control', 'form-select');
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label} {required && <span className="text-accent" aria-hidden="true">*</span>}
      </label>
      {as === 'input' ? (
        <input type={type} {...props} maxLength={max} required={required} {...rest} />
      ) : (
        <Tag {...props} maxLength={max} required={required} {...rest}>{children}</Tag>
      )}
      <div className="d-flex justify-content-between">
        {error ? (
          <div id={`${name}-error`} className="invalid-feedback d-block">{error}</div>
        ) : (
          <div className="form-text">{hint}</div>
        )}
        {max && <div className="form-text ms-2 text-nowrap">{(form.values[name] || '').length}/{max}</div>}
      </div>
    </div>
  );
}
