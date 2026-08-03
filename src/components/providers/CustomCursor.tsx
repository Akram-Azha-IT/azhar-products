'use client';

import { useEffect, useRef } from 'react';

import { gsap } from '@/lib/gsap';

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label';
const FOLLOW_DURATION = 0.35;
const HOVER_SCALE = 3;

/**
 * Small circle that trails the pointer and swells over interactive elements.
 *
 * Purely decorative: the native cursor is never hidden globally, and nothing
 * here is required to operate the site. Renders only for fine pointers that
 * accept hover, so touch and reduced-motion users never load the behaviour.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const supportsCursor = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    ).matches;
    if (!supportsCursor) return;

    dot.style.opacity = '1';

    const moveX = gsap.quickTo(dot, 'x', {
      duration: FOLLOW_DURATION,
      ease: 'power3',
    });
    const moveY = gsap.quickTo(dot, 'y', {
      duration: FOLLOW_DURATION,
      ease: 'power3',
    });

    const onMove = (event: PointerEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const isInteractive = Boolean(target?.closest(INTERACTIVE));
      gsap.to(dot, {
        scale: isInteractive ? HOVER_SCALE : 1,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      gsap.killTweensOf(dot);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-100 -ml-[6px] -mt-[6px] h-3 w-3 rounded-full bg-teal-deep opacity-0 mix-blend-multiply"
    />
  );
}
