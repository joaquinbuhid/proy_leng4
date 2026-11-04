import { useState } from 'react';

const RESOURCES = { posts: 100, users: 10, todos: 200, comments: 500 };

// Demo: consumo de una API REST pública (JSONPlaceholder) con validación de parámetros.
export default function ApiExplorerDemo() {
  const [resource, setResource] = useState('users');
  const [id, setId] = useState('1');
  const [error, setError] = useState('');
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async (e) => {
    e.preventDefault();
    if (id && (!/^\d+$/.test(id) || +id < 1 || +id > RESOURCES[resource])) {
      return setError(`El ID debe ser un número entre 1 y ${RESOURCES[resource]}, o quedar vacío.`);
    }
    setError('');
    setLoading(true);
    const t0 = performance.now();
    try {
      const r = await fetch(`https://jsonplaceholder.typicode.com/${resource}${id ? '/' + id : '?_limit=3'}`);
      const json = await r.json();
      setRes({ status: r.status, ms: Math.round(performance.now() - t0), json });
    } catch {
      setRes({ status: 'Error', ms: 0, json: { error: 'No se pudo conectar con la API.' } });
    }
    setLoading(false);
  };

  return (
    <div className="pf-demo-surface p-3 p-md-4">
      <form className="row g-2 align-items-start" onSubmit={run} noValidate>
        <div className="col-auto"><span className="badge bg-success fs-6 mt-1">GET</span></div>
        <div className="col-sm-4">
          <select className="form-select" value={resource} onChange={(e) => setResource(e.target.value)} aria-label="Recurso">
            {Object.keys(RESOURCES).map((r) => <option key={r} value={r}>/{r}</option>)}
          </select>
        </div>
        <div className="col-sm-3">
          <input className={`form-control ${error ? 'is-invalid' : ''}`} value={id} onChange={(e) => setId(e.target.value)} placeholder="ID (opcional)" aria-label="ID" inputMode="numeric" />
        </div>
        <div className="col-sm-auto"><button className="btn btn-primary w-100" disabled={loading}>{loading ? <span className="spinner-border spinner-border-sm" /> : 'Enviar'}</button></div>
        {error && <div className="col-12 invalid-feedback d-block">{error}</div>}
      </form>
      {res && (
        <div className="mt-3">
          <div className="small mb-2">Estado: <strong className={res.status === 200 ? 'text-success' : 'text-danger'}>{res.status}</strong> · {res.ms} ms</div>
          <pre className="pf-code mb-0">{JSON.stringify(res.json, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
