/**
 * Motion constants.
 *
 * Deliberately free of any GSAP import so components can reference the timing
 * language without pulling the animation engine into their chunk.
 */
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
