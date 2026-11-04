import { useLayoutEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { projects, demos as allDemos } from '../data/mock';
import { BUILTIN_DEMOS } from '../components/demos';
import { useToast } from '../context/ToastContext';
import { fmtDate } from '../utils/format';

function DemoFrame({ demo }) {
  const ref = useRef(null);
  const fullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else ref.current?.requestFullscreen?.();
  };
  const Builtin = demo.type === 'builtin' && BUILTIN_DEMOS[demo.component]?.Component;
  return (
    <div className="pf-card p-0 overflow-hidden mb-4" ref={ref}>
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom pf-border">
        <div>
          <h3 className="h6 mb-0"><i className="bi bi-play-circle text-accent me-2" />{demo.title}</h3>
          <div className="small text-muted-2">{demo.description}</div>
        </div>
        <div className="d-flex gap-1">
          {demo.type === 'link' && <a className="btn btn-sm btn-outline-primary" href={demo.url} target="_blank" rel="noreferrer">Abrir <i className="bi bi-box-arrow-up-right" /></a>}
          {demo.type !== 'link' && document.fullscreenEnabled && <button className="btn btn-sm btn-icon" onClick={fullscreen} aria-label="Pantalla completa"><i className="bi bi-arrows-fullscreen" /></button>}
        </div>
      </div>
      {Builtin && <Builtin />}
      {demo.type === 'iframe' && <div className="ratio ratio-16x9"><iframe src={demo.url} title={demo.title} loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms" /></div>}
      {demo.type === 'link' && <div className="p-4 text-muted-2 small">Esta demo se abre en una nueva pestaña.</div>}
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const notify = useToast();
  const scope = useRef(null);
  const project = projects.find((p) => p.id === id);
  const demos = allDemos.filter((d) => d.projectId === id);

  useLayoutEffect(() => {
    if (!project) return;
    const ctx = gsap.context(() => {
      gsap.from('.pf-detail-cover', { scale: 1.08, autoAlpha: 0, duration: 1, ease: 'power3.out' });
      gsap.from('.pf-detail-anim', { y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.2 });
    }, scope);
    return () => ctx.revert();
  }, [project]);

  // Web Share API con respaldo al portapapeles.
  const share = async () => {
    const data = { title: project.title, text: project.summary, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); notify('Enlace copiado al portapapeles.', 'info'); }
    } catch {}
  };

  if (!project) return <div className="pf-page container text-center"><h1 className="h3">No se encontró el proyecto.</h1><Link to="/proyectos">Volver a proyectos</Link></div>;

  return (
    <div className="pf-page" ref={scope}>
      <div className="container">
        <Link to="/proyectos" className="link-muted small pf-detail-anim d-inline-block mb-3"><i className="bi bi-arrow-left" /> Todos los proyectos</Link>
        <div className="row g-5">
          <div className="col-lg-7">
            <div className="pf-detail-cover rounded-4 overflow-hidden mb-4"><img src={project.image} alt={`Portada de ${project.title}`} className="w-100" /></div>
          </div>
          <div className="col-lg-5">
            <h1 className="pf-section-title pf-detail-anim">{project.title}</h1>
            <p className="lead text-muted-2 pf-detail-anim">{project.summary}</p>
            <p className="pf-detail-anim">{project.description}</p>
            <div className="d-flex flex-wrap gap-2 mb-4 pf-detail-anim">{project.tech.map((t) => <span key={t} className="badge pf-chip fs-6 fw-normal">{t}</span>)}</div>
            <div className="d-flex flex-wrap gap-2 pf-detail-anim">
              {project.repoUrl && <a className="btn btn-outline-light rounded-pill" href={project.repoUrl} target="_blank" rel="noreferrer"><i className="bi bi-github me-1" />Repositorio</a>}
              {project.liveUrl && <a className="btn btn-primary rounded-pill" href={project.liveUrl} target="_blank" rel="noreferrer"><i className="bi bi-box-arrow-up-right me-1" />Sitio en vivo</a>}
              <button className="btn btn-icon" onClick={share} aria-label="Compartir"><i className="bi bi-share" /></button>
            </div>
            <p className="small text-muted-2 mt-4 pf-detail-anim">Publicado el {fmtDate(project.createdAt, { dateStyle: 'long' })}</p>
          </div>
        </div>
        <h2 className="h4 mt-5 mb-4 font-display">Demos interactivas</h2>
        {demos.length ? demos.map((d) => <DemoFrame key={d.id} demo={d} />) : <div className="pf-card p-4 text-muted-2">Este proyecto todavía no tiene demos publicadas.</div>}
      </div>
    </div>
  );
}
