import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { profile } from '../data/profile';
import { services, projects as allProjects } from '../data/mock';
import { useReveal, prefersReducedMotion } from '../hooks/useReveal';
import Counter from '../components/Counter';
import Magnetic from '../components/Magnetic';
import { fmtMoney } from '../utils/format';

const ROLES = ['Desarrollador Fullstack', 'React & Node.js', 'APIs REST', 'Bases de datos SQL y NoSQL'];

function TypedRole() {
  const ref = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) { ref.current.textContent = ROLES[0]; return; }
    let i = 0;
    let alive = true;
    const tl = gsap.timeline({ repeat: -1 });
    const cycle = () => {
      const word = ROLES[i % ROLES.length];
      const o = { n: 0 };
      tl.clear();
      tl.to(o, { n: word.length, duration: word.length * 0.05, ease: 'none', onUpdate: () => alive && (ref.current.textContent = word.slice(0, Math.round(o.n))) })
        .to({}, { duration: 1.6 })
        .to(o, { n: 0, duration: word.length * 0.025, ease: 'none', onUpdate: () => alive && (ref.current.textContent = word.slice(0, Math.round(o.n))), onComplete: () => { i++; alive && cycle(); } });
      tl.play(0);
    };
    cycle();
    return () => { alive = false; tl.kill(); };
  }, []);
  return <span className="pf-typed" ref={ref} />;
}

