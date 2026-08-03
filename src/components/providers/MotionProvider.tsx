'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { CustomCursor } from './CustomCursor';
import { PageTransitionProvider } from './PageTransition';

/**
 * Owns every global motion concern: Lenis, the custom cursor and the page
 * transition wipe. All three are opt-out under reduced motion; Lenis
 * additionally stands down on coarse pointers, where it degrades native
 * momentum scrolling.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();
  const [isCoarsePointer, setIsCoarsePointer] = useState(true);

  useEffect(() => {
    setIsCoarsePointer(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useSmoothScroll({ disabled: prefersReduced || isCoarsePointer });

  return (
    <PageTransitionProvider>
      {children}
      {!prefersReduced && !isCoarsePointer ? <CustomCursor /> : null}
    </PageTransitionProvider>
  );
}
