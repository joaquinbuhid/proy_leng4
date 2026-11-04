import { useState } from 'react';
import { projects as p0, demos as d0, services as s0 } from '../../data/mock';
import { useForm } from '../../hooks/useForm';
import { rules } from '../../utils/validators';
import { useToast } from '../../context/ToastContext';
import Modal, { ConfirmModal } from '../../components/Modal';
import FormField from '../../components/FormField';
import ImageInput from '../../components/ImageInput';
import { BUILTIN_DEMOS } from '../../components/demos';
import { fmtMoney } from '../../utils/format';

const TABS = { projects: 'Proyectos', demos: 'Demos', services: 'Servicios' };

const SCHEMAS = {
  projects: (v) => ({
    title: [rules.required(), rules.minLength(3), rules.maxLength(60), rules.noHtml()],
    summary: [rules.required(), rules.minLength(10), rules.maxLength(120), rules.noHtml()],
    description: [rules.required(), rules.minLength(30), rules.maxLength(1500), rules.noHtml()],
    techText: [rules.required('Ingresá al menos una tecnología.'), (x) => (x && x.split(',').some((t) => !t.trim()) ? 'Separá las tecnologías con comas, sin elementos vacíos.' : null)],
    repoUrl: [rules.url()],
    image: [rules.required('Subí una imagen de portada.')],
  }),
  demos: (v) => ({
    title: [rules.required(), rules.minLength(3), rules.maxLength(60), rules.noHtml()],
    description: [rules.required(), rules.minLength(10), rules.maxLength(200), rules.noHtml()],
    type: [rules.required(), rules.oneOf(['builtin', 'iframe', 'link'])],
    component: v.type === 'builtin' ? [rules.required('Elegí un componente.')] : [],
    url: v.type !== 'builtin' ? [rules.required(), rules.url()] : [],
    projectId: [rules.required('Asociá la demo a un proyecto.')],
  }),
  services: () => ({
    title: [rules.required(), rules.minLength(3), rules.maxLength(60), rules.noHtml()],
    icon: [rules.required(), (x) => (x && !/^[a-z0-9-]+$/.test(x) ? 'Usá un nombre de Bootstrap Icons (ej: code-slash).' : null)],
    description: [rules.required(), rules.minLength(10), rules.maxLength(200), rules.noHtml()],
    priceFrom: [rules.required(), rules.number({ min: 0, max: 100000000 })],
    featuresText: [rules.maxLength(300)],
  }),
};

const EMPTY = {
  projects: { title: '', summary: '', description: '', techText: '', repoUrl: '', image: '', featured: false },
  demos: { title: '', description: '', type: 'builtin', component: 'weather', url: '', projectId: '' },
  services: { title: '', icon: 'code-slash', description: '', priceFrom: '', featuresText: '' },
};

