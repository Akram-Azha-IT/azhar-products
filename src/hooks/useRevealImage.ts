'use client';

import { useRef, type RefObject } from 'react';

import { DURATION, EASE } from '@/lib/motionTokens';
import { useGsapEffect } from './useGsapEffect';
import { useReducedMotion } from './useReducedMotion';

/**
 * Clip-path wipe with a counter-scaling inner element.
 *
 * Attach `ref` to the clipping wrapper and `innerRef` to the media inside it:
 * the wrapper wipes open from the bottom while the media settles from 1.15 to
 * 1, so the image appears to be uncovered rather than to slide.
 *
 * The wrapper is unclipped at rest, so the media is visible before this runs
 * and if it never runs.
 */
export function useRevealImage<
  T extends HTMLElement,
  I extends HTMLElement = HTMLElement,
>(): { ref: RefObject<T | null>; innerRef: RefObject<I | null> } {
  const ref = useRef<T>(null);
  const innerRef = useRef<I>(null);
  const prefersReduced = useReducedMotion();

  useGsapEffect(
    ({ gsap }) => {
      const wrapper = ref.current;
      if (!wrapper) return;

      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: wrapper, start: 'top 85%', once: true },
        });

        timeline.fromTo(
          wrapper,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: DURATION.reveal,
            ease: EASE.out,
          },
        );

        if (innerRef.current) {
          timeline.fromTo(
            innerRef.current,
            { scale: 1.15 },
            { scale: 1, duration: DURATION.reveal, ease: EASE.out },
            0,
          );
        }
      }, wrapper);

      return () => context.revert();
    },
    [],
    !prefersReduced,
  );

  return { ref, innerRef };
}
