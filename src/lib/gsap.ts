import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/*
 * Single registration point. Only ScrollTrigger is imported — every other GSAP
 * plugin stays out of the bundle. Import `gsap`/`ScrollTrigger` from here, not
 * from the package, so registration is guaranteed to have run.
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const EASE = {
  out: 'power3.out',
  inOut: 'power3.inOut',
  ui: 'power2.out',
} as const;

export const DURATION = {
  ui: 0.4,
  transition: 0.6,
  reveal: 1.2,
} as const;

export { gsap, ScrollTrigger };
