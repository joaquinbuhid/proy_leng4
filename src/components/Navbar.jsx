import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useTheme } from '../context/ThemeContext';
import { profile } from '../data/profile';

const SECTIONS = [
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'stack', label: 'Stack' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'experiencia', label: 'Experiencia' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const ref = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    gsap.from(ref.current, { y: -80, autoAlpha: 0, duration: 0.8, ease: 'power3.out' });
  }, []);

  const goSection = (id) => {
    setOpen(false);
    if (pathname === '/') document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    else navigate('/', { state: { scrollTo: id } });
  };

  return (
    <nav ref={ref} className={`navbar navbar-expand-lg fixed-top pf-navbar ${scrolled ? 'is-scrolled' : ''}`} aria-label="Navegación principal">
      <div className="container">
        <Link className="navbar-brand pf-brand" to="/">
          <span className="pf-brand-mark">&lt;/&gt;</span> {profile.name.split(' ')[0]}<span className="text-accent">.dev</span>
        </Link>
        <button className="navbar-toggler border-0" type="button" aria-expanded={open} aria-controls="mainNav" aria-label="Abrir menú" onClick={() => setOpen((o) => !o)}>
          <i className={`bi ${open ? 'bi-x-lg' : 'bi-list'} fs-3`} />
        </button>
        <div id="mainNav" className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto gap-lg-1">
            {SECTIONS.map((s) => (
              <li className="nav-item" key={s.id}>
                <button className="nav-link btn btn-link" onClick={() => goSection(s.id)}>{s.label}</button>
              </li>
            ))}
            <li className="nav-item">
              <NavLink className="nav-link" to="/proyectos">Proyectos</NavLink>
            </li>
            <li className="nav-item"><NavLink className="nav-link" to="/contacto">Contacto</NavLink></li>
          </ul>
          <div className="d-flex align-items-center gap-2 pb-3 pb-lg-0">
            <button className="btn btn-icon" onClick={toggle} aria-label={theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'} title="Cambiar tema">
              <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon-stars'}`} />
            </button>
            <Link className="btn btn-icon" to="/admin" aria-label="Panel de gestión" title="Panel de gestión"><i className="bi bi-speedometer2" /></Link>
            <Link className="btn btn-link text-reset text-decoration-none" to="/login">Ingresar</Link>
            <Link className="btn btn-primary rounded-pill px-3" to="/registro">Registrarme</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