export default function Home() {
  const scope = useRef(null);
  const hero = useRef(null);
  const projects = allProjects.slice(0, 3);
  const location = useLocation();

  useEffect(() => {
    const id = location.state?.scrollTo;
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 150);
  }, [location.state]);

  // Animación de entrada del hero.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from('.pf-hero-word', { yPercent: 110, duration: 1, stagger: 0.08, delay: 0.2 })
        .from('.pf-hero-fade', { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')
        .from('.pf-code-window', { y: 60, rotate: 4, autoAlpha: 0, duration: 1.1 }, '-=0.9')
        .from('.pf-code-line', { x: -20, autoAlpha: 0, duration: 0.4, stagger: 0.06 }, '-=0.6');
      gsap.to('.pf-blob-1', { x: 60, y: 40, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.pf-blob-2', { x: -50, y: -30, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.pf-code-window', { y: -12, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 });
    }, hero);
    return () => ctx.revert();
  }, []);

  // Parallax del mockup siguiendo al mouse (tilt 3D).
  useEffect(() => {
    const el = hero.current?.querySelector('.pf-code-tilt');
    if (!el || window.matchMedia('(pointer: coarse)').matches || prefersReducedMotion()) return;
    const move = (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      gsap.to(el, { rotateY: x * 12, rotateX: -y * 12, duration: 0.8, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useReveal(scope);

  const titleWords = ['Hola,', 'soy', ...profile.name.split(' ')];

  return (
    <div ref={scope}>
      {/* HERO */}
      <section className="pf-hero" ref={hero}>
        <div className="pf-blob pf-blob-1" aria-hidden="true" />
        <div className="pf-blob pf-blob-2" aria-hidden="true" />
        <div className="pf-grid-bg" aria-hidden="true" />
        <div className="container position-relative">
          <div className="row align-items-center g-5 min-vh-hero">
            <div className="col-lg-7">
              <span className="pf-eyebrow pf-hero-fade"><span className="pf-dot" /> Disponible para nuevos proyectos</span>
              <h1 className="pf-hero-title mt-3">
                {titleWords.map((w, i) => (
                  <span className="pf-word-mask" key={i}>
                    <span className={`pf-hero-word ${i >= 2 ? 'text-gradient' : ''}`}>{w}</span>{' '}
                  </span>
                ))}
              </h1>
              <p className="pf-hero-role pf-hero-fade font-mono">&gt; <TypedRole /><span className="pf-caret">_</span></p>
              <p className="lead text-muted-2 pf-hero-fade" style={{ maxWidth: 560 }}>{profile.tagline}</p>
              <div className="d-flex flex-wrap gap-3 mt-4 pf-hero-fade">
                <Magnetic><Link to="/proyectos" className="btn btn-primary btn-lg rounded-pill px-4">Ver proyectos <i className="bi bi-arrow-right ms-1" /></Link></Magnetic>
                <Magnetic><Link to="/contacto" className="btn btn-outline-light btn-lg rounded-pill px-4">Contactame</Link></Magnetic>
              </div>
            </div>
            <div className="col-lg-5 d-none d-md-block" style={{ perspective: 1000 }}>
              <div className="pf-code-tilt">
                <div className="pf-code-window">
                  <div className="pf-code-bar"><span /><span /><span /><small className="ms-2 font-mono">developer.js</small></div>
                  <pre className="pf-code-body font-mono mb-0">
                    <div className="pf-code-line"><span className="tk-k">const</span> <span className="tk-v">developer</span> = {'{'}</div>
                    <div className="pf-code-line">  name: <span className="tk-s">'{profile.name}'</span>,</div>
                    <div className="pf-code-line">  role: <span className="tk-s">'Fullstack'</span>,</div>
                    <div className="pf-code-line">  frontend: [<span className="tk-s">'React'</span>, <span className="tk-s">'Bootstrap'</span>],</div>
                    <div className="pf-code-line">  backend: [<span className="tk-s">'Node'</span>, <span className="tk-s">'Express'</span>],</div>
                    <div className="pf-code-line">  db: [<span className="tk-s">'MySQL'</span>, <span className="tk-s">'MongoDB'</span>],</div>
                    <div className="pf-code-line">  <span className="tk-f">ship</span>: () =&gt; <span className="tk-s">'🚀'</span></div>
                    <div className="pf-code-line">{'}'};</div>
                  </pre>
                </div>
              </div>
            </div>
          </div>
          <button className="pf-scroll-hint pf-hero-fade" onClick={() => document.getElementById('sobre-mi').scrollIntoView({ behavior: 'smooth' })} aria-label="Bajar a Sobre mí">
            <span />
          </button>
        </div>
      </section>

      {/* SOBRE MÍ */}
      <section id="sobre-mi" className="pf-section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5" data-reveal="left">
              <div className="pf-avatar-xl">
                <span>{profile.name.split(' ').map((p) => p[0]).join('')}</span>
              </div>
            </div>
            <div className="col-lg-7">
              <span className="pf-eyebrow" data-reveal>01 · Sobre mí</span>
              <h2 className="pf-section-title" data-reveal>Del diseño a la base de datos, <span className="text-gradient">todo el stack</span>.</h2>
              <p className="text-muted-2 fs-5" data-reveal>{profile.about}</p>
              <p className="text-muted-2" data-reveal><i className="bi bi-geo-alt text-accent me-1" />{profile.location}</p>
              <div className="row g-3 mt-2" data-stagger>
                {profile.stats.map((s) => (
                  <div className="col-4" key={s.label}>
                    <div className="pf-stat">
                      <Counter value={s.value} suffix={s.suffix} className="pf-stat-value" />
                      <div className="small text-muted-2">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STACK */}
      <section id="stack" className="pf-section pf-section-alt">
        <div className="container">
          <span className="pf-eyebrow" data-reveal>02 · Tecnologías</span>
          <h2 className="pf-section-title mb-5" data-reveal>Mi stack fullstack</h2>
          <div className="row g-4">
            {Object.entries(profile.stack).map(([cat, items]) => (
              <div className="col-md-6 col-lg-3" key={cat} data-reveal="zoom">
                <div className="pf-card p-4 h-100 pf-hover-lift">
                  <h3 className="h6 text-accent text-uppercase ls-wide mb-3">{cat}</h3>
                  <ul className="list-unstyled mb-0 d-grid gap-2">
                    {items.map((t) => (
                      <li key={t.name} className="pf-tech"><i className={`bi bi-${t.icon}`} /> {t.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="pf-marquee mt-5" aria-hidden="true">
            <div className="pf-marquee-track">
              {[...Array(2)].flatMap((_, k) => Object.values(profile.stack).flat().map((t) => <span key={k + t.name}>{t.name}</span>))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="pf-section">
        <div className="container">
          <span className="pf-eyebrow" data-reveal>03 · Servicios</span>
          <h2 className="pf-section-title mb-5" data-reveal>¿En qué te puedo ayudar?</h2>
          <div className="row g-4" data-stagger>
            {services.map((s) => (
              <div className="col-md-6 col-xl-3" key={s.id}>
                <div className="pf-card pf-service p-4 h-100 d-flex flex-column">
                  <div className="pf-icon-badge mb-3"><i className={`bi bi-${s.icon}`} /></div>
                  <h3 className="h5">{s.title}</h3>
                  <p className="text-muted-2 small flex-grow-1">{s.description}</p>
                  <ul className="list-unstyled small d-grid gap-1 mb-3">
                    {(s.features || []).map((f) => <li key={f}><i className="bi bi-check2 text-accent me-1" />{f}</li>)}
                  </ul>
                  {s.priceFrom > 0 && <div className="small text-muted-2 mb-3">Desde <strong className="text-body">{fmtMoney(s.priceFrom)}</strong></div>}
                  <Link to="/contacto" state={{ type: s.title.toLowerCase().includes('asesor') ? 'asesoria' : 'cotizacion', subject: s.title }} className="btn btn-outline-primary btn-sm rounded-pill">Solicitar</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCIA */}
      <section id="experiencia" className="pf-section pf-section-alt">
        <div className="container">
          <span className="pf-eyebrow" data-reveal>04 · Experiencia</span>
          <h2 className="pf-section-title mb-5" data-reveal>Trayectoria</h2>
          <div className="pf-timeline">
            {profile.experience.map((e, i) => (
              <div className="pf-timeline-item" key={i} data-reveal={i % 2 ? 'right' : 'left'}>
                <div className="pf-timeline-dot" />
                <div className="pf-card p-4">
                  <span className="badge rounded-pill pf-badge mb-2">{e.period}</span>
                  <h3 className="h5 mb-1">{e.title}</h3>
                  <div className="text-accent small mb-2">{e.company}</div>
                  <p className="text-muted-2 mb-0">{e.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROYECTOS (vista previa) */}
      <section className="pf-section">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-5">
            <div>
              <span className="pf-eyebrow" data-reveal>05 · Proyectos</span>
              <h2 className="pf-section-title mb-0" data-reveal>Trabajo destacado</h2>
            </div>
            <Link to="/proyectos" className="btn btn-outline-light rounded-pill" data-reveal>Ver todos <i className="bi bi-arrow-right" /></Link>
          </div>
          <div className="row g-4" data-stagger>
            {projects.map((p) => (
              <div className="col-md-4" key={p.id}>
                <Link to={`/proyectos/${p.id}`} className="pf-card pf-project-card d-block text-reset text-decoration-none h-100">
                  <div className="pf-project-img">
                    <img src={p.image} alt={`Portada de ${p.title}`} loading="lazy" />
                  </div>
                  <div className="p-4">
                    <h3 className="h5">{p.title}</h3>
                    <p className="small text-muted-2 mb-0">{p.summary}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pf-section pt-0">
        <div className="container">
          <div className="pf-cta p-5 text-center" data-reveal="zoom">
            <h2 className="display-6 fw-bold font-display">¿Tenés un proyecto en mente?</h2>
            <p className="lead mb-4 opacity-75">Contame tu idea y te envío una propuesta sin compromiso.</p>
            <Magnetic><Link to="/contacto" className="btn btn-light btn-lg rounded-pill px-5">Hablemos</Link></Magnetic>
          </div>
        </div>
      </section>
    </div>
  );
}
