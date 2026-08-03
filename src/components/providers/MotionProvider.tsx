'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { CustomCursor } from './CustomCursor';

/**
 * Global motion concerns: Lenis smooth scroll and the custom cursor.
 *
 * Both stand down under reduced motion; Lenis additionally stands down on
 * coarse pointers, where it degrades native momentum scrolling. The page
 * transition wipe is gone with the multi-page structure — the site is one
 * document now, so navigation is an in-page scroll.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();
  const [isCoarsePointer, setIsCoarsePointer] = useState(true);

  useEffect(() => {
    setIsCoarsePointer(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useSmoothScroll({ disabled: prefersReduced || isCoarsePointer });

  return (
    <>
      {children}
      {!prefersReduced && !isCoarsePointer ? <CustomCursor /> : null}
    </>
  );
}
