'use client';

import { useRef, type RefObject } from 'react';

import { useGsapEffect } from './useGsapEffect';
import { useReducedMotion } from './useReducedMotion';

/** Total travel is capped so parallax stays a texture, not an effect. */
const MAX_TRAVEL_PX = 80;

interface UseParallaxOptions {
  /** <1 lags behind the scroll (backgrounds), >1 leads it (foreground shots). */
  speed?: number;
}

export function useParallax<T extends HTMLElement>({
  speed = 0.85,
}: UseParallaxOptions = {}): RefObject<T | null> {
  const ref = useRef<T>(null);
  const prefersReduced = useReducedMotion();

  useGsapEffect(
    ({ gsap, ScrollTrigger }) => {
      const element = ref.current;
      if (!element) return;

      const travel = gsap.utils.clamp(
        -MAX_TRAVEL_PX,
        MAX_TRAVEL_PX,
        (1 - speed) * MAX_TRAVEL_PX * 2,
      );

      const context = gsap.context(() => {
        gsap.fromTo(
          element,
          { y: -travel / 2 },
          {
            y: travel / 2,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }, element);

      ScrollTrigger.refresh();

      return () => context.revert();
    },
    [speed],
    !prefersReduced,
  );

  return ref;
}
