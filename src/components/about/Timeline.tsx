'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import { MILESTONES } from '@/content/milestones';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Eyebrow } from '@/components/ui/Eyebrow';

const DESKTOP_HORIZONTAL =
  '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

/**
 * Milestone timeline.
 *
 * Base rendering is a horizontally scrollable track that works with a finger, a
 * trackpad or the keyboard on every viewport. On desktop, and only when motion
 * is welcome, that track is additionally pinned and driven by vertical scroll.
 *
 * Building it in that order means the mobile experience is a real scroller
 * rather than a disabled version of a desktop effect.
 */
export function Timeline() {
  const t = useTranslations('about.timeline');
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || prefersReduced) return;

    const matcher = gsap.matchMedia();

    matcher.add(DESKTOP_HORIZONTAL, () => {
      const distance = track.scrollWidth - track.clientWidth;
      if (distance <= 0) return;

      const tween = gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${distance}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    ScrollTrigger.refresh();

    return () => matcher.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="timeline-heading"
      className="overflow-hidden bg-off-white py-(--spacing-section)"
    >
      <div className="px-(--spacing-gutter)">
        <Eyebrow index="05">{t('eyebrow')}</Eyebrow>
        <h2
          id="timeline-heading"
          className="mt-6 max-w-[16ch] text-(length:--text-section) font-medium"
        >
          {t('title')}
        </h2>
      </div>

      <ol
        ref={trackRef}
        // Keyboard-reachable so the track can be scrolled without a pointer.
        tabIndex={0}
        className="mt-16 flex gap-8 overflow-x-auto px-(--spacing-gutter) pb-6 lg:overflow-x-visible"
      >
        {MILESTONES.map((milestone) => (
          <li
            key={milestone.key}
            className="w-[18rem] shrink-0 border-t border-teal-mid/30 pt-6"
          >
            <p className="font-display text-4xl tracking-[-0.03em] tabular-nums">
              {milestone.year ?? t('yearPending')}
            </p>
            <h3 className="mt-4 font-display text-xl tracking-[-0.02em]">
              {t(`items.${milestone.key}.title`)}
            </h3>
            <p className="mt-2 leading-relaxed text-teal-body">
              {t(`items.${milestone.key}.body`)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
