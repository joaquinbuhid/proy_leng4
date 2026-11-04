// Servidor Node: API (registro, contacto, proyectos) y, en producción, la app ya compilada (build/).
// Hostinger define el puerto en la variable de entorno PORT.
const fs = require('fs');
const path = require('path');

// Variables de entorno desde .env (solo si el archivo existe).
if (fs.existsSync(path.join(__dirname, '.env'))) process.loadEnvFile(path.join(__dirname, '.env'));

const express = require('express');
const auth = require('./api/auth');
const contacto = require('./api/contacto');
const proyectos = require('./api/proyectos');

const app = express();
const PORT = process.env.PORT || 3001;
const buildDir = path.join(__dirname, 'build');
const indexHtml = path.join(buildDir, 'index.html');

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));

app.use('/api/auth', auth.router);
app.use('/api/contacto', contacto.router);
app.use('/api/proyectos', proyectos.router);
app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));

// Errores no previstos de la API (por ejemplo, JSON mal formado).
app.use('/api', (err, req, res, next) => {
  const estado = err.status || 500;
  if (estado >= 500) console.error(err);
  res.status(estado).json({ error: estado >= 500 ? 'Error del servidor.' : 'Pedido inválido.' });
});

if (fs.existsSync(indexHtml)) {
  // Los archivos de /static llevan hash en el nombre, así que se pueden cachear.
  app.use('/static', express.static(path.join(buildDir, 'static'), { maxAge: '1y', immutable: true }));
  app.use(express.static(buildDir));
  app.get('*', (req, res) => res.sendFile(indexHtml));
} else {
  console.warn('No existe build/: solo se sirve la API. Para producción ejecutá "npm run build".');
}

app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});
