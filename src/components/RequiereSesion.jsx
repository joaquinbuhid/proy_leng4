import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Muestra el contenido solo a usuarios registrados; al resto, una invitación a registrarse.
export default function RequiereSesion({ children }) {
  const { usuario, cargando } = useAuth();
  const { pathname } = useLocation();

  if (cargando) {
    return <div className="py-5 text-center"><span className="spinner-border" role="status" aria-label="Cargando" /></div>;
  }
  if (usuario) return children;

  const destino = encodeURIComponent(pathname);
  return (
    <div className="py-5 text-center col-md-8 col-lg-6 mx-auto">
      <h2 className="h4">Registrate para ver este proyecto</h2>
      <p className="text-secondary">El detalle de los proyectos y las demos interactivas están disponibles para usuarios registrados. Es gratis y lleva un minuto.</p>
      <div className="d-flex gap-2 justify-content-center">
        <Link className="btn btn-primary" to={`/registro?volver=${destino}`}>Registrarme</Link>
        <Link className="btn btn-outline-secondary" to={`/ingresar?volver=${destino}`}>Ya tengo cuenta</Link>
      </div>
    </div>
  );
}
