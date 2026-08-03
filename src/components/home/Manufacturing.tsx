'use client';

import { useTranslations } from 'next-intl';

import { TRUST_STATS } from '@/content/company';
import { useRevealImage } from '@/hooks/useRevealImage';
import { useRevealText } from '@/hooks/useRevealText';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ButtonLink } from '@/components/ui/Button';
import { Counter } from '@/components/ui/Counter';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';

export function Manufacturing() {
  const t = useTranslations('home.manufacturing');
  const titleRef = useRevealText<HTMLHeadingElement>();
  const { ref: imageRef, innerRef } = useRevealImage<
    HTMLDivElement,
    HTMLDivElement
  >();

  return (
    <section
      aria-labelledby="manufacturing-heading"
      className="bg-navy-deep px-(--spacing-gutter) py-(--spacing-section) text-paper"
    >
      <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
        <div>
          <Eyebrow index="02" className="!text-paper/70">
            {t('eyebrow')}
          </Eyebrow>
          <h2
            ref={titleRef}
            id="manufacturing-heading"
            className="mt-6 max-w-[18ch] text-(length:--text-section) font-medium"
          >
            {t('title')}
          </h2>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-paper/80">
            {t('body')}
          </p>
          <div className="mt-10">
            <ButtonLink href="/about" variant="ghost">
              {t('cta')}
            </ButtonLink>
          </div>
        </div>

        <div ref={imageRef} className="overflow-hidden">
          <div ref={innerRef}>
            <PlaceholderImage
              filename="/facility/production-line.webp"
              ratio="4/3"
            />
          </div>
        </div>
      </div>

      <dl className="mt-(--spacing-section) grid gap-10 border-t border-paper/20 pt-12 sm:grid-cols-3">
        {TRUST_STATS.map((stat) => (
          <div key={stat.key}>
            <dt className="eyebrow text-paper/70">
              {t(`stats.${stat.key}`)}
            </dt>
            <dd className="mt-3 font-display text-5xl tracking-[-0.03em] tabular-nums md:text-6xl">
              <Counter
                value={stat.value}
                pending={t('statsPending')}
                suffix={stat.suffix}
              />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
