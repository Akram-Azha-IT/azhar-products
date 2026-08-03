'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';

import { useGsapEffect } from '@/hooks/useGsapEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const BASE_DURATION_S = 40;
const MAX_TIME_SCALE = 4;
/** How much scroll velocity (px/s) it takes to reach MAX_TIME_SCALE. */
const VELOCITY_REFERENCE = 2000;

export function Marquee() {
  const t = useTranslations('home.marquee');
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const items = t('items')
    .split('·')
    .map((item) => item.trim())
    .filter(Boolean);

  useGsapEffect(
    ({ gsap, ScrollTrigger }) => {
      const track = trackRef.current;
      if (!track) return;

      const context = gsap.context(() => {
        // The track holds the list twice, so -50% lands exactly on a seam.
        const loop = gsap.to(track, {
          xPercent: -50,
          duration: BASE_DURATION_S,
          ease: 'none',
          repeat: -1,
        });

        const trigger = ScrollTrigger.create({
          trigger: track,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            const boost = Math.min(
              Math.abs(velocity) / VELOCITY_REFERENCE,
              MAX_TIME_SCALE - 1,
            );
            // Scrolling up runs the strip backwards.
            const direction = velocity < 0 ? -1 : 1;
            gsap.to(loop, {
              timeScale: (1 + boost) * direction,
              duration: 0.4,
              overwrite: true,
            });
          },
        });

        return () => {
          trigger.kill();
          loop.kill();
        };
      }, track);

      return () => context.revert();
    },
    [],
    !prefersReduced,
  );

  return (
    <section
      aria-label={t('label')}
      className="overflow-hidden border-y border-teal-mid/30 py-6"
    >
      {/*
       * The list is rendered twice so -50% lands on a seam. Spacing is trailing
       * padding on each item rather than a flex gap, so every item occupies an
       * identical slot width and the loop point is exact.
       */}
      <div ref={trackRef} className="flex w-max will-change-transform">
        {[0, 1].map((copy) =>
          items.map((item) => (
            <span
              key={`${copy}-${item}`}
              aria-hidden={copy === 1}
              className="pr-12 text-sm tracking-[0.08em] whitespace-nowrap text-teal-deep uppercase"
            >
              {item}
            </span>
          )),
        )}
      </div>
    </section>
  );
}
