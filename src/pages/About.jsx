import { Link } from 'react-router-dom';
import { profile } from '../data/profile';

const tecnologias = ['React', 'JavaScript', 'Node.js', 'Express', 'MySQL', 'Git'];

export default function About() {
  return (
    <section className="py-5">
      <h1 className="h2 mb-4">Sobre nosotros</h1>
      <p className="col-lg-8">{profile.about}</p>
      <p className="text-secondary">{profile.location}</p>

      <h2 className="h5 mt-5 mb-3">Tecnologías</h2>
      <div className="d-flex flex-wrap gap-2">
        {tecnologias.map((t) => (
          <span key={t} className="badge text-bg-light border fw-normal">{t}</span>
        ))}
      </div>

      <h2 className="h5 mt-5 mb-3">Experiencia</h2>
      <ul className="list-unstyled col-lg-8">
        {profile.experience.map((e) => (
          <li key={e.title} className="mb-3">
            <div className="fw-semibold">{e.title} · {e.company}</div>
            <div className="small text-secondary">{e.period}</div>
            <div>{e.description}</div>
          </li>
        ))}
      </ul>

      <Link className="btn btn-primary mt-3" to="/contacto">Escribinos</Link>
    </section>
  );
}
