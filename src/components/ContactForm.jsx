import { useState } from 'react';
import { api } from '../api';
import Campo from './Campo';

const vacio = { nombre: '', email: '', tipo: 'general', mensaje: '' };

function validar(datos) {
  const errores = {};
  if (datos.nombre.trim().length < 2) errores.nombre = 'Ingresá tu nombre.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim())) errores.email = 'Ingresá un email válido.';
  if (datos.mensaje.trim().length < 10) errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
  if (datos.mensaje.trim().length > 2000) errores.mensaje = 'El mensaje puede tener hasta 2000 caracteres.';
  return errores;
}

export default function ContactForm() {
  const [datos, setDatos] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState({ tipo: 'listo' });

  const cambiar = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
    if (errores[name]) setErrores({ ...errores, [name]: undefined });
    if (estado.tipo !== 'enviando') setEstado({ tipo: 'listo' });
  };

  const enviar = async (e) => {
    e.preventDefault();
    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;
    setEstado({ tipo: 'enviando' });
    try {
      await api('/contacto', { method: 'POST', body: datos });
      setEstado({ tipo: 'enviado' });
      setDatos(vacio);
    } catch (err) {
      if (err.datos?.errores) setErrores(err.datos.errores);
      setEstado({ tipo: 'error', mensaje: err.message });
    }
  };

  return (
    <form onSubmit={enviar} noValidate className="col-lg-7">
      {estado.tipo === 'enviado' && (
        <div className="alert alert-success" role="status">
          ¡Gracias por escribirnos! Te respondemos a la brevedad.
        </div>
      )}
      {estado.tipo === 'error' && !Object.keys(errores).some((k) => errores[k]) && (
        <div className="alert alert-danger" role="alert">{estado.mensaje}</div>
      )}

      <Campo id="nombre" label="Nombre" valor={datos.nombre} error={errores.nombre} onChange={cambiar} autoComplete="name" />
      <Campo id="email" label="Email" type="email" valor={datos.email} error={errores.email} onChange={cambiar} autoComplete="email" />
      <Campo id="tipo" label="Tipo de consulta" as="select" valor={datos.tipo} error={errores.tipo} onChange={cambiar}>
        <option value="general">Consulta general</option>
        <option value="cotizacion">Cotización de proyecto</option>
        <option value="asesoria">Asesoría técnica</option>
      </Campo>
      <Campo id="mensaje" label="Mensaje" as="textarea" rows="5" valor={datos.mensaje} error={errores.mensaje} onChange={cambiar} />

      <button type="submit" className="btn btn-primary" disabled={estado.tipo === 'enviando'}>
        {estado.tipo === 'enviando' ? 'Enviando…' : 'Enviar'}
      </button>
    </form>
  );
}
