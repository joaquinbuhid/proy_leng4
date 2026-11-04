import { useState } from 'react';
import { validate } from '../utils/validators';

// Manejo de formularios con validación en vivo (al salir del campo y al escribir tras el primer error).
// `schemaArg` puede ser un objeto o una función (values) => schema para reglas condicionales.
export function useForm(initialValues, schemaArg) {
  const [values, setValues] = useState(initialValues);
  const schema = typeof schemaArg === 'function' ? schemaArg(values) : schemaArg;
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const runField = (name, next) => {
    const sc = typeof schemaArg === 'function' ? schemaArg(next) : schemaArg;
    if (!sc[name]) return;
    const e = validate(next, { [name]: sc[name] });
    setErrors((prev) => ({ ...prev, [name]: e[name] }));
  };

  const setValue = (name, value) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) runField(name, next);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setValue(name, type === 'checkbox' ? checked : value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    runField(name, values);
  };

  const validateAll = () => {
    const e = validate(values, schema);
    setErrors(e);
    setTouched(Object.fromEntries(Object.keys(schema).map((k) => [k, true])));
    return Object.keys(e).length === 0;
  };

  const reset = (v = initialValues) => {
    setValues(v);
    setErrors({});
    setTouched({});
  };

  const fieldProps = (name) => ({
    name, id: name, value: values[name] ?? '', onChange: handleChange, onBlur: handleBlur,
    'aria-invalid': Boolean(touched[name] && errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    className: `form-control ${touched[name] ? (errors[name] ? 'is-invalid' : 'is-valid') : ''}`,
  });

  return { values, errors, touched, setValue, setValues, handleChange, handleBlur, validateAll, reset, fieldProps };
}
