import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Campo from '../components/Campo';
import { rutaDeVuelta } from './Register';

export default function Login() {
  const { usuario, ingresar } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const volver = rutaDeVuelta(params);
  const [datos, setDatos] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario && !enviando) return <Navigate to={volver} replace />;

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    setError('');
  };

  const enviar = async (e) => {
    e.preventDefault();
    if (!datos.email.trim() || !datos.password) return setError('Completá tu email y contraseña.');
    setEnviando(true);
    try {
      await ingresar(datos);
      navigate(volver, { replace: true });
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <section className="py-5 col-md-8 col-lg-5">
      <h1 className="h2 mb-4">Ingresar</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={enviar} noValidate>
        <Campo id="email" label="Email" type="email" valor={datos.email} onChange={cambiar} autoComplete="email" />
        <Campo id="password" label="Contraseña" type="password" valor={datos.password} onChange={cambiar} autoComplete="current-password" />
        <button type="submit" className="btn btn-primary w-100" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
      <p className="small text-secondary mt-3">
        ¿No tenés cuenta? <Link to={`/registro?volver=${encodeURIComponent(volver)}`}>Registrate</Link>
      </p>
    </section>
  );
}
