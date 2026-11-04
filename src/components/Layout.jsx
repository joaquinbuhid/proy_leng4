import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { profile } from '../profile';
import { useAuth } from './AuthContext';

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { usuario, salir } = useAuth();
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setAbierto(false);
  }, [pathname]);

  const cerrarSesion = async () => {
    await salir();
    navigate('/');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-md border-bottom bg-white">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to="/">{profile.brand}</Link>
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="menu"
            aria-expanded={abierto}
            aria-label="Abrir menú"
            onClick={() => setAbierto(!abierto)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div id="menu" className={`collapse navbar-collapse${abierto ? ' show' : ''}`}>
            <div className="navbar-nav ms-auto">
              <NavLink className="nav-link" to="/" end>Inicio</NavLink>
              <NavLink className="nav-link" to="/sobre-nosotros">Sobre nosotros</NavLink>
              <NavLink className="nav-link" to="/proyectos">Proyectos</NavLink>
              <NavLink className="nav-link" to="/contacto">Contacto</NavLink>
            </div>
            <div className="navbar-nav ms-md-3 align-items-md-center">
              {usuario ? (
                <>
                  <span className="navbar-text small me-md-2">Hola, {usuario.nombre.split(' ')[0]}</span>
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={cerrarSesion}>Salir</button>
                </>
              ) : (
                <>
                  <NavLink className="nav-link" to="/ingresar">Ingresar</NavLink>
                  <Link className="btn btn-sm btn-primary ms-md-2 mt-2 mt-md-0" to="/registro">Registrarse</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container flex-grow-1">
        <Outlet />
      </main>

      <footer className="border-top py-3 mt-5">
        <div className="container small text-secondary d-flex flex-wrap justify-content-between gap-2">
          <span>© {new Date().getFullYear()} {profile.brand}</span>
          <span>{profile.location}</span>
        </div>
      </footer>
    </div>
  );
}
