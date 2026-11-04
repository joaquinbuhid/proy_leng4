import { useEffect, useState } from 'react';

const COLUMNAS = [
  { id: 'todo', nombre: 'Por hacer' },
  { id: 'doing', nombre: 'En curso' },
  { id: 'done', nombre: 'Hecho' },
];
const CLAVE = 'jb_demo_kanban';
const INICIAL = [
  { id: 1, texto: 'Diseñar la base de datos', col: 'done' },
  { id: 2, texto: 'Crear los endpoints de la API', col: 'doing' },
  { id: 3, texto: 'Maquetar el panel', col: 'todo' },
];

function cargarGuardadas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || INICIAL;
  } catch {
    return INICIAL;
  }
}

// Demo: Drag & Drop API + guardado en localStorage.
export default function KanbanDemo() {
  const [tareas, setTareas] = useState(cargarGuardadas);
  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');
  const [sobre, setSobre] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(tareas));
    } catch {
      // Sin almacenamiento disponible: la demo sigue funcionando en memoria.
    }
  }, [tareas]);

  const agregar = (e) => {
    e.preventDefault();
    const t = texto.trim();
    if (t.length < 3 || t.length > 60) return setError('La tarea debe tener entre 3 y 60 caracteres.');
    setTareas([...tareas, { id: Date.now(), texto: t, col: 'todo' }]);
    setTexto('');
    setError('');
  };

  const mover = (id, col) => setTareas(tareas.map((t) => (t.id === id ? { ...t, col } : t)));
  const borrar = (id) => setTareas(tareas.filter((t) => t.id !== id));

  return (
    <>
      <form className="d-flex gap-2" onSubmit={agregar} noValidate>
        <input
          className={`form-control${error ? ' is-invalid' : ''}`}
          placeholder="Nueva tarea…"
          aria-label="Nueva tarea"
          value={texto}
          maxLength={60}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button type="submit" className="btn btn-primary text-nowrap">Agregar</button>
      </form>
      {error && <div className="invalid-feedback d-block">{error}</div>}

      <div className="row g-3 mt-1">
        {COLUMNAS.map((c) => (
          <div className="col-md-4" key={c.id}>
            <div
              className={`rounded p-2 h-100 ${sobre === c.id ? 'bg-primary-subtle' : 'bg-body-tertiary'}`}
              style={{ minHeight: 140 }}
              onDragOver={(e) => { e.preventDefault(); setSobre(c.id); }}
              onDragLeave={() => setSobre(null)}
              onDrop={(e) => { mover(Number(e.dataTransfer.getData('text/plain')), c.id); setSobre(null); }}
            >
              <div className="d-flex justify-content-between mb-2 small fw-semibold">
                <span>{c.nombre}</span>
                <span className="text-secondary">{tareas.filter((t) => t.col === c.id).length}</span>
              </div>
              {tareas.filter((t) => t.col === c.id).map((t) => (
                <div
                  key={t.id}
                  className="bg-white border rounded p-2 mb-2 small d-flex justify-content-between align-items-center gap-2"
                  style={{ cursor: 'grab' }}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', String(t.id))}
                >
                  <span>{t.texto}</span>
                  <span className="d-flex gap-1 align-items-center">
                    <select
                      className="form-select form-select-sm d-md-none"
                      aria-label="Mover a"
                      value={t.col}
                      onChange={(e) => mover(t.id, e.target.value)}
                    >
                      {COLUMNAS.map((x) => <option key={x.id} value={x.id}>{x.nombre}</option>)}
                    </select>
                    <button type="button" className="btn-close btn-sm" aria-label="Eliminar tarea" onClick={() => borrar(t.id)} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="small text-secondary mt-3 mb-0">Arrastrá las tarjetas entre columnas (en celular usá el selector).</p>
    </>
  );
}
