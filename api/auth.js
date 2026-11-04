// Registro, ingreso y sesión de usuarios. Los usuarios se guardan en data/users.json
// con la contraseña encriptada (scrypt + salt). La sesión es una cookie firmada.
const crypto = require('crypto');
const express = require('express');
const { leer, modificar, secreto } = require('./store');
const limite = require('./limite');

const COOKIE = 'jb_sesion';
const DURACION_MS = 7 * 24 * 60 * 60 * 1000; // 7 días
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CLAVE = secreto();

function encriptar(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function coincide(password, guardado) {
  const [salt, hash] = guardado.split(':');
  const intento = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(intento, Buffer.from(hash, 'hex'));
}

function firmar(datos) {
  const cuerpo = Buffer.from(JSON.stringify(datos)).toString('base64url');
  const firma = crypto.createHmac('sha256', CLAVE).update(cuerpo).digest('base64url');
  return `${cuerpo}.${firma}`;
}

function verificar(token) {
  if (!token || !token.includes('.')) return null;
  const [cuerpo, firma] = token.split('.');
  const esperada = crypto.createHmac('sha256', CLAVE).update(cuerpo).digest('base64url');
  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const datos = JSON.parse(Buffer.from(cuerpo, 'base64url').toString());
    return datos.exp > Date.now() ? datos : null;
  } catch {
    return null;
  }
}

function leerCookie(req, nombre) {
  const cookies = req.headers.cookie || '';
  const par = cookies.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${nombre}=`));
  return par ? decodeURIComponent(par.slice(nombre.length + 1)) : null;
}

function iniciarSesion(res, usuario) {
  const token = firmar({ uid: usuario.id, exp: Date.now() + DURACION_MS });
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: DURACION_MS,
  });
}

const publico = (u) => ({ id: u.id, nombre: u.nombre, email: u.email });

// Middleware: deja pasar solo a usuarios con sesión válida.
function requiereSesion(req, res, next) {
  const sesion = verificar(leerCookie(req, COOKIE));
  const usuario = sesion && leer('users').find((u) => u.id === sesion.uid);
  if (!usuario) return res.status(401).json({ error: 'Tenés que registrarte o ingresar para ver esto.' });
  req.usuario = usuario;
  next();
}

const router = express.Router();
const limiteAuth = limite({ maximo: 10, ventanaMs: 60 * 1000 });

router.post('/registro', limiteAuth, async (req, res) => {
  const nombre = String(req.body.nombre || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  const errores = {};
  if (nombre.length < 2 || nombre.length > 60) errores.nombre = 'Ingresá tu nombre (2 a 60 caracteres).';
  if (!EMAIL_RE.test(email) || email.length > 120) errores.email = 'Ingresá un email válido.';
  if (password.length < 8 || password.length > 100) errores.password = 'La contraseña debe tener al menos 8 caracteres.';
  if (Object.keys(errores).length) return res.status(400).json({ errores });

  const usuario = await modificar('users', (usuarios) => {
    if (usuarios.some((u) => u.email === email)) return null;
    const nuevo = {
      id: crypto.randomUUID(),
      nombre,
      email,
      password: encriptar(password),
      creado: new Date().toISOString(),
    };
    usuarios.push(nuevo);
    return nuevo;
  });

  if (!usuario) return res.status(409).json({ errores: { email: 'Ya hay una cuenta con ese email. Ingresá.' } });
  iniciarSesion(res, usuario);
  res.status(201).json({ usuario: publico(usuario) });
});

router.post('/ingresar', limiteAuth, (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const usuario = leer('users').find((u) => u.email === email);
  if (!usuario || !coincide(password, usuario.password)) {
    return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
  }
  iniciarSesion(res, usuario);
  res.json({ usuario: publico(usuario) });
});

router.post('/salir', (req, res) => {
  res.clearCookie(COOKIE);
  res.json({ ok: true });
});

router.get('/yo', (req, res) => {
  const sesion = verificar(leerCookie(req, COOKIE));
  const usuario = sesion && leer('users').find((u) => u.id === sesion.uid);
  res.json({ usuario: usuario ? publico(usuario) : null });
});

module.exports = { router, requiereSesion };
