import { useMemo, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { analytics, days } from '../../data/mock';
import { useTheme } from '../../context/ThemeContext';
import { baseOptions, gradientFill, COLORS } from './charts';
import { Kpi } from './Dashboard';

const RANGES = { 7: 'Últimos 7 días', 14: 'Últimos 14 días', 30: 'Últimos 30 días' };

export default function Metrics() {
  const { theme } = useTheme();
  const [range, setRange] = useState(30);
  const [metric, setMetric] = useState('visits');
  const opts = baseOptions(theme);
  const slice = (arr) => arr.slice(-range);
  const sum = (arr) => slice(arr).reduce((a, b) => a + b, 0);

  const series = useMemo(() => ({
    visits: { label: 'Visitas', data: analytics.visits, color: COLORS.primary },
    logins: { label: 'Accesos autenticados', data: analytics.logins, color: COLORS.accent },
    registrations: { label: 'Registros', data: analytics.registrations, color: COLORS.amber },
  }), []);
  const s = series[metric];

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4 pf-admin-anim">
        <div><h1 className="h3 font-display mb-1">Métricas</h1><p className="text-muted-2 mb-0">Consultas parametrizadas sobre el tráfico y la actividad.</p></div>
        <div className="d-flex gap-2">
          <select className="form-select form-select-sm" value={metric} onChange={(e) => setMetric(e.target.value)} aria-label="Métrica">
            {Object.entries(series).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select className="form-select form-select-sm" value={range} onChange={(e) => setRange(Number(e.target.value))} aria-label="Rango">
            {Object.entries(RANGES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><Kpi key={'a' + range} icon="eye" label="Visitas" value={sum(analytics.visits)} /></div>
        <div className="col-6 col-xl-3"><Kpi key={'b' + range} icon="fingerprint" label="Sesiones únicas" value={Math.round(sum(analytics.visits) * 0.52)} color="sky" /></div>
        <div className="col-6 col-xl-3"><Kpi key={'c' + range} icon="door-open" label="Accesos autenticados" value={sum(analytics.logins)} color="accent" /></div>
        <div className="col-6 col-xl-3"><Kpi key={'d' + range} icon="person-plus" label="Registros" value={sum(analytics.registrations)} color="amber" /></div>
      </div>
      <div className="row g-3">
        <div className="col-12">
          <div className="pf-card p-4 pf-admin-anim">
            <h2 className="h6 mb-3">{s.label} por día</h2>
            <div style={{ height: 320 }}>
              <Line options={opts} data={{ labels: slice(days), datasets: [{ label: s.label, data: slice(s.data), borderColor: s.color, backgroundColor: gradientFill(s.color), fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: s.color }] }} />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="pf-card p-4 h-100 pf-admin-anim">
            <h2 className="h6 mb-3">Páginas más visitadas</h2>
            <div style={{ height: 260 }}>
              <Bar options={{ ...opts, indexAxis: 'y', plugins: { ...opts.plugins, legend: { display: false } } }}
                data={{ labels: Object.keys(analytics.byPath), datasets: [{ data: Object.values(analytics.byPath), backgroundColor: [COLORS.primary, COLORS.accent, COLORS.amber, COLORS.sky], borderRadius: 8 }] }} />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="pf-card p-4 h-100 pf-admin-anim">
            <h2 className="h6 mb-3">Consultas más frecuentes</h2>
            <div style={{ height: 260 }}>
              <Doughnut options={{ ...opts, scales: undefined, cutout: '62%', plugins: { ...opts.plugins, legend: { ...opts.plugins.legend, position: 'right' } } }}
                data={{ labels: Object.keys(analytics.byType), datasets: [{ data: Object.values(analytics.byType), backgroundColor: [COLORS.primary, COLORS.accent, COLORS.amber], borderWidth: 0 }] }} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="pf-card p-4 pf-admin-anim">
            <h2 className="h6 mb-3">Flujo de registros vs. accesos</h2>
            <div style={{ height: 260 }}>
              <Bar options={opts} data={{ labels: slice(days), datasets: [
                { label: 'Registros', data: slice(analytics.registrations), backgroundColor: COLORS.amber, borderRadius: 6 },
                { label: 'Accesos', data: slice(analytics.logins), backgroundColor: COLORS.accent, borderRadius: 6 },
              ] }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
