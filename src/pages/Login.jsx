import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useForm } from '../hooks/useForm';
import { rules } from '../utils/validators';
import FormField from '../components/FormField';
import GoogleButton from '../components/GoogleButton';
import AuthLayout, { AuthAside } from './AuthLayout';

export default function Login() {
  const notify = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const f = useForm({ email: '', password: '' }, {
    email: [rules.required(), rules.email()],
    password: [rules.required(), rules.minLength(8)],
  });


  const submit = async (e) => {
    e.preventDefault();
    if (!f.validateAll()) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700)); // Simulación visual.
    setBusy(false);
    notify('¡Bienvenido/a de nuevo!');
    navigate(f.values.email.startsWith('admin') ? '/admin' : '/proyectos');
  };

  return (
    <AuthLayout title="Iniciar sesión" subtitle="Ingresá para ver los proyectos y demos." aside={<AuthAside />}>
      <form onSubmit={submit} noValidate>
        <FormField label="Email" type="email" form={f} name="email" required autoComplete="email" />
        <div className="position-relative">
          <FormField label="Contraseña" type={show ? 'text' : 'password'} form={f} name="password" required autoComplete="current-password" />
          <button type="button" className="btn btn-sm pf-eye" onClick={() => setShow((s) => !s)} aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
            <i className={`bi bi-eye${show ? '-slash' : ''}`} />
          </button>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-4 small">
          <div className="form-check"><input className="form-check-input" type="checkbox" id="remember" /><label className="form-check-label" htmlFor="remember">Recordarme</label></div>
          <button type="button" className="btn btn-link btn-sm p-0">¿Olvidaste tu contraseña?</button>
        </div>
        <button className="btn btn-primary w-100 rounded-pill btn-lg" disabled={busy}>
          {busy && <span className="spinner-border spinner-border-sm me-2" />}Ingresar
        </button>
      </form>
      <div className="pf-divider my-4"><span>o</span></div>
      <GoogleButton />
      <p className="text-center mt-4 mb-0 small">¿No tenés cuenta? <Link to="/registro">Registrate</Link></p>
    </AuthLayout>
  );
}
