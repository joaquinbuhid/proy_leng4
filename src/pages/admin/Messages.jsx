import { useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { messages as seed } from '../../data/mock';
import { useToast } from '../../context/ToastContext';
import { fmtDate, relativeTime, TYPE_LABELS, STATUS_LABELS, STATUS_COLORS } from '../../utils/format';

const TABS = ['todas', 'nuevo', 'leido', 'respondido', 'archivado'];

export default function Messages() {
  const notify = useToast();
  const [items, setItems] = useState(seed);
  const [tab, setTab] = useState('todas');
  const [type, setType] = useState('all');
  const [q, setQ] = useState('');
  const [selectedId, setSelectedId] = useState(seed[0].id);
  const [reply, setReply] = useState('');
  const [replyError, setReplyError] = useState('');
  const detail = useRef(null);

  const list = useMemo(() => items.filter((m) =>
    (tab === 'todas' || m.status === tab) && (type === 'all' || m.type === type) &&
    (m.name + m.subject + m.email).toLowerCase().includes(q.toLowerCase())
  ), [items, tab, type, q]);
  const sel = items.find((m) => m.id === selectedId);

  const update = (id, patch) => setItems((xs) => xs.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const open = (m) => {
    setSelectedId(m.id);
    setReply('');
    setReplyError('');
    if (m.status === 'nuevo') update(m.id, { status: 'leido' });
    requestAnimationFrame(() => {
      gsap.fromTo(detail.current, { x: 20, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out' });
      if (window.innerWidth < 992) detail.current?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const send = (e) => {
    e.preventDefault();
    const body = reply.trim();
    if (body.length < 10) return setReplyError('La respuesta debe tener al menos 10 caracteres.');
    if (body.length > 2000) return setReplyError('La respuesta no puede superar los 2000 caracteres.');
    update(sel.id, { status: 'respondido', replies: [...sel.replies, { body, by: 'Operador', at: new Date().toISOString() }] });
    setReply('');
    setReplyError('');
    notify(`Respuesta enviada a ${sel.email}`);
  };

  const count = (s) => (s === 'todas' ? items.length : items.filter((m) => m.status === s).length);

  return (
    <>
      <div className="mb-4 pf-admin-anim">
        <h1 className="h3 font-display mb-1">Consultas</h1>
        <p className="text-muted-2 mb-0">Mensajes, cotizaciones y solicitudes de asesoría recibidas.</p>
      </div>
      <div className="pf-card p-3 mb-3 pf-admin-anim">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <div className="nav nav-pills pf-pills flex-nowrap overflow-auto">
            {TABS.map((t) => (
              <button key={t} className={`nav-link text-nowrap ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t === 'todas' ? 'Todas' : STATUS_LABELS[t]} <span className="badge ms-1">{count(t)}</span>
              </button>
            ))}
          </div>
          <select className="form-select form-select-sm ms-lg-auto" style={{ maxWidth: 190 }} value={type} onChange={(e) => setType(e.target.value)} aria-label="Tipo de consulta">
            <option value="all">Todos los tipos</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <input className="form-control form-control-sm" style={{ maxWidth: 220 }} placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar consulta" />
        </div>
      </div>
      <div className="row g-3">
        <div className="col-lg-5">
          <div className="pf-card pf-inbox pf-admin-anim">
            {list.length === 0 && <div className="p-4 text-center text-muted-2">No hay consultas con estos filtros.</div>}
            {list.map((m) => (
              <button key={m.id} className={`pf-inbox-item ${sel?.id === m.id ? 'is-active' : ''} ${m.status === 'nuevo' ? 'is-unread' : ''}`} onClick={() => open(m)}>
                <span className="pf-avatar">{m.name[0]}</span>
                <span className="flex-grow-1 min-w-0 text-start">
                  <span className="d-flex justify-content-between"><strong className="text-truncate">{m.name}</strong><small className="text-muted-2 text-nowrap ms-2">{relativeTime(m.createdAt)}</small></span>
                  <span className="d-block small text-truncate">{m.subject}</span>
                  <span className="d-flex gap-1 mt-1">
                    <span className="badge pf-chip">{TYPE_LABELS[m.type]}</span>
                    <span className={`badge pf-status pf-status-${STATUS_COLORS[m.status]}`}>{STATUS_LABELS[m.status]}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="col-lg-7">
          <div className="pf-card p-4 pf-admin-anim" ref={detail}>
            {!sel ? <div className="text-center text-muted-2 py-5">Seleccioná una consulta.</div> : (
              <>
                <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
                  <div>
                    <h2 className="h5 mb-1">{sel.subject}</h2>
                    <div className="small text-muted-2">{sel.name} · <a href={`mailto:${sel.email}`}>{sel.email}</a></div>
                    <div className="small text-muted-2">{fmtDate(sel.createdAt)}</div>
                  </div>
                  <div className="d-flex gap-1 align-items-start">
                    <button className="btn btn-sm btn-icon" title="Archivar" aria-label="Archivar" onClick={() => { update(sel.id, { status: 'archivado' }); notify('Consulta archivada.', 'info'); }}><i className="bi bi-archive" /></button>
                    <button className="btn btn-sm btn-icon" title="Marcar como no leída" aria-label="Marcar como no leída" onClick={() => update(sel.id, { status: 'nuevo' })}><i className="bi bi-envelope" /></button>
                    <button className="btn btn-sm btn-icon text-danger" title="Eliminar" aria-label="Eliminar" onClick={() => { setItems((xs) => xs.filter((x) => x.id !== sel.id)); setSelectedId(null); notify('Consulta eliminada.', 'info'); }}><i className="bi bi-trash" /></button>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge pf-chip">{TYPE_LABELS[sel.type]}</span>
                  {sel.budget && <span className="badge pf-chip"><i className="bi bi-cash me-1" />{sel.budget}</span>}
                </div>
                <div className="pf-bubble mb-3">{sel.message}</div>
                {sel.replies.map((r, i) => (
                  <div key={i} className="pf-bubble pf-bubble-out mb-3">
                    <div className="small opacity-75 mb-1"><i className="bi bi-reply me-1" />{r.by} · {fmtDate(r.at)}</div>
                    {r.body}
                  </div>
                ))}
                <form onSubmit={send} noValidate className="mt-4">
                  <label htmlFor="reply" className="form-label">Responder por email</label>
                  <textarea id="reply" rows={4} maxLength={2000} className={`form-control ${replyError ? 'is-invalid' : ''}`} value={reply} onChange={(e) => setReply(e.target.value)} placeholder={`Hola ${sel.name.split(' ')[0]}, …`} />
                  <div className="d-flex justify-content-between">
                    <div className="invalid-feedback d-block">{replyError}</div>
                    <div className="form-text">{reply.length}/2000</div>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <button className="btn btn-primary rounded-pill"><i className="bi bi-send me-1" />Enviar respuesta</button>
                    {['Gracias por tu consulta, te escribo a la brevedad.', 'Te comparto la cotización adjunta.'].map((tpl) => (
                      <button key={tpl} type="button" className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => setReply(tpl)}>{tpl.slice(0, 26)}…</button>
                    ))}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
