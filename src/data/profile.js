// Datos del perfil profesional. Editá este archivo con la información real del desarrollador.
export const profile = {
  name: 'Joaquín Buhid',
  role: 'Desarrollador Fullstack',
  location: 'San Miguel de Tucumán, Argentina',
  email: 'contacto@portfolio.dev',
  tagline: 'Construyo aplicaciones web de punta a punta: interfaces cuidadas, APIs robustas y bases de datos bien diseñadas.',
  about:
    'Soy desarrollador fullstack con foco en productos web escalables. Disfruto transformar ideas en soluciones concretas, desde el diseño de la interfaz hasta el despliegue en la nube, cuidando la experiencia de usuario, el rendimiento y la calidad del código.',
  socials: [
    { label: 'GitHub', icon: 'github', url: 'https://github.com/joaquinbuhid' },
    { label: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/' },
  ],
  stats: [
    { value: 3, suffix: '+', label: 'años programando' },
    { value: 20, suffix: '+', label: 'proyectos entregados' },
    { value: 12, suffix: '', label: 'tecnologías en uso' },
  ],
  stack: {
    Frontend: [
      { name: 'React', icon: 'filetype-jsx' },
      { name: 'JavaScript', icon: 'filetype-js' },
      { name: 'HTML5', icon: 'filetype-html' },
      { name: 'CSS / Bootstrap', icon: 'filetype-css' },
      { name: 'GSAP', icon: 'stars' },
    ],
    Backend: [
      { name: 'Node.js', icon: 'hdd-network' },
      { name: 'Express', icon: 'lightning-charge' },
      { name: 'REST APIs', icon: 'plug' },
      { name: 'JWT / OAuth', icon: 'shield-lock' },
    ],
    'Bases de datos': [
      { name: 'MySQL', icon: 'database' },
      { name: 'PostgreSQL', icon: 'database-fill' },
      { name: 'MongoDB', icon: 'collection' },
    ],
    'DevOps y herramientas': [
      { name: 'Git / GitHub', icon: 'git' },
      { name: 'Docker', icon: 'box-seam' },
      { name: 'Vercel / Render', icon: 'cloud-arrow-up' },
    ],
  },
  experience: [
    {
      period: '2025 — Actualidad',
      title: 'Desarrollador Fullstack',
      company: 'Freelance',
      description: 'Desarrollo de aplicaciones web a medida para clientes: e-commerce, paneles de gestión y APIs.',
    },
    {
      period: '2024 — 2025',
      title: 'Desarrollador Frontend',
      company: 'Estudio de software',
      description: 'Maquetación de interfaces responsivas en React y consumo de APIs REST.',
    },
    {
      period: '2023 — Actualidad',
      title: 'Estudiante de Ingeniería en Sistemas',
      company: 'Universidad',
      description: 'Formación en programación, bases de datos, arquitectura de software y metodologías ágiles.',
    },
  ],
};
