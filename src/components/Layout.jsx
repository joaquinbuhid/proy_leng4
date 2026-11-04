import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { profile } from '../profile';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar border-bottom bg-white">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to="/">{profile.brand}</Link>
          <div className="navbar-nav flex-row gap-3">
            <NavLink className="nav-link" to="/" end>Inicio</NavLink>
            <NavLink className="nav-link" to="/sobre-nosotros">Sobre nosotros</NavLink>
            <NavLink className="nav-link" to="/contacto">Contacto</NavLink>
          </div>
        </div>
      </nav>

      <main className="container flex-grow-1">
        <Outlet />
      </main>

      <footer className="border-top py-3 mt-5">
        <div className="container small text-secondary">
          © {new Date().getFullYear()} {profile.brand}
        </div>
      </footer>
    </div>
  );
}
