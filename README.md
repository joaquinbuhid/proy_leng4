# Portfolio Fullstack · Lenguajes 4

Frontend (maqueta visual) del Trabajo Práctico Integrador: portfolio de un desarrollador fullstack con sitio público, registro, proyectos/demos y panel de gestión.

## Tecnologías
- React 18 (Create React App) + React Router (HashRouter, compatible con GitHub Pages)
- Bootstrap 5 + Bootstrap Icons (framework CSS)
- GSAP + ScrollTrigger (animaciones)
- Chart.js + react-chartjs-2 (gráficos)

## Cómo correrlo
```bash
npm install
npm start        # http://localhost:3000
npm run build    # genera /build para desplegar
```

## Pantallas
| Ruta | Descripción |
|---|---|
| `#/` | Inicio: hero, sobre mí, stack, servicios, experiencia |
| `#/contacto` | Formulario de contacto (consulta, cotización, asesoría) |
| `#/proyectos` · `#/proyectos/:id` | Listado y detalle con demos interactivas |
| `#/login` · `#/registro` | Ingreso y registro |
| `#/estilo` | Guía de estilo (paleta, tipografía, componentes) |
| `#/admin` | Panel: resumen, consultas, contenido (CRUD), usuarios, métricas |

## Estado
Solo frontend. Los datos son de ejemplo (`src/data/mock.js`) y los formularios validan pero no envían a ningún servidor. El perfil se edita en `src/data/profile.js`.
