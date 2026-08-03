'use client';

import { useRef, type RefObject } from 'react';

import { DURATION, EASE } from '@/lib/motionTokens';
import { restoreLines, splitIntoLines } from '@/lib/splitLines';
import { useGsapEffect } from './useGsapEffect';
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
 * The element is fully readable before this runs and if it never runs — the
 * split only happens once GSAP has actually loaded.
 */
export function useRevealText<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  const prefersReduced = useReducedMotion();

  useGsapEffect(
    ({ gsap }) => {
      const element = ref.current;
      if (!element) return;

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
    },
    [],
    !prefersReduced,
  );

  return ref;
}
