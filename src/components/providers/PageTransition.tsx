'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';

import { useRouter, usePathname } from '@/i18n/navigation';
import { loadGsap, peekGsap } from '@/lib/gsap';
import { DURATION, EASE } from '@/lib/motionTokens';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PageTransitionValue {
  navigate: (href: string) => void;
}

const PageTransitionContext = createContext<PageTransitionValue>({
  navigate: () => {},
});

export function usePageTransition(): PageTransitionValue {
  return useContext(PageTransitionContext);
}

/**
 * Full-screen teal panel that wipes up to cover the outgoing page, then down to
 * reveal the incoming one.
 *
 * The panel starts and ends off-screen, so a first load never sees it. Under
 * reduced motion — or before GSAP has finished loading — `navigate` degrades to
 * a plain router push and the panel never renders a frame. Navigation is never
 * delayed waiting on an animation library.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const isCovered = useRef(false);

  // Warm the bundle so the first link click is already able to animate.
  useEffect(() => {
    if (prefersReduced) return;
    void loadGsap();
  }, [prefersReduced]);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) return;

      const panel = panelRef.current;
      const bundle = peekGsap();

      if (prefersReduced || !panel || !bundle) {
        router.push(href);
        return;
      }

      isCovered.current = true;
      bundle.gsap.to(panel, {
        yPercent: 0,
        duration: DURATION.transition,
        ease: EASE.inOut,
        onComplete: () => router.push(href),
      });
    },
    [pathname, prefersReduced, router],
  );

  // Reveal the incoming page once the new route has committed.
  useEffect(() => {
    const panel = panelRef.current;
    const bundle = peekGsap();
    if (!panel || !bundle || !isCovered.current) return;

    isCovered.current = false;
    bundle.gsap.to(panel, {
      yPercent: 100,
      duration: DURATION.transition,
      ease: EASE.inOut,
    });

    // Screen readers should land on the new content, not keep stale focus.
    document.getElementById('main')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={panelRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-1000 translate-y-full bg-teal-deep"
      />
    </PageTransitionContext.Provider>
  );
}
