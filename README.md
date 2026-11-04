# Portfolio Fullstack · Lenguajes 4

Landing inicial del portfolio de nuestro equipo de desarrollo fullstack (Trabajo Práctico Integrador).

## Tecnologías
- React 18 (Create React App) + React Router (HashRouter)
- Bootstrap 5
- Node.js + Express (servidor de producción en `server.js`)

## Desarrollo
```bash
npm install
npm run dev      # http://localhost:3000 con recarga automática
```

## Producción
```bash
npm install
npm run build    # compila la app en /build
npm start        # node server.js, sirve /build en el puerto PORT (3000 por defecto)
```

## Despliegue en Hostinger (Node.js)
En hPanel, crear una aplicación Node.js (desde GitHub o subiendo el proyecto sin `node_modules` ni `build`) con esta configuración:

| Opción | Valor |
|---|---|
| Versión de Node | 18 o superior (recomendado 20 o 22) |
| Comando de instalación | `npm install` |
| Comando de build | `npm run build` |
| Archivo de entrada / inicio | `server.js` (o `npm start`) |

El puerto lo asigna Hostinger con la variable de entorno `PORT`; `server.js` ya la usa.

## Páginas
| Ruta | Descripción |
|---|---|
| `#/` | Inicio: presentación |
| `#/sobre-nosotros` | Sobre nosotros, tecnologías y experiencia |
| `#/contacto` | Formulario de contacto |

## Estado
El formulario de contacto valida los datos pero todavía no los envía a ningún servidor. Los datos del equipo se editan en `src/profile.js`.
