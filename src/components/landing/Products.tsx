'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import type { Locale } from '@/i18n/routing';
import { PRODUCTS } from '@/content/products';
import { useRevealText } from '@/hooks/useRevealText';
import { Blob } from '@/components/ui/Blob';
import { ButtonLink } from '@/components/ui/Button';

/**
 * The product showcase — the reason the page exists.
 *
 * Each format sits on its own pale panel. Hovering (or focusing) a card swaps
 * to the second render of the same format, so the interaction shows the product
 * from another angle rather than decorating for its own sake.
 */
export function Products() {
  const t = useTranslations('landing.products');
  const locale = useLocale() as Locale;
  const titleRef = useRevealText<HTMLHeadingElement>();

  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      className="scroll-mt-24 px-(--spacing-gutter) py-(--spacing-section)"
    >
      <div className="mx-auto max-w-[80rem]">
        <p className="eyebrow text-accent">{t('eyebrow')}</p>
        <h2
          ref={titleRef}
          id="products-heading"
          className="mt-4 max-w-[16ch] text-(length:--text-section) font-semibold"
        >
          {t('title')}
        </h2>
        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted">
          {t('intro')}
        </p>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {PRODUCTS.map((product) => (
            <li key={product.slug}>
              <ProductCard
                name={product.name[locale]}
                description={product.description[locale]}
                primary={product.images[0]}
                secondary={product.images[1]}
                applications={product.applications.map((application) =>
                  t(`applications.${application}`),
                )}
              />
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <ButtonLink href="#contact">{t('cta')}</ButtonLink>
          <p className="text-sm text-muted">{t('ctaNote')}</p>
        </div>
      </div>
    </section>
  );
}

interface ProductCardProps {
  name: string;
  description: string;
  primary: { src: string; alt: Record<Locale, string> };
  secondary?: { src: string; alt: Record<Locale, string> };
  applications: readonly string[];
}

function ProductCard({
  name,
  description,
  primary,
  secondary,
  applications,
}: ProductCardProps) {
  const [isActive, setIsActive] = useState(false);
  const showSecondary = Boolean(secondary) && isActive;

  return (
    <article
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      // Focusable so the second angle is reachable without a pointer.
      tabIndex={0}
      className="group h-full rounded-(--radius-panel) bg-panel p-6 transition-colors duration-[var(--duration-ui)] hover:bg-panel-deep focus-visible:bg-panel-deep sm:p-8"
    >
      {/*
       * White card, because the renders carry a white studio background. On the
       * pale panel they read as hard rectangles; on white they read as plates.
       */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-(--radius-card) bg-paper">
        <Image
          src={showSecondary && secondary ? secondary.src : primary.src}
          alt={primary.alt.en}
          width={900}
          height={1125}
          sizes="(min-width: 768px) 30vw, 90vw"
          className="relative h-full w-auto object-contain transition-transform duration-[var(--duration-reveal)] ease-[var(--ease-brand)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>

      <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">{name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>

      {applications.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {applications.map((application) => (
            <li
              key={application}
              className="rounded-(--radius-pill) bg-paper px-3 py-1.5 text-xs font-medium text-muted"
            >
              {application}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
