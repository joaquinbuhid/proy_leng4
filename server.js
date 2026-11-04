// Servidor de producción: sirve la app ya compilada (carpeta build/).
// Hostinger define el puerto en la variable de entorno PORT.
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const buildDir = path.join(__dirname, 'build');
const indexHtml = path.join(buildDir, 'index.html');

if (!fs.existsSync(indexHtml)) {
  console.error('No existe build/index.html. Ejecutá "npm run build" antes de "npm start".');
  process.exit(1);
}

// Archivos estáticos (JS, CSS, imágenes). Los de /static llevan hash, así que se pueden cachear.
app.use('/static', express.static(path.join(buildDir, 'static'), { maxAge: '1y', immutable: true }));
app.use(express.static(buildDir));

// Cualquier otra ruta devuelve la app.
app.get('*', (req, res) => {
  res.sendFile(indexHtml);
});

app.listen(PORT, () => {
  console.log(`Sitio disponible en el puerto ${PORT}`);
});
