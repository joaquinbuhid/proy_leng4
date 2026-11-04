import { useMemo, useState } from 'react';
import { users as seed } from '../../data/mock';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../../components/Modal';
import { Kpi } from './Dashboard';
import { fmtDate, ROLE_LABELS } from '../../utils/format';

export default function Users() {
  const notify = useToast();
  const [users, setUsers] = useState(seed);
  const [q, setQ] = useState('');
  const [role, setRole] = useState('all');
  const [deleting, setDeleting] = useState(null);

  const list = useMemo(() => users.filter((u) => (role === 'all' || u.role === role) && (u.name + u.email).toLowerCase().includes(q.toLowerCase())), [users, q, role]);
  const update = (id, patch) => setUsers((xs) => xs.map((u) => (u.id === id ? { ...u, ...patch } : u)));

  return (
    <>
      <div className="mb-4 pf-admin-anim">
        <h1 className="h3 font-display mb-1">Usuarios registrados</h1>
        <p className="text-muted-2 mb-0">Cuentas creadas para acceder a proyectos y demos.</p>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3"><Kpi icon="people" label="Total" value={users.length} /></div>
        <div className="col-6 col-md-3"><Kpi icon="person-check" label="Activos" value={users.filter((u) => u.active).length} color="accent" /></div>
        <div className="col-6 col-md-3"><Kpi icon="google" label="Con Google" value={users.filter((u) => u.provider === 'google').length} color="sky" /></div>
        <div className="col-6 col-md-3"><Kpi icon="shield-lock" label="Staff" value={users.filter((u) => u.role !== 'user').length} color="amber" /></div>
      </div>
      <div className="pf-card pf-admin-anim">
        <div className="p-3 d-flex flex-wrap gap-2 border-bottom pf-border">
          <input className="form-control form-control-sm" style={{ maxWidth: 260 }} placeholder="Buscar por nombre o email…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar usuario" />
          <select className="form-select form-select-sm" style={{ maxWidth: 180 }} value={role} onChange={(e) => setRole(e.target.value)} aria-label="Filtrar por rol">
            <option value="all">Todos los roles</option>
            {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="table-responsive">
          <table className="table pf-table align-middle mb-0">
            <thead><tr><th>Usuario</th><th className="d-none d-md-table-cell">Registro</th><th className="d-none d-lg-table-cell">Último acceso</th><th>Rol</th><th>Activo</th><th /></tr></thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id} className={u.active ? '' : 'opacity-50'}>
                  <td><div className="d-flex align-items-center gap-2"><span className="pf-avatar">{u.name[0]}</span><div className="min-w-0"><strong className="d-block text-truncate">{u.name}</strong><span className="small text-muted-2">{u.email} {u.provider === 'google' && <i className="bi bi-google ms-1" title="Google" />}</span></div></div></td>
                  <td className="d-none d-md-table-cell small">{fmtDate(u.createdAt + 'T12:00', { dateStyle: 'medium' })}</td>
                  <td className="d-none d-lg-table-cell small">{fmtDate(u.lastLogin + 'T12:00', { dateStyle: 'medium' })}</td>
                  <td>
                    <select className="form-select form-select-sm" value={u.role} onChange={(e) => { update(u.id, { role: e.target.value }); notify('Rol actualizado.'); }} aria-label="Rol">
                      {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </td>
                  <td>
                    <div className="form-check form-switch mb-0">
                      <input className="form-check-input" type="checkbox" role="switch" checked={u.active} onChange={() => update(u.id, { active: !u.active })} aria-label="Activo" />
                    </div>
                  </td>
                  <td className="text-end"><button className="btn btn-sm btn-icon text-danger" onClick={() => setDeleting(u)} aria-label="Eliminar"><i className="bi bi-trash" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal show={Boolean(deleting)} message={`Se eliminará la cuenta de ${deleting?.name}.`} onConfirm={() => { setUsers((xs) => xs.filter((x) => x.id !== deleting.id)); setDeleting(null); notify('Usuario eliminado.', 'info'); }} onClose={() => setDeleting(null)} />
    </>
  );
}
