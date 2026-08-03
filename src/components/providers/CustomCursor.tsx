'use client';

import { useRef } from 'react';

import { useGsapEffect } from '@/hooks/useGsapEffect';

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label';
const FOLLOW_DURATION = 0.35;
const HOVER_SCALE = 3;

/**
 * Small circle that trails the pointer and swells over interactive elements.
 *
 * Purely decorative: the native cursor is never hidden, and nothing here is
 * required to operate the site. The parent only renders this for fine pointers
 * that accept hover and welcome motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useGsapEffect(({ gsap }) => {
    const dot = dotRef.current;
    if (!dot) return;

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
      dot.style.opacity = '0';
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-100 -ml-[6px] -mt-[6px] h-3 w-3 rounded-full bg-shell opacity-0 mix-blend-multiply"
    />
  );
}
