import { useState } from 'react';

const vacio = { nombre: '', email: '', asunto: 'Consulta', mensaje: '' };

function validar(datos) {
  const errores = {};
  if (datos.nombre.trim().length < 2) errores.nombre = 'Ingresá tu nombre.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim())) errores.email = 'Ingresá un email válido.';
  if (datos.mensaje.trim().length < 10) errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
  return errores;
}

export default function ContactForm() {
  const [datos, setDatos] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
    if (errores[name]) setErrores({ ...errores, [name]: undefined });
    setEnviado(false);
  };

  const enviar = (e) => {
    e.preventDefault();
    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;
    // Por ahora no hay backend: solo se confirma en pantalla.
    setEnviado(true);
    setDatos(vacio);
  };

  const clase = (campo) => `form-control${errores[campo] ? ' is-invalid' : ''}`;

  return (
    <form onSubmit={enviar} noValidate className="col-lg-7">
      {enviado && (
        <div className="alert alert-success" role="status">
          ¡Gracias por escribirnos! Te respondemos a la brevedad.
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre</label>
        <input id="nombre" name="nombre" className={clase('nombre')} value={datos.nombre} onChange={cambiar} />
        <div className="invalid-feedback">{errores.nombre}</div>
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input id="email" name="email" type="email" className={clase('email')} value={datos.email} onChange={cambiar} />
        <div className="invalid-feedback">{errores.email}</div>
      </div>

      <div className="mb-3">
        <label htmlFor="asunto" className="form-label">Asunto</label>
        <select id="asunto" name="asunto" className="form-select" value={datos.asunto} onChange={cambiar}>
          <option>Consulta</option>
          <option>Presupuesto</option>
          <option>Otro</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="mensaje" className="form-label">Mensaje</label>
        <textarea id="mensaje" name="mensaje" rows="5" className={clase('mensaje')} value={datos.mensaje} onChange={cambiar} />
        <div className="invalid-feedback">{errores.mensaje}</div>
      </div>

      <button type="submit" className="btn btn-primary">Enviar</button>
    </form>
  );
}
