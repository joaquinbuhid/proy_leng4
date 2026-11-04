import { useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useTheme } from '../../context/ThemeContext';
import { demoUser, messages } from '../../data/mock';

const NAV = [
  { group: 'Operador', items: [
    { to: '/admin', end: true, icon: 'speedometer2', label: 'Resumen' },
    { to: '/admin/consultas', icon: 'inbox', label: 'Consultas', badge: messages.filter((m) => m.status === 'nuevo').length },
  ] },
  { group: 'Administrador', items: [
    { to: '/admin/contenido', icon: 'collection', label: 'Contenido' },
    { to: '/admin/usuarios', icon: 'people', label: 'Usuarios' },
    { to: '/admin/metricas', icon: 'graph-up-arrow', label: 'Métricas' },
  ] },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const main = useRef(null);

  useLayoutEffect(() => {
    setOpen(false);
    const ctx = gsap.context(() => {
      gsap.from('.pf-admin-anim', { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' });
    }, main);
    return () => ctx.revert();
  }, [pathname]);

  return (
    <div className="pf-admin">
      <aside className={`pf-sidebar ${open ? 'is-open' : ''}`}>
        <Link to="/" className="pf-brand d-block mb-4 px-2"><span className="pf-brand-mark">&lt;/&gt;</span> Panel</Link>
        {NAV.map((g) => (
          <div key={g.group} className="mb-4">
            <div className="pf-sidebar-group">{g.group}</div>
            {g.items.map((i) => (
              <NavLink key={i.to} to={i.to} end={i.end} className="pf-sidebar-link">
                <i className={`bi bi-${i.icon}`} /> <span className="flex-grow-1">{i.label}</span>
                {i.badge > 0 && <span className="badge rounded-pill bg-accent">{i.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
        <div className="mt-auto">
          <Link to="/" className="pf-sidebar-link"><i className="bi bi-box-arrow-up-right" /> Ver sitio</Link>
          <Link to="/login" className="pf-sidebar-link text-danger"><i className="bi bi-box-arrow-right" /> Cerrar sesión</Link>
        </div>
      </aside>
      {open && <div className="pf-sidebar-backdrop" onClick={() => setOpen(false)} />}
      <div className="pf-admin-main" ref={main}>
        <header className="pf-admin-top">
          <button className="btn btn-icon d-lg-none" onClick={() => setOpen(true)} aria-label="Abrir menú"><i className="bi bi-list fs-4" /></button>
          <div className="input-group pf-admin-search d-none d-md-flex">
            <span className="input-group-text"><i className="bi bi-search" /></span>
            <input className="form-control" placeholder="Buscar…" aria-label="Buscar" />
          </div>
          <div className="ms-auto d-flex align-items-center gap-2">
            <button className="btn btn-icon" onClick={toggle} aria-label="Cambiar tema"><i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon-stars'}`} /></button>
            <button className="btn btn-icon position-relative" aria-label="Notificaciones"><i className="bi bi-bell" /><span className="pf-notif-dot" /></button>
            <div className="d-flex align-items-center gap-2 ms-2">
              <span className="pf-avatar">{demoUser.name[0]}</span>
              <div className="d-none d-sm-block lh-sm"><div className="small fw-semibold">{demoUser.name}</div><div className="small text-muted-2">{demoUser.email}</div></div>
            </div>
          </div>
        </header>
        <main className="p-3 p-md-4"><Outlet /></main>
      </div>
    </div>
  );
}
