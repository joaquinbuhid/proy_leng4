// Llamadas al backend (server.js). Devuelve el JSON o lanza un error con los datos de la respuesta.
export async function api(ruta, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`/api${ruta}`, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw Object.assign(new Error('No se pudo conectar con el servidor.'), { status: 0, datos: {} });
  }
  const datos = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(datos.error || 'Ocurrió un error. Probá de nuevo.'), { status: res.status, datos });
  }
  return datos;
}
