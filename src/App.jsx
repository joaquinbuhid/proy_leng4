import { profile } from './data/profile';

const tecnologias = ['React', 'JavaScript', 'Node.js', 'Express', 'MySQL', 'Git'];

export default function App() {
  return (
    <>
      <nav className="navbar border-bottom bg-white">
        <div className="container">
          <span className="navbar-brand fw-semibold">{profile.name}</span>
          <div className="d-flex gap-3">
            <a className="nav-link" href="#sobre-mi">Sobre mí</a>
            <a className="nav-link" href="#contacto">Contacto</a>
          </div>
        </div>
      </nav>

      <main className="container">
        <section className="py-5 my-md-4">
          <p className="text-secondary mb-2">{profile.role}</p>
          <h1 className="display-5 fw-bold mb-3">Hola, soy {profile.name}</h1>
          <p className="lead text-secondary col-lg-7">{profile.tagline}</p>
          <a className="btn btn-primary mt-2" href="#contacto">Contactame</a>
        </section>

        <section id="sobre-mi" className="py-4 border-top">
          <h2 className="h4 mb-3">Sobre mí</h2>
          <p className="col-lg-8">{profile.about}</p>
          <div className="d-flex flex-wrap gap-2 mt-3">
            {tecnologias.map((t) => (
              <span key={t} className="badge text-bg-light border fw-normal">{t}</span>
            ))}
          </div>
        </section>

        <section id="contacto" className="py-4 border-top">
          <h2 className="h4 mb-3">Contacto</h2>
          <p className="mb-1">
            Escribime a <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
          <p className="text-secondary small">Próximamente: proyectos y más secciones.</p>
        </section>
      </main>

      <footer className="border-top py-3 mt-4">
        <div className="container small text-secondary">
          © {new Date().getFullYear()} {profile.name}
        </div>
      </footer>
    </>
  );
}
