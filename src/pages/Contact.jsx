import ContactForm from '../components/ContactForm';
import { profile } from '../profile';

export default function Contact() {
  return (
    <section className="py-5">
      <h1 className="h2 mb-3">Contacto</h1>
      <p className="text-secondary mb-4">
        Completá el formulario o escribinos a <a href={`mailto:${profile.email}`}>{profile.email}</a>.
      </p>
      <ContactForm />
    </section>
  );
}
