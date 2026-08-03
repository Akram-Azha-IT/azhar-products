'use client';

import { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';

import { EASE, gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const DURATION_S = 1.4;

interface CounterProps {
  /** `null` means the real figure has not been confirmed — renders `pending`. */
  value: number | null;
  /** Shown when `value` is null, e.g. an em dash. */
  pending: string;
  suffix?: string;
}

/**
 * Counts up once when scrolled into view.
 *
 * The final value is rendered server-side, so the number is correct before any
 * JS runs and stays correct under reduced motion — the animation only ever
 * rewrites a value that is already there.
 */
export function Counter({ value, pending, suffix = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const locale = useLocale();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReduced || value === null) return;

    const format = new Intl.NumberFormat(locale);
    const counter = { current: 0 };

    const context = gsap.context(() => {
      gsap.to(counter, {
        current: value,
        duration: DURATION_S,
        ease: EASE.out,
        scrollTrigger: { trigger: element, start: 'top 85%', once: true },
        onUpdate: () => {
          element.textContent = format.format(Math.round(counter.current));
        },
        onComplete: () => {
          element.textContent = format.format(value);
        },
      });
    }, element);

    ScrollTrigger.refresh();

    return () => {
      context.revert();
      element.textContent = format.format(value);
    };
  }, [value, locale, prefersReduced]);

  if (value === null) {
    return <span aria-label={pending}>{pending}</span>;
  }

  return (
    <span>
      <span ref={ref}>{new Intl.NumberFormat(locale).format(value)}</span>
      {suffix}
    </span>
  );
}
