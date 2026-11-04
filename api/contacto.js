// Formulario de contacto: guarda cada consulta en data/messages.json
// y la envía por email si el SMTP está configurado (ver README).
const crypto = require('crypto');
const express = require('express');
const nodemailer = require('nodemailer');
const { modificar } = require('./store');
const limite = require('./limite');

const TIPOS = {
  general: 'Consulta general',
  cotizacion: 'Cotización de proyecto',
  asesoria: 'Asesoría técnica',
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function crearTransporte() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT) || 465;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

const transporte = crearTransporte();
if (!transporte) {
  console.warn('SMTP sin configurar: las consultas se guardan en data/messages.json pero no se envían por email.');
}

const router = express.Router();

router.post('/', limite({ maximo: 5, ventanaMs: 10 * 60 * 1000 }), async (req, res) => {
  const nombre = String(req.body.nombre || '').trim();
  const email = String(req.body.email || '').trim();
  const tipo = String(req.body.tipo || '');
  const mensaje = String(req.body.mensaje || '').trim();

  const errores = {};
  if (nombre.length < 2 || nombre.length > 60) errores.nombre = 'Ingresá tu nombre.';
  if (!EMAIL_RE.test(email) || email.length > 120) errores.email = 'Ingresá un email válido.';
  if (!TIPOS[tipo]) errores.tipo = 'Elegí un tipo de consulta.';
  if (mensaje.length < 10 || mensaje.length > 2000) errores.mensaje = 'El mensaje debe tener entre 10 y 2000 caracteres.';
  if (Object.keys(errores).length) return res.status(400).json({ errores });

  const consulta = {
    id: crypto.randomUUID(),
    nombre,
    email,
    tipo,
    mensaje,
    fecha: new Date().toISOString(),
    enviadoPorEmail: false,
  };

  if (transporte) {
    try {
      await transporte.sendMail({
        from: `"Web Jb_" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_TO || process.env.SMTP_USER,
        replyTo: `"${nombre.replace(/"/g, '')}" <${email}>`,
        subject: `[${TIPOS[tipo]}] Nueva consulta de ${nombre}`,
        text: `Tipo: ${TIPOS[tipo]}\nNombre: ${nombre}\nEmail: ${email}\n\n${mensaje}`,
      });
      consulta.enviadoPorEmail = true;
    } catch (e) {
      console.error('No se pudo enviar el email de contacto:', e.message);
    }
  }

  await modificar('messages', (mensajes) => {
    mensajes.push(consulta);
  });

  res.status(201).json({ ok: true });
});

module.exports = { router };
