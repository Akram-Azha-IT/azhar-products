'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { CAPABILITY_KEYS } from '@/content/categories';
import { TRUST_STATS } from '@/content/company';
import { PRODUCTS } from '@/content/products';
import { useRevealText } from '@/hooks/useRevealText';
import { useRevealImage } from '@/hooks/useRevealImage';
import { Counter } from '@/components/ui/Counter';
import { Blob, Sparkle } from '@/components/ui/Blob';

/** A second render of the wide tub, used as the section's anchor image. */
const FEATURE_RENDER = PRODUCTS[0].images[1];

export function Expertise() {
  const t = useTranslations('landing.expertise');
  const titleRef = useRevealText<HTMLHeadingElement>();
  const { ref: imageRef, innerRef } = useRevealImage<
    HTMLDivElement,
    HTMLDivElement
  >();

  return (
    <section
      id="expertise"
      aria-labelledby="expertise-heading"
      className="scroll-mt-24 px-(--spacing-gutter) py-(--spacing-section)"
    >
      <div className="mx-auto max-w-[80rem]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow text-accent">{t('eyebrow')}</p>
            <h2
              ref={titleRef}
              id="expertise-heading"
              className="mt-4 max-w-[15ch] text-(length:--text-section) font-semibold"
            >
              {t('title')}
            </h2>
            <p className="mt-6 max-w-[50ch] text-lg leading-relaxed text-muted">
              {t('body')}
            </p>

            <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {CAPABILITY_KEYS.map((key) => (
                <li key={key}>
                  <h3 className="flex items-center gap-2 text-base font-semibold">
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {t(`items.${key}.body`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div
            ref={imageRef}
            className="relative overflow-hidden rounded-(--radius-panel) bg-panel p-10 sm:p-14"
          >
            <Blob tone="accent" className="-top-16 -left-12 h-64 w-64" />
            <Sparkle className="top-10 right-10 h-5 w-5 text-accent-bright" />
            <div
              ref={innerRef}
              className="relative overflow-hidden rounded-(--radius-card) bg-paper p-4 shadow-[0_18px_40px_-24px_rgba(16,21,28,0.35)]"
            >
              <Image
                src={FEATURE_RENDER.src}
                alt={FEATURE_RENDER.alt.en}
                width={1280}
                height={1600}
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>

        {/* Trust numbers. Each renders an em dash until the real figure lands. */}
        <dl className="mt-16 grid gap-4 sm:grid-cols-3">
          {TRUST_STATS.map((stat) => (
            <div
              key={stat.key}
              className="rounded-(--radius-card) bg-panel px-8 py-10"
            >
              <dd className="text-5xl font-semibold tracking-[-0.03em] tabular-nums">
                <Counter
                  value={stat.value}
                  pending={t('statsPending')}
                  suffix={stat.suffix}
                />
              </dd>
              <dt className="mt-3 text-sm text-muted">
                {t(`stats.${stat.key}`)}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
