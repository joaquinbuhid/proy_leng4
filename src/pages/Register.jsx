import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useForm } from '../hooks/useForm';
import { rules, passwordStrength } from '../utils/validators';
import FormField from '../components/FormField';
import GoogleButton from '../components/GoogleButton';
import AuthLayout, { AuthAside } from './AuthLayout';

export default function Register() {
  const notify = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const f = useForm({ name: '', email: '', password: '', confirm: '', terms: false }, {
    name: [rules.required(), rules.name()],
    email: [rules.required(), rules.email(), rules.maxLength(100)],
    password: [rules.required(), rules.password()],
    confirm: [rules.required('Repetí la contraseña.'), rules.matches('password', 'Las contraseñas no coinciden.')],
    terms: [rules.accepted('Debés aceptar los términos de uso.')],
  });
  const strength = passwordStrength(f.values.password);


  const submit = async (e) => {
    e.preventDefault();
    if (!f.validateAll()) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700)); // Simulación visual.
    setBusy(false);
    notify(`¡Cuenta creada! Hola, ${f.values.name.split(' ')[0]}.`);
    navigate('/proyectos');
  };

  return (
    <AuthLayout title="Crear cuenta" subtitle="Registrate gratis para acceder a los proyectos y demos." aside={<AuthAside />}>
      <GoogleButton />
      <div className="pf-divider my-4"><span>o con tu email</span></div>
      <form onSubmit={submit} noValidate>
        <FormField label="Nombre y apellido" form={f} name="name" required autoComplete="name" max={60} />
        <FormField label="Email" type="email" form={f} name="email" required autoComplete="email" max={100} />
        <FormField label="Contraseña" type="password" form={f} name="password" required autoComplete="new-password" hint="Mín. 8 caracteres con mayúscula, minúscula, número y símbolo." />
        {f.values.password && (
          <div className="mb-3 mt-n2" aria-live="polite">
            <div className="progress" style={{ height: 6 }}>
              <div className={`progress-bar bg-${strength.color}`} style={{ width: `${(strength.score / 5) * 100}%`, transition: 'width .4s' }} />
            </div>
            <div className="small mt-1">Seguridad: <strong>{strength.label}</strong></div>
          </div>
        )}
        <FormField label="Repetir contraseña" type="password" form={f} name="confirm" required autoComplete="new-password" />
        <div className="form-check mb-4">
          <input className={`form-check-input ${f.touched.terms ? (f.errors.terms ? 'is-invalid' : 'is-valid') : ''}`} type="checkbox" id="terms" name="terms" checked={f.values.terms} onChange={f.handleChange} onBlur={f.handleBlur} />
          <label className="form-check-label small" htmlFor="terms">Acepto los términos de uso y la política de privacidad.</label>
          {f.touched.terms && f.errors.terms && <div className="invalid-feedback d-block">{f.errors.terms}</div>}
        </div>
        <button className="btn btn-primary w-100 rounded-pill btn-lg" disabled={busy}>
          {busy && <span className="spinner-border spinner-border-sm me-2" />}Crear cuenta
        </button>
      </form>
      <p className="text-center mt-4 mb-0 small">¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link></p>
    </AuthLayout>
  );
}
