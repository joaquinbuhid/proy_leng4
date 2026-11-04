import { useEffect, useState } from 'react';

const COLS = [{ id: 'todo', label: 'Por hacer' }, { id: 'doing', label: 'En curso' }, { id: 'done', label: 'Hecho' }];
const KEY = 'pf_demo_kanban';
const initial = [
  { id: 1, text: 'Diseñar la base de datos', col: 'done' },
  { id: 2, text: 'Crear endpoints de la API', col: 'doing' },
  { id: 3, text: 'Maquetar el dashboard', col: 'todo' },
];

// Demo: HTML5 Drag & Drop API + persistencia en localStorage.
export default function KanbanDemo() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || initial; } catch { return initial; }
  });
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [over, setOver] = useState(null);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch {} }, [tasks]);

  const add = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (t.length < 3 || t.length > 60) return setError('La tarea debe tener entre 3 y 60 caracteres.');
    setTasks([...tasks, { id: Date.now(), text: t, col: 'todo' }]);
    setText('');
    setError('');
  };
  const move = (id, col) => setTasks(tasks.map((t) => (t.id === id ? { ...t, col } : t)));

  return (
    <div className="pf-demo-surface p-3 p-md-4">
      <form className="d-flex gap-2 mb-1" onSubmit={add} noValidate>
        <input className={`form-control ${error ? 'is-invalid' : ''}`} placeholder="Nueva tarea…" value={text} maxLength={60} onChange={(e) => setText(e.target.value)} aria-label="Nueva tarea" />
        <button className="btn btn-primary text-nowrap"><i className="bi bi-plus-lg" /> Agregar</button>
      </form>
      <div className="invalid-feedback d-block mb-2" style={{ minHeight: 20 }}>{error}</div>
      <div className="row g-3">
        {COLS.map((c) => (
          <div className="col-md-4" key={c.id}>
            <div className={`pf-kanban-col ${over === c.id ? 'is-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setOver(c.id); }} onDragLeave={() => setOver(null)}
              onDrop={(e) => { move(Number(e.dataTransfer.getData('text/plain')), c.id); setOver(null); }}>
              <div className="d-flex justify-content-between mb-2"><strong>{c.label}</strong><span className="badge bg-secondary-subtle text-body">{tasks.filter((t) => t.col === c.id).length}</span></div>
              {tasks.filter((t) => t.col === c.id).map((t) => (
                <div key={t.id} className="pf-kanban-card" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', t.id)}>
                  <span>{t.text}</span>
                  <span className="d-flex gap-1">
                    <select className="form-select form-select-sm d-md-none" value={t.col} onChange={(e) => move(t.id, e.target.value)} aria-label="Mover a">
                      {COLS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
                    </select>
                    <button className="btn btn-sm btn-link text-danger p-0" onClick={() => setTasks(tasks.filter((x) => x.id !== t.id))} aria-label="Eliminar tarea"><i className="bi bi-trash" /></button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="small text-muted-2 mt-3 mb-0">Arrastrá las tarjetas entre columnas (en celular usá el selector).</p>
    </div>
  );
}
