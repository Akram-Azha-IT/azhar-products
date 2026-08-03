'use client';

import { useEffect, useState } from 'react';

const HERO_THRESHOLD_VH = 0.9;
const DIRECTION_DELTA_PX = 8;

export interface ScrollState {
  /** Scrolled past roughly one viewport — the hero is behind us. */
  isPastHero: boolean;
  /** Last meaningful direction. Used to hide/reveal the nav bar. */
  isScrollingDown: boolean;
}

/**
 * Reports scroll position and direction, sampled once per animation frame so
 * the listener never runs layout work per scroll event.
 */
export function useScrollDirection(): ScrollState {
  const [state, setState] = useState<ScrollState>({
    isPastHero: false,
    isScrollingDown: false,
  });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;

      setState((previous) => {
        const isPastHero = y > window.innerHeight * HERO_THRESHOLD_VH;
        const isScrollingDown =
          Math.abs(delta) < DIRECTION_DELTA_PX
            ? previous.isScrollingDown
            : delta > 0;

        if (
          previous.isPastHero === isPastHero &&
          previous.isScrollingDown === isScrollingDown
        ) {
          return previous;
        }
        return { isPastHero, isScrollingDown };
      });

      if (Math.abs(delta) >= DIRECTION_DELTA_PX) lastY = y;
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}
