import { Link } from 'react-router-dom';
import LogoCarousel from '../components/LogoCarousel';
import { profile } from '../profile';

export default function Home() {
  return (
    <>
      <section className="py-5 my-md-4">
        <p className="text-secondary mb-2">{profile.role}</p>
        <h1 className="display-4 fw-bold mb-3">{profile.brand}</h1>
        <p className="lead text-secondary col-lg-7">{profile.tagline}</p>
        <div className="d-flex gap-2 mt-3">
          <Link className="btn btn-primary" to="/contacto">Contactanos</Link>
          <Link className="btn btn-outline-secondary" to="/sobre-nosotros">Sobre nosotros</Link>
        </div>
      </section>

      <section className="py-4 border-top">
        <h2 className="h5 text-center text-secondary mb-0">Tecnologías con las que trabajamos</h2>
        <LogoCarousel items={profile.technologies} />
      </section>
    </>
  );
}
