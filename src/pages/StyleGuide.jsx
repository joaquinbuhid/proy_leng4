import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useToast } from '../context/ToastContext';

const PALETTE = [
  { group: 'Primarios', colors: [{ name: 'Violeta', hex: '#7C5CFF', use: 'Acciones principales, enlaces' }, { name: 'Noche', hex: '#0B0F19', use: 'Fondo modo oscuro' }] },
  { group: 'Secundarios', colors: [{ name: 'Superficie', hex: '#121829', use: 'Tarjetas y paneles' }, { name: 'Niebla', hex: '#F5F6FB', use: 'Fondo modo claro' }, { name: 'Grafito', hex: '#A3ACC2', use: 'Texto secundario' }] },
  { group: 'Acento', colors: [{ name: 'Menta', hex: '#2EE6A8', use: 'Énfasis, estados positivos' }, { name: 'Ámbar', hex: '#FFB547', use: 'Avisos, datos' }, { name: 'Coral', hex: '#FF6B9A', use: 'Errores, alertas' }] },
];

const TYPE = [
  { tag: 'h1', label: 'Título H1', font: 'Space Grotesk 700', size: 'clamp(2.6rem, 6vw, 4.6rem)', cls: 'display-4 fw-bold font-display' },
  { tag: 'h2', label: 'Título de sección H2', font: 'Space Grotesk 700', size: 'clamp(2rem, 4vw, 3rem)', cls: 'pf-section-title mb-0' },
  { tag: 'h3', label: 'Subtítulo H3', font: 'Space Grotesk 600', size: '1.25rem', cls: 'h4 font-display' },
  { tag: 'p', label: 'Cuerpo de texto: legible y cómodo para lectura prolongada.', font: 'Inter 400', size: '1rem / 1.65', cls: '' },
  { tag: 'code', label: 'const stack = "fullstack";', font: 'JetBrains Mono 400', size: '0.9rem', cls: 'font-mono' },
];

export default function StyleGuide() {
  const scope = useRef(null);
  const notify = useToast();
  useReveal(scope);
  const copy = (hex) => navigator.clipboard?.writeText(hex).then(() => notify(`${hex} copiado.`, 'info'));
  return (
    <div className="pf-page" ref={scope}>
      <div className="container">
        <span className="pf-eyebrow" data-reveal>Manual de marca</span>
        <h1 className="pf-section-title" data-reveal>Guía de <span className="text-gradient">estilo</span></h1>
        <p className="text-muted-2 fs-5 mb-5" data-reveal>Paleta, tipografía, componentes y criterios responsive del portfolio.</p>

        <h2 className="h4 font-display mb-3" data-reveal>1. Paleta de colores</h2>
        {PALETTE.map((g) => (
          <div key={g.group} className="mb-4">
            <div className="small text-uppercase ls-wide text-accent mb-2">{g.group}</div>
            <div className="row g-3" data-stagger>
              {g.colors.map((c) => (
                <div className="col-6 col-md-4 col-lg-3" key={c.hex}>
                  <button className="pf-card pf-swatch w-100 text-start p-0 overflow-hidden" onClick={() => copy(c.hex)} title="Copiar HEX">
                    <div className="pf-swatch-color" style={{ background: c.hex }} />
                    <div className="p-3"><strong>{c.name}</strong><div className="font-mono small">{c.hex}</div><div className="small text-muted-2">{c.use}</div></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="pf-card p-3 mb-5 d-flex align-items-center gap-3" data-reveal>
          <div className="pf-gradient-sample" /> <div><strong>Degradado de marca</strong><div className="font-mono small">linear-gradient(120deg, #7C5CFF, #2EE6A8)</div></div>
        </div>

        <h2 className="h4 font-display mb-3" data-reveal>2. Tipografía</h2>
        <div className="pf-card p-4 mb-5" data-stagger>
          {TYPE.map((t) => (
            <div key={t.tag} className="row py-3 border-bottom pf-border align-items-center">
              <div className="col-md-3 small text-muted-2"><span className="font-mono text-accent">&lt;{t.tag}&gt;</span><br />{t.font}<br />{t.size}</div>
              <div className="col-md-9"><div className={t.cls}>{t.label}</div></div>
            </div>
          ))}
        </div>

        <h2 className="h4 font-display mb-3" data-reveal>3. Componentes</h2>
        <div className="pf-card p-4 mb-5" data-reveal>
          <div className="d-flex flex-wrap gap-2 mb-4">
            <button className="btn btn-primary rounded-pill">Primario</button>
            <button className="btn btn-outline-primary rounded-pill">Secundario</button>
            <button className="btn btn-outline-light rounded-pill">Fantasma</button>
            <button className="btn btn-icon"><i className="bi bi-heart" /></button>
            <span className="badge pf-chip align-self-center">Chip</span>
            <span className="badge pf-status pf-status-accent align-self-center">Nuevo</span>
            <span className="badge pf-status pf-status-success align-self-center">Respondido</span>
          </div>
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Campo válido</label><input className="form-control is-valid" defaultValue="nombre@dominio.com" /></div>
            <div className="col-md-6"><label className="form-label">Campo con error</label><input className="form-control is-invalid" defaultValue="nombre@" /><div className="invalid-feedback">Ingresá un email válido.</div></div>
          </div>
        </div>

        <h2 className="h4 font-display mb-3" data-reveal>4. Responsive</h2>
        <div className="row g-3" data-stagger>
          {[['phone', 'Móvil', '< 576 px', 'Una columna, menú colapsable, botones a ancho completo.'], ['tablet', 'Tablet', '768 px', 'Grillas de 2 columnas, sidebar del panel como cajón.'], ['laptop', 'Escritorio', '≥ 992 px', 'Grillas de 3–4 columnas, sidebar fija, efectos de hover y parallax.']].map(([i, n, b, d]) => (
            <div className="col-md-4" key={n}><div className="pf-card p-4 h-100"><i className={`bi bi-${i} fs-2 text-accent`} /><h3 className="h6 mt-2">{n} <span className="font-mono small text-muted-2">{b}</span></h3><p className="small text-muted-2 mb-0">{d}</p></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
