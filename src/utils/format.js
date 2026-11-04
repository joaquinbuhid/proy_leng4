export const fmtDate = (iso, opts = { dateStyle: 'medium', timeStyle: 'short' }) =>
  new Intl.DateTimeFormat('es-AR', opts).format(new Date(iso));

export const fmtMoney = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

export const relativeTime = (iso) => {
  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
  const diff = (new Date(iso) - new Date()) / 1000;
  const units = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [u, s] of units) if (Math.abs(diff) >= s) return rtf.format(Math.round(diff / s), u);
  return 'recién';
};

export const TYPE_LABELS = { general: 'Consulta general', cotizacion: 'Cotización', asesoria: 'Asesoría técnica' };
export const STATUS_LABELS = { nuevo: 'Nuevo', leido: 'Leído', respondido: 'Respondido', archivado: 'Archivado' };
export const STATUS_COLORS = { nuevo: 'accent', leido: 'secondary', respondido: 'success', archivado: 'dark' };
export const ROLE_LABELS = { admin: 'Administrador', operator: 'Operador', user: 'Usuario' };
