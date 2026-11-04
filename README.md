Somos un equipo de desarrollo fullstack con foco en productos web escalables. Nos gusta transformar ideas en soluciones concretas, desde el diseño de la interfaz hasta el despliegue en la nube, cuidando la experiencia de usuario, el rendimiento y la calidad del código.
Salta, Argentina

Portfolio Fullstack · Lenguajes 4

Portfolio de nuestro equipo de desarrollo fullstack (Trabajo Práctico Integrador).

Funcionalidades
- **Presentación:** perfil, tecnologías (carrusel de logos), servicios y experiencia.
- **Contacto por email:** formulario con tipo de consulta (general, cotización de proyecto, asesoría técnica). Cada consulta se guarda en `data/messages.json` y se envía por email si el SMTP está configurado.
- **Proyectos y demos con registro obligatorio:** el listado es público; el detalle y las demos interactivas solo se ven con una cuenta.
- **Registro propio:** usuarios en `data/users.json`, contraseñas encriptadas (scrypt) y sesión con cookie firmada. Sin base de datos.

Tecnologías
- React 18 (Create React App) + React Router (HashRouter) + Bootstrap 5
- Node.js + Express (`server.js` y carpeta `api/`)
- Nodemailer (envío de emails)

Estructura
| Carpeta / archivo | Contenido |
|---|---|
| `src/pages` | Páginas: Inicio, Sobre nosotros, Proyectos, Detalle, Contacto, Registro, Ingresar |
| `src/components` | Layout, formularios, carrusel, sesión y demos |
| `src/styles` | Estilos propios |
| `src/profile.js` | Textos del equipo: servicios, tecnologías, experiencia |
| `api/` | Backend: registro e ingreso, contacto, proyectos y guardado en JSON |
| `data/` | Archivos JSON con usuarios y consultas (se crea solo, no se sube a git) |
| `public/logos` | Logos del carrusel |

