import { useEffect, useState } from 'react';
import '../styles/carousel.css';

// Cuántos logos se ven a la vez según el ancho de pantalla.
function visiblesPorAncho() {
  if (window.innerWidth >= 768) return 3;
  if (window.innerWidth >= 480) return 2;
  return 1;
}

export default function LogoCarousel({ items, intervalo = 3000 }) {
  const [visibles, setVisibles] = useState(visiblesPorAncho);
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);

  const pasos = Math.max(1, items.length - visibles + 1);

  useEffect(() => {
    const alCambiar = () => setVisibles(visiblesPorAncho());
    window.addEventListener('resize', alCambiar);
    return () => window.removeEventListener('resize', alCambiar);
  }, []);

  // Si cambia la cantidad de pasos (por el ancho), no quedarse fuera de rango.
  useEffect(() => {
    if (actual > pasos - 1) setActual(pasos - 1);
  }, [actual, pasos]);

  // Avance automático.
  useEffect(() => {
    if (pausado || pasos <= 1) return undefined;
    const id = setInterval(() => setActual((i) => (i + 1) % pasos), intervalo);
    return () => clearInterval(id);
  }, [pausado, pasos, intervalo]);

  const ancho = 100 / visibles;

  return (
    <div
      className="logo-carousel"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      aria-roledescription="carrusel"
      aria-label="Tecnologías"
    >
      <div className="logo-carousel__viewport">
        <ul className="logo-carousel__track" style={{ transform: `translateX(-${actual * ancho}%)` }}>
          {items.map((t, i) => (
            <li
              key={t.name}
              className="logo-carousel__item"
              style={{ flexBasis: `${ancho}%` }}
              aria-hidden={i < actual || i >= actual + visibles}
            >
              <img src={`${process.env.PUBLIC_URL}/logos/${t.logo}`} alt="" />
              <span>{t.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {pasos > 1 && (
        <div className="logo-carousel__dots">
          {Array.from({ length: pasos }, (_, i) => (
            <button
              key={i}
              type="button"
              className={i === actual ? 'is-active' : ''}
              aria-label={`Ir al grupo ${i + 1}`}
              aria-current={i === actual}
              onClick={() => setActual(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
