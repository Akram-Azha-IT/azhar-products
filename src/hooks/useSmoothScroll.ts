'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

import { gsap, ScrollTrigger } from '@/lib/gsap';

const LERP = 0.08;

interface UseSmoothScrollOptions {
  /** Skip Lenis entirely (reduced motion, or coarse pointer). */
  disabled: boolean;
}

/**
 * Drives Lenis from `gsap.ticker` so ScrollTrigger and Lenis share one RAF
 * loop instead of competing for frames.
 *
 * Disabled on reduced-motion and on touch devices, where Lenis fights the
 * platform's native momentum scrolling.
 */
export function useSmoothScroll({ disabled }: UseSmoothScrollOptions): void {
  useEffect(() => {
    if (disabled) return;

    const lenis = new Lenis({ lerp: LERP });

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => {
      // gsap.ticker reports seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [disabled]);
}
