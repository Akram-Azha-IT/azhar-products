'use client';

import { useGsapEffect } from './useGsapEffect';

const LERP = 0.08;

interface UseSmoothScrollOptions {
  /** Skip Lenis entirely (reduced motion, or coarse pointer). */
  disabled: boolean;
}

/**
 * Drives Lenis from `gsap.ticker` so ScrollTrigger and Lenis share one RAF
 * loop instead of competing for frames.
 *
 * Lenis is imported lazily alongside GSAP — native scrolling is already correct,
 * so there is nothing to wait for and no reason to block first paint on it.
 *
 * Disabled on reduced motion and on touch devices, where Lenis fights the
 * platform's native momentum scrolling.
 */
export function useSmoothScroll({ disabled }: UseSmoothScrollOptions): void {
  useGsapEffect(
    ({ gsap, ScrollTrigger }) => {
      let cleanup: (() => void) | undefined;
      let isCancelled = false;

      void import('lenis').then(({ default: Lenis }) => {
        if (isCancelled) return;

        const lenis = new Lenis({ lerp: LERP });
        lenis.on('scroll', ScrollTrigger.update);

        const onTick = (time: number) => {
          // gsap.ticker reports seconds; Lenis expects milliseconds.
          lenis.raf(time * 1000);
        };

        gsap.ticker.add(onTick);
        gsap.ticker.lagSmoothing(0);

        cleanup = () => {
          gsap.ticker.remove(onTick);
          gsap.ticker.lagSmoothing(500, 33);
          lenis.destroy();
        };
      });

      return () => {
        isCancelled = true;
        cleanup?.();
      };
    },
    [],
    !disabled,
  );
}
