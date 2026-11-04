import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Campo from '../components/Campo';

// Solo se permite volver a rutas internas del sitio.
export function rutaDeVuelta(params) {
  const v = params.get('volver') || '';
  return v.startsWith('/') && !v.startsWith('//') ? v : '/proyectos';
}

function validar({ nombre, email, password, repetir }) {
  const e = {};
  if (nombre.trim().length < 2) e.nombre = 'Ingresá tu nombre.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Ingresá un email válido.';
  if (password.length < 8) e.password = 'La contraseña debe tener al menos 8 caracteres.';
  if (repetir !== password) e.repetir = 'Las contraseñas no coinciden.';
  return e;
}

export default function Register() {
  const { usuario, registrar } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const volver = rutaDeVuelta(params);
  const [datos, setDatos] = useState({ nombre: '', email: '', password: '', repetir: '' });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario && !enviando) return <Navigate to={volver} replace />;

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: undefined });
  };

  const enviar = async (e) => {
    e.preventDefault();
    const nuevos = validar(datos);
    setErrores(nuevos);
    setError('');
    if (Object.keys(nuevos).length) return;
    setEnviando(true);
    try {
      await registrar({ nombre: datos.nombre, email: datos.email, password: datos.password });
      navigate(volver, { replace: true });
    } catch (err) {
      setErrores(err.datos?.errores || {});
      if (!err.datos?.errores) setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <section className="py-5 col-md-8 col-lg-5">
      <h1 className="h2 mb-2">Crear cuenta</h1>
      <p className="text-secondary mb-4">Registrate para ver el detalle de nuestros proyectos y probar las demos.</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={enviar} noValidate>
        <Campo id="nombre" label="Nombre" valor={datos.nombre} error={errores.nombre} onChange={cambiar} autoComplete="name" />
        <Campo id="email" label="Email" type="email" valor={datos.email} error={errores.email} onChange={cambiar} autoComplete="email" />
        <Campo id="password" label="Contraseña" type="password" valor={datos.password} error={errores.password} onChange={cambiar} autoComplete="new-password" ayuda="Mínimo 8 caracteres." />
        <Campo id="repetir" label="Repetir contraseña" type="password" valor={datos.repetir} error={errores.repetir} onChange={cambiar} autoComplete="new-password" />
        <button type="submit" className="btn btn-primary w-100" disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Registrarme'}
        </button>
      </form>
      <p className="small text-secondary mt-3">
        ¿Ya tenés cuenta? <Link to={`/ingresar?volver=${encodeURIComponent(volver)}`}>Ingresá</Link>
      </p>
    </section>
  );
}
