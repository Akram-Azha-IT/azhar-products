import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

export interface GsapBundle {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
}

let bundlePromise: Promise<GsapBundle> | null = null;
let loadedBundle: GsapBundle | null = null;

/**
 * Loads GSAP and ScrollTrigger on demand, once per session.
 *
 * Every consumer is an effect that runs after hydration, so there is no reason
 * for ~65 kB of animation engine to sit in the initial payload. Importing it
 * lazily keeps it out of every route's First Load JS, and the module-level
 * promise means the second caller reuses the first caller's request.
 *
 * Callers must tolerate the bundle never arriving: check a cancellation flag
 * after awaiting, and make sure the un-animated state is already the correct
 * one. Nothing may depend on this resolving.
 */
export function loadGsap(): Promise<GsapBundle> {
  bundlePromise ??= (async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);

    gsap.registerPlugin(ScrollTrigger);
    loadedBundle = { gsap, ScrollTrigger };
    return loadedBundle;
  })();

  return bundlePromise;
}

/**
 * The bundle if it has already loaded, otherwise null. Never starts a load.
 *
 * For synchronous paths — a click handler that wants to animate if it can and
 * fall straight through if it cannot.
 */
export function peekGsap(): GsapBundle | null {
  return loadedBundle;
}

export { EASE, DURATION } from './motionTokens';
