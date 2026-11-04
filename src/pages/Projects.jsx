import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { projects, demos } from '../data/mock';
import { useReveal } from '../hooks/useReveal';

export default function Projects() {
  const scope = useRef(null);
  const grid = useRef(null);
  const [q, setQ] = useState('');
  const [tech, setTech] = useState('Todos');

  const techs = useMemo(() => ['Todos', ...new Set(projects.flatMap((p) => p.tech))], []);
  const filtered = useMemo(() => projects.filter((p) =>
    (tech === 'Todos' || p.tech.includes(tech)) &&
    (p.title + ' ' + p.summary).toLowerCase().includes(q.trim().toLowerCase())
  ), [q, tech]);

  // Re-anima la grilla al cambiar el filtro.
  useEffect(() => {
    if (!grid.current) return;
    gsap.fromTo(grid.current.children, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' });
  }, [filtered]);

  useReveal(scope);

  const tilt = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotateY: x * 10, rotateX: -y * 10, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
  };
  const untilt = (e) => gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });

  return (
    <div className="pf-page" ref={scope}>
      <div className="container">
        <span className="pf-eyebrow" data-reveal>Área de miembros</span>
        <h1 className="pf-section-title" data-reveal>Proyectos y <span className="text-gradient">demos</span></h1>
        <p className="text-muted-2 fs-5 mb-4" data-reveal>Explorá el detalle técnico de cada trabajo y probá las demos interactivas.</p>

        <div className="row g-3 align-items-center mb-4" data-reveal>
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-search" /></span>
              <input className="form-control" placeholder="Buscar proyecto…" value={q} maxLength={50} onChange={(e) => setQ(e.target.value)} aria-label="Buscar proyecto" />
            </div>
          </div>
          <div className="col-md-7 d-flex flex-wrap gap-2 justify-content-md-end">
            {techs.map((t) => (
              <button key={t} className={`btn btn-sm rounded-pill ${tech === t ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setTech(t)}>{t}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="pf-card p-5 text-center text-muted-2">No hay proyectos que coincidan con la búsqueda.</div>
        ) : (
          <div className="row g-4" ref={grid}>
            {filtered.map((p) => {
              const nDemos = demos.filter((d) => d.projectId === p.id).length;
              return (
                <div className="col-md-6 col-lg-4" key={p.id}>
                  <Link to={`/proyectos/${p.id}`} className="pf-card pf-project-card d-block text-reset text-decoration-none h-100" onMouseMove={tilt} onMouseLeave={untilt}>
                    <div className="pf-project-img">
                      <img src={p.image} alt={`Portada de ${p.title}`} loading="lazy" />
                      {p.featured && <span className="badge pf-badge position-absolute top-0 start-0 m-3"><i className="bi bi-star-fill me-1" />Destacado</span>}
                    </div>
                    <div className="p-4">
                      <h2 className="h5">{p.title}</h2>
                      <p className="small text-muted-2">{p.summary}</p>
                      <div className="d-flex flex-wrap gap-1 mb-3">{p.tech.map((t) => <span key={t} className="badge pf-chip">{t}</span>)}</div>
                      <div className="small text-accent">{nDemos > 0 ? <><i className="bi bi-play-circle me-1" />{nDemos} demo{nDemos > 1 && 's'} interactiva{nDemos > 1 && 's'}</> : 'Ver detalle'} <i className="bi bi-arrow-right" /></div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
