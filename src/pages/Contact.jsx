import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useForm } from '../hooks/useForm';
import { useReveal } from '../hooks/useReveal';
import { rules } from '../utils/validators';
import { useToast } from '../context/ToastContext';
import FormField from '../components/FormField';
import { profile } from '../data/profile';
import { TYPE_LABELS } from '../utils/format';

const BUDGETS = ['Menos de $200.000', '$200.000 a $500.000', 'Más de $500.000', 'A definir'];

export default function Contact() {
  const scope = useRef(null);
  const success = useRef(null);
  const { state } = useLocation();
  const notify = useToast();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const initial = {
    name: '', email: '', phone: '',
    type: state?.type || 'general', subject: state?.subject || '', budget: '', message: '', accept: false,
  };

  // El esquema depende del tipo de consulta (el presupuesto solo es obligatorio en cotizaciones).
  const f = useForm(initial, (values) => ({
    name: [rules.required(), rules.name()],
    email: [rules.required(), rules.email(), rules.maxLength(100)],
    phone: [rules.phone()],
    type: [rules.required(), rules.oneOf(Object.keys(TYPE_LABELS))],
    subject: [rules.required(), rules.minLength(5), rules.maxLength(80), rules.noHtml()],
    budget: values.type === 'cotizacion' ? [rules.required('Elegí un rango de presupuesto.'), rules.oneOf(BUDGETS)] : [],
    message: [rules.required(), rules.minLength(20), rules.maxLength(1000), rules.noHtml()],
    accept: [rules.accepted('Debés aceptar que te contactemos por email.')],
  }));

  useReveal(scope);

  const submit = async (e) => {
    e.preventDefault();
    if (honeypot) return; // Bot detectado.
    if (!f.validateAll()) {
      notify('Revisá los campos marcados en rojo.', 'danger');
      scope.current.querySelector('.is-invalid')?.focus();
      return;
    }
    setSending(true);
    try {
      await new Promise((r) => setTimeout(r, 900)); // Simulación visual del envío.
      setSent(true);
      f.reset({ ...initial, subject: '', message: '' });
      requestAnimationFrame(() => gsap.from(success.current, { scale: 0.8, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.7)' }));
    } catch (err) {
      notify(err.message, 'danger');
    } finally {
      setSending(false);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      notify('Email copiado al portapapeles.', 'info');
    } catch {
      notify('No se pudo copiar el email.', 'warning');
    }
  };

  return (
    <div ref={scope} className="pf-page">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-5">
            <span className="pf-eyebrow" data-reveal>Contacto</span>
            <h1 className="pf-section-title" data-reveal>Hablemos de tu <span className="text-gradient">próximo proyecto</span></h1>
            <p className="text-muted-2 fs-5" data-reveal>Escribime para consultas generales, cotizaciones o asesoría técnica. Respondo dentro de las 48 h hábiles.</p>
            <div className="d-grid gap-3 mt-4" data-stagger>
              {Object.entries(TYPE_LABELS).map(([k, label]) => (
                <button key={k} type="button" className={`pf-card pf-type-option p-3 text-start ${f.values.type === k ? 'is-active' : ''}`} onClick={() => f.setValue('type', k)}>
                  <i className={`bi bi-${{ general: 'chat-dots', cotizacion: 'calculator', asesoria: 'lightbulb' }[k]} me-2 text-accent`} />
                  <strong>{label}</strong>
                  <div className="small text-muted-2">{{ general: 'Preguntas, propuestas o colaboraciones.', cotizacion: 'Presupuesto para un desarrollo.', asesoria: 'Ayuda con arquitectura, código o despliegue.' }[k]}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 d-flex align-items-center gap-2" data-reveal>
              <i className="bi bi-envelope text-accent" /> <span>{profile.email}</span>
              <button className="btn btn-sm btn-icon" onClick={copyEmail} aria-label="Copiar email" title="Copiar"><i className="bi bi-clipboard" /></button>
            </div>
          </div>

          <div className="col-lg-7" data-reveal="right">
            <div className="pf-card p-4 p-md-5">
              {sent ? (
                <div ref={success} className="text-center py-5">
                  <div className="pf-success-icon mb-3"><i className="bi bi-check-lg" /></div>
                  <h2 className="h3">¡Mensaje enviado!</h2>
                  <p className="text-muted-2">Gracias por escribir. Te voy a responder a la brevedad por email.</p>
                  <button className="btn btn-outline-primary rounded-pill" onClick={() => setSent(false)}>Enviar otra consulta</button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <div className="row">
                    <div className="col-md-6"><FormField label="Nombre y apellido" form={f} name="name" required autoComplete="name" max={60} /></div>
                    <div className="col-md-6"><FormField label="Email" type="email" form={f} name="email" required autoComplete="email" max={100} /></div>
                    <div className="col-md-6"><FormField label="Teléfono" type="tel" form={f} name="phone" hint="Opcional" autoComplete="tel" max={20} /></div>
                    <div className="col-md-6">
                      <FormField label="Tipo de consulta" as="select" form={f} name="type" required>
                        {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </FormField>
                    </div>
                    {f.values.type === 'cotizacion' && (
                      <div className="col-12">
                        <FormField label="Presupuesto estimado" as="select" form={f} name="budget" required>
                          <option value="">Seleccioná un rango…</option>
                          {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                        </FormField>
                      </div>
                    )}
                    <div className="col-12"><FormField label="Asunto" form={f} name="subject" required max={80} /></div>
                    <div className="col-12"><FormField label="Mensaje" as="textarea" rows={5} form={f} name="message" required max={1000} hint="Mínimo 20 caracteres." /></div>
                  </div>
                  {/* Campo trampa anti-spam: invisible para personas. */}
                  <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" className="pf-honeypot" aria-hidden="true" />
                  <div className="form-check mb-4">
                    <input className={`form-check-input ${f.touched.accept ? (f.errors.accept ? 'is-invalid' : 'is-valid') : ''}`} type="checkbox" id="accept" name="accept" checked={f.values.accept} onChange={f.handleChange} onBlur={f.handleBlur} />
                    <label className="form-check-label small" htmlFor="accept">Acepto ser contactado por email para responder esta consulta.</label>
                    {f.touched.accept && f.errors.accept && <div className="invalid-feedback d-block">{f.errors.accept}</div>}
                  </div>
                  <button className="btn btn-primary btn-lg rounded-pill w-100" disabled={sending}>
                    {sending ? <><span className="spinner-border spinner-border-sm me-2" />Enviando…</> : <>Enviar consulta <i className="bi bi-send ms-1" /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
