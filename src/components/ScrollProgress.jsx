import { useEffect, useRef } from 'react';

// Barra de progreso de lectura en la parte superior.
export default function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf;
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div ref={ref} className="pf-scroll-progress" aria-hidden="true" />;
}
