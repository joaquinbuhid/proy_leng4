import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../components/AuthContext';

export default function Projects() {
  const { usuario } = useAuth();
  const [estado, setEstado] = useState({ cargando: true });

  useEffect(() => {
    api('/proyectos')
      .then((d) => setEstado({ proyectos: d.proyectos }))
      .catch((e) => setEstado({ error: e.message }));
  }, []);

  return (
    <section className="py-5">
      <h1 className="h2 mb-2">Proyectos y demos</h1>
      <p className="text-secondary mb-4">
        {usuario
          ? 'Entrá a cada proyecto para ver el detalle y probar su demo.'
          : 'Para ver el detalle de cada proyecto y probar las demos tenés que registrarte.'}
      </p>

      {estado.cargando && <div className="py-4 text-center"><span className="spinner-border" role="status" aria-label="Cargando" /></div>}
      {estado.error && <div className="alert alert-danger">{estado.error}</div>}

      {estado.proyectos && (
        <div className="row g-3">
          {estado.proyectos.map((p) => (
            <div key={p.id} className="col-md-6 col-lg-4">
              <div className="border rounded p-3 h-100 d-flex flex-column">
                <h2 className="h5">{p.titulo}</h2>
                <p className="text-secondary flex-grow-1">{p.resumen}</p>
                <Link className="btn btn-outline-primary btn-sm align-self-start" to={`/proyectos/${p.id}`}>
                  {usuario ? 'Ver proyecto y demo' : 'Registrate para verlo'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
