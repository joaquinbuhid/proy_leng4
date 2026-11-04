import { useState } from 'react';

const CODES = { 0: ['Despejado', 'sun'], 1: ['Mayormente despejado', 'sun'], 2: ['Parcialmente nublado', 'cloud-sun'], 3: ['Nublado', 'clouds'], 45: ['Niebla', 'cloud-fog'], 48: ['Niebla', 'cloud-fog'], 51: ['Llovizna', 'cloud-drizzle'], 53: ['Llovizna', 'cloud-drizzle'], 55: ['Llovizna', 'cloud-drizzle'], 61: ['Lluvia', 'cloud-rain'], 63: ['Lluvia', 'cloud-rain'], 65: ['Lluvia fuerte', 'cloud-rain-heavy'], 80: ['Chaparrones', 'cloud-rain'], 81: ['Chaparrones', 'cloud-rain'], 82: ['Chaparrones', 'cloud-rain-heavy'], 95: ['Tormenta', 'cloud-lightning-rain'] };
const FALLBACK = { lat: -26.8083, lon: -65.2176, label: 'San Miguel de Tucumán (predeterminado)' };

// Demo: Geolocation API + Fetch a la API pública de Open-Meteo.
export default function WeatherDemo() {
  const [state, setState] = useState({ status: 'idle' });

  const load = async ({ lat, lon, label }) => {
    setState({ status: 'loading' });
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      setState({ status: 'ok', data: await res.json(), label });
    } catch {
      setState({ status: 'error', message: 'No se pudo obtener el clima. Revisá tu conexión.' });
    }
  };

  const locate = () => {
    if (!navigator.geolocation) return load(FALLBACK);
    setState({ status: 'loading' });
    navigator.geolocation.getCurrentPosition(
      (p) => load({ lat: p.coords.latitude.toFixed(3), lon: p.coords.longitude.toFixed(3), label: 'Tu ubicación actual' }),
      () => load(FALLBACK),
      { timeout: 8000 }
    );
  };

  const { status, data, label, message } = state;
  return (
    <div className="pf-demo-surface p-4">
      {status === 'idle' && (
        <div className="text-center py-4">
          <i className="bi bi-geo-alt fs-1 text-accent" />
          <p className="mt-2">Usaremos tu ubicación (o Tucumán si no das permiso) para consultar el clima.</p>
          <button className="btn btn-primary rounded-pill" onClick={locate}>Ver el clima</button>
        </div>
      )}
      {status === 'loading' && <div className="text-center py-5"><span className="spinner-border" /></div>}
      {status === 'error' && <div className="alert alert-danger">{message} <button className="btn btn-sm btn-link" onClick={locate}>Reintentar</button></div>}
      {status === 'ok' && (
        <>
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <i className={`bi bi-${(CODES[data.current.weather_code] || ['', 'cloud'])[1]} display-3 text-accent`} />
            <div>
              <div className="display-5 fw-bold font-display">{Math.round(data.current.temperature_2m)}°C</div>
              <div>{(CODES[data.current.weather_code] || ['Variable'])[0]} · {label}</div>
              <div className="small text-muted-2">Humedad {data.current.relative_humidity_2m}% · Viento {data.current.wind_speed_10m} km/h</div>
            </div>
          </div>
          <div className="row row-cols-3 row-cols-md-5 g-2 mt-3">
            {data.daily.time.map((d, i) => (
              <div className="col" key={d}>
                <div className="pf-card p-2 text-center h-100">
                  <div className="small text-capitalize">{new Date(d + 'T12:00').toLocaleDateString('es-AR', { weekday: 'short' })}</div>
                  <i className={`bi bi-${(CODES[data.daily.weather_code[i]] || ['', 'cloud'])[1]} fs-4`} />
                  <div className="small">{Math.round(data.daily.temperature_2m_max[i])}° / {Math.round(data.daily.temperature_2m_min[i])}°</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
