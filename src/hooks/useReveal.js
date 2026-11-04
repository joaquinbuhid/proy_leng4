import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
 * Anima con GSAP + ScrollTrigger los elementos con:
 *   data-reveal="up|left|right|zoom"  → entrada al hacer scroll
 *   data-stagger                        → hijos en cascada
 *   data-parallax="0.2"                 → desplazamiento parallax
 */
export function useReveal(scopeRef, deps = []) {
  useLayoutEffect(() => {
    if (!scopeRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const from = { up: { y: 50 }, left: { x: -60 }, right: { x: 60 }, zoom: { scale: 0.9 } };
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          ...from[el.dataset.reveal || 'up'], autoAlpha: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });
      gsap.utils.toArray('[data-stagger]').forEach((el) => {
        gsap.from(el.children, {
          y: 40, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        gsap.to(el, {
          yPercent: -100 * parseFloat(el.dataset.parallax || 0.2), ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    }, scopeRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
