import { useState } from 'react';

const RECURSOS = { users: 10, posts: 100, todos: 200, comments: 500 };

// Demo: consumo de una API REST pública (JSONPlaceholder) con validación de parámetros.
export default function ApiExplorerDemo() {
  const [recurso, setRecurso] = useState('users');
  const [id, setId] = useState('1');
  const [error, setError] = useState('');
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);

  const consultar = async (e) => {
    e.preventDefault();
    if (id && (!/^\d+$/.test(id) || +id < 1 || +id > RECURSOS[recurso])) {
      return setError(`El ID debe ser un número entre 1 y ${RECURSOS[recurso]}, o quedar vacío.`);
    }
    setError('');
    setCargando(true);
    const inicio = performance.now();
    try {
      const r = await fetch(`https://jsonplaceholder.typicode.com/${recurso}${id ? `/${id}` : '?_limit=3'}`);
      const json = await r.json();
      setRespuesta({ estado: r.status, ms: Math.round(performance.now() - inicio), json });
    } catch {
      setRespuesta({ estado: 'Error', ms: 0, json: { error: 'No se pudo conectar con la API.' } });
    }
    setCargando(false);
  };

  return (
    <>
      <form className="row g-2 align-items-start" onSubmit={consultar} noValidate>
        <div className="col-auto"><span className="badge text-bg-success fs-6 mt-1">GET</span></div>
        <div className="col-sm-4">
          <select className="form-select" aria-label="Recurso" value={recurso} onChange={(e) => setRecurso(e.target.value)}>
            {Object.keys(RECURSOS).map((r) => <option key={r} value={r}>/{r}</option>)}
          </select>
        </div>
        <div className="col-sm-3">
          <input
            className={`form-control${error ? ' is-invalid' : ''}`}
            aria-label="ID"
            placeholder="ID (opcional)"
            inputMode="numeric"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <div className="col-sm-auto">
          <button type="submit" className="btn btn-primary w-100" disabled={cargando}>
            {cargando ? 'Consultando…' : 'Enviar'}
          </button>
        </div>
        {error && <div className="col-12 invalid-feedback d-block">{error}</div>}
      </form>

      {respuesta && (
        <div className="mt-3">
          <div className="small mb-2">
            Estado: <strong className={respuesta.estado === 200 ? 'text-success' : 'text-danger'}>{respuesta.estado}</strong> · {respuesta.ms} ms
          </div>
          <pre className="bg-body-tertiary border rounded p-3 small mb-0" style={{ maxHeight: 320, overflow: 'auto' }}>
            {JSON.stringify(respuesta.json, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
}
