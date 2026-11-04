import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import RequiereSesion from '../components/RequiereSesion';
import WeatherDemo from '../components/demos/WeatherDemo';
import KanbanDemo from '../components/demos/KanbanDemo';
import ApiExplorerDemo from '../components/demos/ApiExplorerDemo';

const DEMOS = { clima: WeatherDemo, kanban: KanbanDemo, api: ApiExplorerDemo };

function Detalle() {
  const { id } = useParams();
  const [estado, setEstado] = useState({ cargando: true });

  useEffect(() => {
    setEstado({ cargando: true });
    api(`/proyectos/${encodeURIComponent(id)}`)
      .then((d) => setEstado({ proyecto: d.proyecto }))
      .catch((e) => setEstado({ error: e.message }));
  }, [id]);

  if (estado.cargando) return <div className="py-5 text-center"><span className="spinner-border" role="status" aria-label="Cargando" /></div>;
  if (estado.error) return <div className="alert alert-danger my-5">{estado.error}</div>;

  const p = estado.proyecto;
  const Demo = DEMOS[p.demo];

  return (
    <>
      <h1 className="h2 mb-3">{p.titulo}</h1>
      <p className="col-lg-8">{p.descripcion}</p>
      <div className="d-flex flex-wrap gap-2 mb-4">
        {p.tecnologias.map((t) => (
          <span key={t} className="badge text-bg-light border fw-normal">{t}</span>
        ))}
      </div>
      {Demo && (
        <>
          <h2 className="h5 mb-3">Demo interactiva</h2>
          <div className="border rounded p-3 p-md-4">
            <Demo />
          </div>
        </>
      )}
    </>
  );
}

export default function ProjectDetail() {
  return (
    <section className="py-5">
      <Link className="small d-inline-block mb-3" to="/proyectos">← Volver a proyectos</Link>
      <RequiereSesion>
        <Detalle />
      </RequiereSesion>
    </section>
  );
}
