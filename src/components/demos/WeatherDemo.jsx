import { useState } from 'react';

const CODIGOS = {
  0: 'Despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado', 3: 'Nublado',
  45: 'Niebla', 48: 'Niebla', 51: 'Llovizna', 53: 'Llovizna', 55: 'Llovizna',
  61: 'Lluvia', 63: 'Lluvia', 65: 'Lluvia fuerte', 80: 'Chaparrones', 81: 'Chaparrones',
  82: 'Chaparrones fuertes', 95: 'Tormenta',
};
const SALTA = { lat: -24.786, lon: -65.412, etiqueta: 'Salta (predeterminado)' };

// Demo: Geolocation API + API pública de Open-Meteo.
export default function WeatherDemo() {
  const [estado, setEstado] = useState({ tipo: 'inicio' });

  const cargar = async ({ lat, lon, etiqueta }) => {
    setEstado({ tipo: 'cargando' });
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      setEstado({ tipo: 'ok', datos: await res.json(), etiqueta });
    } catch {
      setEstado({ tipo: 'error' });
    }
  };

  const ubicar = () => {
    if (!navigator.geolocation) return cargar(SALTA);
    setEstado({ tipo: 'cargando' });
    navigator.geolocation.getCurrentPosition(
      (p) => cargar({ lat: p.coords.latitude.toFixed(3), lon: p.coords.longitude.toFixed(3), etiqueta: 'Tu ubicación' }),
      () => cargar(SALTA),
      { timeout: 8000 }
    );
  };

  if (estado.tipo === 'inicio') {
    return (
      <div className="text-center py-3">
        <p>Usamos tu ubicación (o Salta, si no das permiso) para consultar el clima.</p>
        <button type="button" className="btn btn-primary" onClick={ubicar}>Ver el clima</button>
      </div>
    );
  }
  if (estado.tipo === 'cargando') {
    return <div className="text-center py-4"><span className="spinner-border" role="status" aria-label="Cargando" /></div>;
  }
  if (estado.tipo === 'error') {
    return (
      <div className="alert alert-danger mb-0">
        No se pudo obtener el clima. Revisá tu conexión.{' '}
        <button type="button" className="btn btn-sm btn-link p-0 align-baseline" onClick={ubicar}>Reintentar</button>
      </div>
    );
  }

  const { datos, etiqueta } = estado;
  return (
    <>
      <div className="display-5 fw-bold">{Math.round(datos.current.temperature_2m)}°C</div>
      <div>{CODIGOS[datos.current.weather_code] || 'Variable'} · {etiqueta}</div>
      <div className="small text-secondary">
        Humedad {datos.current.relative_humidity_2m}% · Viento {datos.current.wind_speed_10m} km/h
      </div>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5 g-2 mt-3">
        {datos.daily.time.map((d, i) => (
          <div className="col" key={d}>
            <div className="border rounded p-2 text-center h-100 small">
              <div className="text-capitalize fw-semibold">
                {new Date(`${d}T12:00`).toLocaleDateString('es-AR', { weekday: 'short' })}
              </div>
              <div>{CODIGOS[datos.daily.weather_code[i]] || 'Variable'}</div>
              <div>{Math.round(datos.daily.temperature_2m_max[i])}° / {Math.round(datos.daily.temperature_2m_min[i])}°</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
