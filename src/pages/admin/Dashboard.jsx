import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import Counter from '../../components/Counter';
import { analytics, days, messages } from '../../data/mock';
import { useTheme } from '../../context/ThemeContext';
import { baseOptions, gradientFill, COLORS } from './charts';
import { relativeTime, TYPE_LABELS, STATUS_LABELS, STATUS_COLORS } from '../../utils/format';

export function Kpi({ icon, label, value, delta, color = 'primary' }) {
  return (
    <div className="pf-card pf-kpi p-4 h-100 pf-admin-anim">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="small text-muted-2 mb-1">{label}</div>
          <Counter value={value} className="pf-kpi-value" />
        </div>
        <div className={`pf-icon-badge pf-icon-${color}`}><i className={`bi bi-${icon}`} /></div>
      </div>
      {delta && <div className={`small mt-2 ${delta > 0 ? 'text-success' : 'text-danger'}`}><i className={`bi bi-arrow-${delta > 0 ? 'up' : 'down'}-right`} /> {Math.abs(delta)}% vs. mes anterior</div>}
    </div>
  );
}

export default function Dashboard() {
  const { theme } = useTheme();
  const t = analytics.totals;
  const opts = baseOptions(theme);
  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4 pf-admin-anim">
        <div><h1 className="h3 font-display mb-1">Resumen</h1><p className="text-muted-2 mb-0">Actividad del sitio en los últimos 30 días.</p></div>
        <Link to="/admin/metricas" className="btn btn-outline-primary rounded-pill btn-sm">Ver métricas completas</Link>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><Kpi icon="eye" label="Visitas totales" value={t.visits} delta={12} /></div>
        <div className="col-6 col-xl-3"><Kpi icon="person-check" label="Usuarios registrados" value={t.users} delta={8} color="accent" /></div>
        <div className="col-6 col-xl-3"><Kpi icon="door-open" label="Accesos autenticados" value={t.logins} delta={5} color="sky" /></div>
        <div className="col-6 col-xl-3"><Kpi icon="envelope" label="Consultas recibidas" value={t.messages} delta={-3} color="amber" /></div>
      </div>
      <div className="row g-3">
        <div className="col-xl-8">
          <div className="pf-card p-4 h-100 pf-admin-anim">
            <h2 className="h6 mb-3">Tráfico del sitio</h2>
            <div style={{ height: 300 }}>
              <Line options={opts} data={{ labels: days, datasets: [
                { label: 'Visitas', data: analytics.visits, borderColor: COLORS.primary, backgroundColor: gradientFill(COLORS.primary), fill: true, tension: 0.4, pointRadius: 0 },
                { label: 'Accesos autenticados', data: analytics.logins, borderColor: COLORS.accent, backgroundColor: gradientFill(COLORS.accent), fill: true, tension: 0.4, pointRadius: 0 },
              ] }} />
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="pf-card p-4 h-100 pf-admin-anim">
            <h2 className="h6 mb-3">Tipos de consulta</h2>
            <div style={{ height: 260 }}>
              <Doughnut options={{ ...opts, scales: undefined, cutout: '68%', plugins: { ...opts.plugins, legend: { ...opts.plugins.legend, position: 'bottom' } } }}
                data={{ labels: Object.keys(analytics.byType), datasets: [{ data: Object.values(analytics.byType), backgroundColor: [COLORS.primary, COLORS.accent, COLORS.amber], borderWidth: 0 }] }} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="pf-card p-4 pf-admin-anim">
            <div className="d-flex justify-content-between mb-3"><h2 className="h6 mb-0">Últimas consultas</h2><Link to="/admin/consultas" className="small">Ver todas</Link></div>
            <div className="list-group list-group-flush">
              {messages.slice(0, 5).map((m) => (
                <Link key={m.id} to="/admin/consultas" className="list-group-item list-group-item-action bg-transparent d-flex gap-3 align-items-center px-0">
                  <span className="pf-avatar">{m.name[0]}</span>
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex justify-content-between"><strong className="text-truncate">{m.subject}</strong><small className="text-muted-2 text-nowrap ms-2">{relativeTime(m.createdAt)}</small></div>
                    <div className="small text-muted-2 text-truncate">{m.name} · {TYPE_LABELS[m.type]}</div>
                  </div>
                  <span className={`badge pf-status pf-status-${STATUS_COLORS[m.status]}`}>{STATUS_LABELS[m.status]}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