function ItemForm({ tab, initial, projects, onSave, onCancel }) {
  const f = useForm(initial, SCHEMAS[tab]);
  const submit = (e) => {
    e.preventDefault();
    if (f.validateAll()) onSave(f.values);
  };
  return (
    <form id="item-form" onSubmit={submit} noValidate>
      <FormField label="Título" form={f} name="title" required max={60} />
      {tab === 'projects' && (
        <>
          <FormField label="Resumen" form={f} name="summary" required max={120} />
          <FormField label="Descripción" as="textarea" rows={4} form={f} name="description" required max={1500} />
          <FormField label="Tecnologías" form={f} name="techText" required hint="Separadas por coma: React, Node.js, MySQL" />
          <FormField label="URL del repositorio" type="url" form={f} name="repoUrl" hint="Opcional" />
          <ImageInput value={f.values.image} onChange={(v) => f.setValue('image', v)} error={f.touched.image && f.errors.image} />
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="featured" name="featured" checked={f.values.featured} onChange={f.handleChange} />
            <label className="form-check-label" htmlFor="featured">Destacado en la página de inicio</label>
          </div>
        </>
      )}
      {tab === 'demos' && (
        <>
          <FormField label="Descripción" as="textarea" rows={2} form={f} name="description" required max={200} />
          <FormField label="Proyecto" as="select" form={f} name="projectId" required>
            <option value="">Seleccioná un proyecto…</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </FormField>
          <FormField label="Tipo" as="select" form={f} name="type" required>
            <option value="builtin">Componente interactivo</option>
            <option value="iframe">Embebida (iframe)</option>
            <option value="link">Enlace externo</option>
          </FormField>
          {f.values.type === 'builtin' ? (
            <FormField label="Componente" as="select" form={f} name="component" required>
              {Object.entries(BUILTIN_DEMOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </FormField>
          ) : (
            <FormField label="URL" type="url" form={f} name="url" required />
          )}
        </>
      )}
      {tab === 'services' && (
        <>
          <FormField label="Ícono (Bootstrap Icons)" form={f} name="icon" required hint={<><i className={`bi bi-${f.values.icon} me-1`} />Vista previa</>} />
          <FormField label="Descripción" as="textarea" rows={3} form={f} name="description" required max={200} />
          <FormField label="Precio desde (ARS)" type="number" min={0} form={f} name="priceFrom" required />
          <FormField label="Características" form={f} name="featuresText" hint="Separadas por coma" max={300} />
        </>
      )}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-primary">Guardar</button>
      </div>
    </form>
  );
}

export default function Content() {
  const notify = useToast();
  const [tab, setTab] = useState('projects');
  const [data, setData] = useState({ projects: p0, demos: d0, services: s0 });
  const [editing, setEditing] = useState(null); // { item | null }
  const [deleting, setDeleting] = useState(null);

  const toForm = (item) => {
    if (!item) return EMPTY[tab];
    if (tab === 'projects') return { ...item, techText: item.tech.join(', ') };
    if (tab === 'services') return { ...item, featuresText: (item.features || []).join(', ') };
    return { ...EMPTY.demos, ...item };
  };
  const fromForm = (v) => {
    if (tab === 'projects') return { ...v, tech: v.techText.split(',').map((t) => t.trim()) };
    if (tab === 'services') return { ...v, priceFrom: Number(v.priceFrom), features: v.featuresText.split(',').map((t) => t.trim()).filter(Boolean) };
    return v;
  };

  const save = (values) => {
    const item = fromForm(values);
    setData((d) => ({
      ...d,
      [tab]: editing.item ? d[tab].map((x) => (x.id === editing.item.id ? { ...x, ...item } : x)) : [{ ...item, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...d[tab]],
    }));
    notify(editing.item ? 'Cambios guardados.' : 'Elemento creado.');
    setEditing(null);
  };
  const remove = () => {
    setData((d) => ({ ...d, [tab]: d[tab].filter((x) => x.id !== deleting.id) }));
    notify('Elemento eliminado.', 'info');
    setDeleting(null);
  };

  const projectName = (id) => data.projects.find((p) => p.id === id)?.title || '—';
  const actions = (x) => (
    <td className="text-end text-nowrap">
      <button className="btn btn-sm btn-icon" onClick={() => setEditing({ item: x })} aria-label="Editar"><i className="bi bi-pencil" /></button>
      <button className="btn btn-sm btn-icon text-danger" onClick={() => setDeleting(x)} aria-label="Eliminar"><i className="bi bi-trash" /></button>
    </td>
  );

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4 pf-admin-anim">
        <div><h1 className="h3 font-display mb-1">Contenido</h1><p className="text-muted-2 mb-0">Administrá proyectos, demos y servicios del portfolio.</p></div>
        <button className="btn btn-primary rounded-pill" onClick={() => setEditing({ item: null })}><i className="bi bi-plus-lg me-1" />Nuevo {TABS[tab].slice(0, -1).toLowerCase()}</button>
      </div>
      <div className="nav nav-pills pf-pills mb-3 pf-admin-anim">
        {Object.entries(TABS).map(([k, v]) => (
          <button key={k} className={`nav-link ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{v} <span className="badge ms-1">{data[k].length}</span></button>
        ))}
      </div>
      <div className="pf-card pf-admin-anim">
        <div className="table-responsive">
          <table className="table pf-table align-middle mb-0">
            {tab === 'projects' && (
              <>
                <thead><tr><th>Proyecto</th><th className="d-none d-md-table-cell">Tecnologías</th><th>Estado</th><th /></tr></thead>
                <tbody>{data.projects.map((x) => (
                  <tr key={x.id}>
                    <td><div className="d-flex align-items-center gap-3"><img src={x.image} alt="" className="pf-thumb" /><div><strong>{x.title}</strong><div className="small text-muted-2 d-none d-sm-block">{x.summary}</div></div></div></td>
                    <td className="d-none d-md-table-cell">{x.tech.map((t) => <span key={t} className="badge pf-chip me-1">{t}</span>)}</td>
                    <td>{x.featured ? <span className="badge pf-status pf-status-accent">Destacado</span> : <span className="badge pf-status pf-status-secondary">Publicado</span>}</td>
                    {actions(x)}
                  </tr>
                ))}</tbody>
              </>
            )}
            {tab === 'demos' && (
              <>
                <thead><tr><th>Demo</th><th className="d-none d-md-table-cell">Proyecto</th><th>Tipo</th><th /></tr></thead>
                <tbody>{data.demos.map((x) => (
                  <tr key={x.id}>
                    <td><strong>{x.title}</strong><div className="small text-muted-2">{x.description}</div></td>
                    <td className="d-none d-md-table-cell">{projectName(x.projectId)}</td>
                    <td><span className="badge pf-chip">{{ builtin: 'Interactiva', iframe: 'Iframe', link: 'Enlace' }[x.type]}</span></td>
                    {actions(x)}
                  </tr>
                ))}</tbody>
              </>
            )}
            {tab === 'services' && (
              <>
                <thead><tr><th>Servicio</th><th className="d-none d-md-table-cell">Precio desde</th><th /></tr></thead>
                <tbody>{data.services.map((x) => (
                  <tr key={x.id}>
                    <td><div className="d-flex align-items-center gap-3"><div className="pf-icon-badge"><i className={`bi bi-${x.icon}`} /></div><div><strong>{x.title}</strong><div className="small text-muted-2 d-none d-sm-block">{x.description}</div></div></div></td>
                    <td className="d-none d-md-table-cell">{fmtMoney(x.priceFrom)}</td>
                    {actions(x)}
                  </tr>
                ))}</tbody>
              </>
            )}
          </table>
        </div>
      </div>
      <Modal show={Boolean(editing)} size="modal-lg" title={`${editing?.item ? 'Editar' : 'Nuevo'} · ${TABS[tab]}`} onClose={() => setEditing(null)}>
        {editing && <ItemForm key={editing.item?.id || 'new'} tab={tab} initial={toForm(editing.item)} projects={data.projects} onSave={save} onCancel={() => setEditing(null)} />}
      </Modal>
      <ConfirmModal show={Boolean(deleting)} message={`Se eliminará "${deleting?.title}". Esta acción no se puede deshacer.`} onConfirm={remove} onClose={() => setDeleting(null)} />
    </>
  );
}
