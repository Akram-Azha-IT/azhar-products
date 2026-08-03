'use client';

import { useEffect, useRef, type RefObject } from 'react';

import { DURATION, EASE, gsap } from '@/lib/gsap';
import { restoreLines, splitIntoLines } from '@/lib/splitLines';
import { useReducedMotion } from './useReducedMotion';

const STAGGER = 0.06;
const START = 'top 80%';
const RESIZE_DEBOUNCE_MS = 200;

/**
 * Masked line-by-line heading reveal.
 *
 * Attach the returned ref to a text element. Each visual line translates up
 * from 100% behind an `overflow: hidden` mask, staggered by 0.06s, triggered
 * when the element reaches 80% of the viewport.
 *
 * Under reduced motion the element is left completely untouched — no split, no
 * transform — so the text is simply there.
 */
export function useRevealText<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReduced) return;

    let resizeTimer: number | undefined;

    const context = gsap.context(() => {
      const build = () => {
        const lines = splitIntoLines(element);
        if (lines.length === 0) return;

        gsap.fromTo(
          lines,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: DURATION.reveal,
            ease: EASE.out,
            stagger: STAGGER,
            scrollTrigger: { trigger: element, start: START, once: true },
          },
        );
      };

      build();

      // Re-split on resize: line breaks move, so the masks must follow.
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          context.revert();
          build();
        }, RESIZE_DEBOUNCE_MS);
      };

      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, element);

    return () => {
      window.clearTimeout(resizeTimer);
      context.revert();
      restoreLines(element);
    };
  }, [prefersReduced]);

  return ref;
}
