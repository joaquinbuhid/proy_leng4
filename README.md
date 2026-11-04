# Portfolio Fullstack · Lenguajes 4

Portfolio de nuestro equipo de desarrollo fullstack (Trabajo Práctico Integrador).

## Funcionalidades
- **Presentación:** perfil, tecnologías (carrusel de logos), servicios y experiencia.
- **Contacto por email:** formulario con tipo de consulta (general, cotización de proyecto, asesoría técnica). Cada consulta se guarda en `data/messages.json` y se envía por email si el SMTP está configurado.
- **Proyectos y demos con registro obligatorio:** el listado es público; el detalle y las demos interactivas solo se ven con una cuenta.
- **Registro propio:** usuarios en `data/users.json`, contraseñas encriptadas (scrypt) y sesión con cookie firmada. Sin base de datos.

## Tecnologías
- React 18 (Create React App) + React Router (HashRouter) + Bootstrap 5
- Node.js + Express (`server.js` y carpeta `api/`)
- Nodemailer (envío de emails)

## Estructura
| Carpeta / archivo | Contenido |
|---|---|
| `src/pages` | Páginas: Inicio, Sobre nosotros, Proyectos, Detalle, Contacto, Registro, Ingresar |
| `src/components` | Layout, formularios, carrusel, sesión y demos |
| `src/styles` | Estilos propios |
| `src/profile.js` | Textos del equipo: servicios, tecnologías, experiencia |
| `api/` | Backend: registro e ingreso, contacto, proyectos y guardado en JSON |
| `data/` | Archivos JSON con usuarios y consultas (se crea solo, no se sube a git) |
| `public/logos` | Logos del carrusel |

## Desarrollo
```bash
npm install
npm run dev      # sitio en http://localhost:3000 y API en el puerto 3001
```

## Producción
```bash
npm install
npm run build    # compila la app en /build
npm start        # node server.js: sirve /build y la API en el puerto PORT
```

## Variables de entorno
Ver `.env.example`. En tu PC podés copiarlo como `.env`; en Hostinger se cargan en hPanel.

| Variable | Para qué sirve |
|---|---|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Cuenta de email que envía las consultas (Hostinger: `smtp.hostinger.com`, puerto `465`) |
| `CONTACT_TO` | Email que recibe las consultas (por defecto, `SMTP_USER`) |
| `SESSION_SECRET` | Clave para firmar las sesiones. Si falta, se genera una en `data/secret.txt` |
| `DATA_DIR` | Carpeta de los JSON (por defecto `./data`) |

Sin SMTP configurado el sitio funciona igual: las consultas solo quedan guardadas en `data/messages.json`.

## Despliegue en Hostinger (Node.js)
En hPanel, crear una aplicación Node.js desde el repositorio de GitHub (rama `main`):

| Opción | Valor |
|---|---|
| Versión de Node | 20 o 22 |
| Comando de instalación | `npm install` |
| Comando de build | `npm run build` |
| Archivo de entrada / inicio | `server.js` (o `npm start`) |

El puerto lo asigna Hostinger con `PORT`. La sesión usa una cookie segura, así que el sitio tiene que abrirse con `https://`.

**Importante:** los usuarios y consultas viven en la carpeta `data/`. Si Hostinger reinstala la aplicación desde cero, esa carpeta puede borrarse; para evitarlo, apuntá `DATA_DIR` a una carpeta fuera de la de la aplicación.

## Páginas
| Ruta | Descripción |
|---|---|
| `#/` | Inicio: presentación, tecnologías y servicios |
| `#/sobre-nosotros` | Sobre nosotros, tecnologías y experiencia |
| `#/proyectos` | Listado de proyectos |
| `#/proyectos/:id` | Detalle y demo (requiere registro) |
| `#/contacto` | Formulario de contacto |
| `#/registro` · `#/ingresar` | Crear cuenta e ingresar |

Los proyectos son de ejemplo: se editan en `api/proyectos.js`.
