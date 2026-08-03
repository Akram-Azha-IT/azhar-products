'use client';

import { useTranslations } from 'next-intl';

import { useRevealText } from '@/hooks/useRevealText';
import { useParallax } from '@/hooks/useParallax';
import { ButtonLink } from '@/components/ui/Button';
import { CategoryImage } from '@/components/ui/CategoryImage';

export function Hero() {
  const t = useTranslations('home.hero');
  const headlineRef = useRevealText<HTMLHeadingElement>();
  const imageRef = useParallax<HTMLDivElement>({ speed: 1.1 });

  return (
    <section className="relative flex min-h-dvh flex-col justify-end overflow-hidden pt-32 pb-16">
      <div className="grid items-end gap-12 px-(--spacing-gutter) lg:grid-cols-[55fr_45fr]">
        <div className="max-w-[18ch]">
          <h1
            ref={headlineRef}
            className="text-(length:--text-hero) font-medium text-ink"
          >
            {t('headline')}
          </h1>

          <p className="mt-8 max-w-[46ch] text-lg leading-relaxed text-steel">
            {t('subline')}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/contact" variant="primary">
              {t('primaryCta')}
            </ButtonLink>
            <ButtonLink href="/products" variant="ghost">
              {t('secondaryCta')}
            </ButtonLink>
          </div>
        </div>

        <div ref={imageRef} className="w-full">
          <CategoryImage
            src="/products/dairy/yogurt-cup-tall-1.webp"
            expectedPath="/products/dairy/yogurt-cup-tall-1.webp"
            alt={t('imageAlt')}
            ratio="3/4"
            sizes="(min-width: 1024px) 45vw, 100vw"
            priority
          />
        </div>
      </div>

      <p
        aria-hidden
        className="eyebrow mt-16 px-(--spacing-gutter) text-steel"
      >
        ↓ {t('scrollCue')}
      </p>
    </section>
  );
}
