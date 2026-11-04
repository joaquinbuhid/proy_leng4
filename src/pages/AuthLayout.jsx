import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function AuthLayout({ title, subtitle, children, aside }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pf-auth-card', { y: 40, autoAlpha: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.pf-auth-aside > *', { x: -30, autoAlpha: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.15 });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <div className="pf-page" ref={ref}>
      <div className="container">
        <div className="row g-5 align-items-center justify-content-center">
          <div className="col-lg-5 d-none d-lg-block pf-auth-aside">{aside}</div>
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="pf-card pf-auth-card p-4 p-md-5">
              <h1 className="h3 font-display">{title}</h1>
              <p className="text-muted-2 mb-4">{subtitle}</p>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthAside() {
  return (
    <>
      <span className="pf-eyebrow">Acceso exclusivo</span>
      <h2 className="display-6 fw-bold font-display mt-2">Proyectos y <span className="text-gradient">demos interactivas</span></h2>
      <p className="text-muted-2 fs-5">Creá una cuenta gratis para ver el detalle técnico de cada proyecto y probar las demos en vivo.</p>
      <ul className="list-unstyled d-grid gap-2">
        <li><i className="bi bi-check-circle-fill text-accent me-2" />Arquitectura y tecnologías de cada proyecto</li>
        <li><i className="bi bi-check-circle-fill text-accent me-2" />Demos funcionando en el navegador</li>
        <li><i className="bi bi-check-circle-fill text-accent me-2" />Enlaces a repositorios</li>
      </ul>
    </>
  );
}
