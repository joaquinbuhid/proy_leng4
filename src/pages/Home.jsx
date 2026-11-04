import { Link } from 'react-router-dom';
import { profile } from '../data/profile';

export default function Home() {
  return (
    <section className="py-5 my-md-4">
      <p className="text-secondary mb-2">{profile.role}</p>
      <h1 className="display-4 fw-bold mb-3">{profile.brand}</h1>
      <p className="lead text-secondary col-lg-7">{profile.tagline}</p>
      <div className="d-flex gap-2 mt-3">
        <Link className="btn btn-primary" to="/contacto">Contactanos</Link>
        <Link className="btn btn-outline-secondary" to="/sobre-nosotros">Sobre nosotros</Link>
      </div>
      <p className="text-secondary small mt-5">Próximamente: proyectos y más secciones.</p>
    </section>
  );
}
