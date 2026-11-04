// Guardado simple en archivos JSON dentro de la carpeta data/.
// Cada archivo es un array de objetos. Las escrituras se hacen de a una
// y pasan por un archivo temporal, así un corte no deja el JSON roto.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

let cola = Promise.resolve();

function ruta(nombre) {
  return path.join(DATA_DIR, `${nombre}.json`);
}

function leer(nombre) {
  try {
    return JSON.parse(fs.readFileSync(ruta(nombre), 'utf8'));
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

function escribir(nombre, datos) {
  const destino = ruta(nombre);
  const temporal = `${destino}.${process.pid}.tmp`;
  fs.writeFileSync(temporal, JSON.stringify(datos, null, 2));
  fs.renameSync(temporal, destino);
}

// Lee, modifica y guarda un archivo sin que dos pedidos se pisen.
function modificar(nombre, cambio) {
  const tarea = cola.then(() => {
    const datos = leer(nombre);
    const resultado = cambio(datos);
    escribir(nombre, datos);
    return resultado;
  });
  cola = tarea.catch(() => {});
  return tarea;
}

// Clave para firmar las sesiones: la de la variable de entorno o una generada y guardada.
function secreto() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  const archivo = path.join(DATA_DIR, 'secret.txt');
  try {
    return fs.readFileSync(archivo, 'utf8').trim();
  } catch {
    const nuevo = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync(archivo, nuevo);
    return nuevo;
  }
}

module.exports = { leer, modificar, secreto, DATA_DIR };
