import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Número que cuenta hacia arriba al entrar en pantalla.
export default function Counter({ value, suffix = '', duration = 1.6, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const obj = { n: 0 };
    const tween = gsap.to(obj, {
      n: value, duration, ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start: 'top 95%' },
      onUpdate: () => { if (ref.current) ref.current.textContent = Math.round(obj.n).toLocaleString('es-AR') + suffix; },
    });
    return () => tween.kill();
  }, [value, suffix, duration]);
  return <span ref={ref} className={className}>0{suffix}</span>;
}
