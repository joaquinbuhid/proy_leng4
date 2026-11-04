import { Link } from 'react-router-dom';
import { profile } from '../data/profile';

export default function Footer() {
  return (
    <footer className="pf-footer py-5 mt-auto">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-md-6">
            <div className="pf-brand mb-2"><span className="pf-brand-mark">&lt;/&gt;</span> {profile.name}</div>
            <p className="text-muted-2 mb-0 small">{profile.role} · {profile.location}</p>
          </div>
          <div className="col-md-6 d-flex flex-wrap gap-3 justify-content-md-end align-items-center">
            <Link to="/estilo" className="link-muted small">Guía de estilo</Link>
            <Link to="/contacto" className="link-muted small">Contacto</Link>
            {profile.socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="btn btn-icon" aria-label={s.label}>
                <i className={`bi bi-${s.icon}`} />
              </a>
            ))}
          </div>
        </div>
        <hr className="my-4 opacity-25" />
        <p className="small text-muted-2 mb-0 text-center">© {new Date().getFullYear()} {profile.name}. Trabajo Práctico Integrador · Lenguajes 4.</p>
      </div>
    </footer>
  );
}
