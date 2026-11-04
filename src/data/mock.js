// Datos de ejemplo fijos para la maqueta visual. Reemplazar por llamadas al backend.
const hueImg = (title, hue) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},80%,55%)"/><stop offset="1" stop-color="hsl(${(hue + 60) % 360},75%,32%)"/></linearGradient></defs><rect width="800" height="450" fill="url(#g)"/><g fill="none" stroke="rgba(255,255,255,.2)" stroke-width="2"><rect x="80" y="70" width="640" height="310" rx="16"/><line x1="80" y1="115" x2="720" y2="115"/><rect x="120" y="150" width="260" height="190" rx="10"/><line x1="420" y1="170" x2="680" y2="170"/><line x1="420" y1="210" x2="640" y2="210"/><line x1="420" y1="250" x2="660" y2="250"/></g><circle cx="110" cy="92" r="7" fill="rgba(255,255,255,.4)"/><circle cx="134" cy="92" r="7" fill="rgba(255,255,255,.3)"/><text x="400" y="420" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="700" fill="rgba(255,255,255,.9)">${title}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};

export const projects = [
  { id: 'tiendanube-lite', title: 'TiendaNube Lite', summary: 'E-commerce con carrito, pagos y panel de stock.', description: 'Tienda online con catálogo filtrable, carrito persistente, checkout con pasarela de pagos y panel administrativo para gestionar productos, stock y pedidos.', tech: ['React', 'Node.js', 'Express', 'MySQL'], image: hueImg('TiendaNube Lite', 260), repoUrl: 'https://github.com/', featured: true, createdAt: '2026-08-12' },
  { id: 'taskflow', title: 'TaskFlow', summary: 'Gestor de tareas estilo kanban en tiempo real.', description: 'Tableros, columnas arrastrables, etiquetas y sincronización en tiempo real entre miembros de un equipo.', tech: ['React', 'Socket.io', 'MongoDB'], image: hueImg('TaskFlow', 160), repoUrl: 'https://github.com/', featured: true, createdAt: '2026-09-02' },
  { id: 'climaya', title: 'ClimaYa', summary: 'Pronóstico del tiempo con geolocalización.', description: 'Consume la API pública de Open-Meteo y la Geolocation API del navegador para mostrar el clima de la ubicación del usuario.', tech: ['JavaScript', 'Fetch API', 'Geolocation'], image: hueImg('ClimaYa', 200), repoUrl: 'https://github.com/', featured: false, createdAt: '2026-09-20' },
  { id: 'turnosmed', title: 'TurnosMed', summary: 'Sistema de turnos para consultorios.', description: 'Reserva de turnos con calendario, recordatorios por email y panel para profesionales.', tech: ['Node.js', 'PostgreSQL', 'Bootstrap'], image: hueImg('TurnosMed', 330), repoUrl: 'https://github.com/', featured: false, createdAt: '2026-10-05' },
];

export const demos = [
  { id: 'd1', title: 'Clima en tu ubicación', description: 'Geolocation API + API de Open-Meteo.', type: 'builtin', component: 'weather', projectId: 'climaya' },
  { id: 'd2', title: 'Tablero de tareas', description: 'Tablero kanban con Drag & Drop API.', type: 'builtin', component: 'kanban', projectId: 'taskflow' },
  { id: 'd3', title: 'Explorador de API REST', description: 'Consulta un endpoint REST público.', type: 'builtin', component: 'api', projectId: 'tiendanube-lite' },
];

export const services = [
  { id: 's1', title: 'Desarrollo web a medida', icon: 'code-slash', description: 'Aplicaciones web completas, del diseño a la puesta en producción.', priceFrom: 350000, features: ['Frontend en React', 'API REST', 'Base de datos', 'Despliegue en la nube'] },
  { id: 's2', title: 'Landing pages', icon: 'window-desktop', description: 'Sitios de presentación rápidos, responsivos y optimizados para SEO.', priceFrom: 120000, features: ['Diseño responsive', 'Animaciones', 'Formulario de contacto'] },
  { id: 's3', title: 'APIs e integraciones', icon: 'plug', description: 'Diseño de APIs y conexión con pagos, email o terceros.', priceFrom: 200000, features: ['Autenticación JWT', 'Documentación', 'Pasarelas de pago'] },
  { id: 's4', title: 'Asesoría técnica', icon: 'lightbulb', description: 'Revisión de arquitectura, código y elección de tecnologías.', priceFrom: 40000, features: ['Videollamadas', 'Informe escrito', 'Plan de mejora'] },
];

const names = ['Lucía Pérez', 'Martín Gómez', 'Sofía Díaz', 'Tomás Ruiz', 'Valentina Sosa', 'Bruno Álvarez', 'Camila Romero', 'Diego Medina'];
const mail = (n) => n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(' ', '.') + '@mail.com';

const subjects = {
  general: ['Consulta sobre disponibilidad', 'Propuesta de colaboración', 'Pregunta sobre un proyecto'],
  cotizacion: ['Presupuesto para tienda online', 'Cotización de landing page', 'Precio de sistema de turnos'],
  asesoria: ['Revisión de arquitectura', 'Elección de base de datos', 'Ayuda con despliegue'],
};
const types = ['general', 'cotizacion', 'asesoria'];
const statuses = ['nuevo', 'nuevo', 'leido', 'respondido', 'archivado'];
export const messages = Array.from({ length: 12 }, (_, i) => {
  const type = types[i % 3];
  const status = statuses[i % 5];
  return {
    id: 'm' + i, name: names[i % 8], email: mail(names[i % 8]), type, subject: subjects[type][i % 3],
    message: 'Hola, me interesa avanzar con este tema. ¿Podríamos coordinar una reunión para conversar los detalles? Muchas gracias.',
    budget: type === 'cotizacion' ? ['Menos de $200.000', '$200.000 a $500.000', 'Más de $500.000'][i % 3] : '',
    status, createdAt: new Date(2026, 10, 4 - i, 10 + (i % 7), 15).toISOString(),
    replies: status === 'respondido' ? [{ body: '¡Hola! Gracias por escribir. Te propongo una reunión el jueves a las 18 h.', by: 'Operador', at: new Date(2026, 10, 5 - i, 9).toISOString() }] : [],
  };
});

export const users = [
  { id: 'u0', name: 'Administrador', email: 'admin@portfolio.dev', role: 'admin', provider: 'local', active: true, createdAt: '2026-09-01', lastLogin: '2026-11-04' },
  { id: 'u1', name: 'Operador', email: 'operador@portfolio.dev', role: 'operator', provider: 'local', active: true, createdAt: '2026-09-02', lastLogin: '2026-11-03' },
  ...names.map((n, i) => ({ id: 'u' + (i + 2), name: n, email: mail(n), role: 'user', provider: i % 3 === 0 ? 'google' : 'local', active: i !== 5, createdAt: `2026-10-${String(3 + i * 3).padStart(2, '0')}`, lastLogin: `2026-11-0${1 + (i % 4)}` })),
];

// Series de 30 días para los gráficos del dashboard.
export const days = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 9, 6 + i);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
});
const wave = (base, amp, k) => days.map((_, i) => Math.max(0, Math.round(base + i * k + Math.sin(i / 2.2) * amp + ((i * 7) % 5))));
export const analytics = {
  visits: wave(18, 6, 0.8),
  logins: wave(3, 2, 0.12),
  registrations: wave(1, 1.4, 0.05),
  byType: { 'Consulta general': 9, 'Cotización': 14, 'Asesoría técnica': 6 },
  byPath: { 'Inicio': 520, 'Proyectos': 240, 'Contacto': 130, 'Servicios': 95 },
  totals: { visits: 1284, uniques: 642, users: 8, logins: 96, messages: 29 },
};

// Usuario de ejemplo que se muestra como "sesión iniciada" en la maqueta.
export const demoUser = { name: 'Administrador', email: 'admin@portfolio.dev', role: 'admin' };
