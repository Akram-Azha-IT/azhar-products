'use client';

import { useEffect, type DependencyList } from 'react';

import { loadGsap, type GsapBundle } from '@/lib/gsap';

/**
 * Runs an effect once GSAP has loaded, with the usual cleanup contract.
 *
 * `setup` receives the bundle and may return a teardown function, exactly like
 * `useEffect`. If the component unmounts while the import is still in flight the
 * result is discarded, so a slow network can never run setup against a dead tree.
 *
 * Pass `enabled: false` — reduced motion, wrong breakpoint — and GSAP is not even
 * requested.
 */
export function useGsapEffect(
  setup: (bundle: GsapBundle) => (() => void) | void,
  deps: DependencyList,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    let isCancelled = false;
    let cleanup: (() => void) | void;

    void loadGsap().then((bundle) => {
      if (isCancelled) return;
      cleanup = setup(bundle);
    });

    return () => {
      isCancelled = true;
      cleanup?.();
    };
    // `setup` is intentionally excluded; callers own the dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);
}
