'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

import type { Locale } from '@/i18n/routing';
import type { Product } from '@/content/products';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('catalogue');

  const [primary, secondary] = product.images;

  return (
    <article className="group">
      <TransitionLink
        href={`/products/${product.slug}`}
        className="block focus-visible:outline-offset-4"
      >
        <div className="relative overflow-hidden bg-off-white transition-colors duration-[var(--duration-ui)] group-hover:bg-white">
          {primary ? (
            <>
              <Image
                src={primary.src}
                alt={primary.alt[locale]}
                width={1200}
                height={1500}
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                className="w-full transition-transform duration-[var(--duration-reveal)] ease-[var(--ease-brand)] group-hover:scale-104 motion-reduce:transition-none"
              />
              {/* Second angle, revealed on hover. Decorative — the first image carries the alt text. */}
              {secondary ? (
                <Image
                  src={secondary.src}
                  alt=""
                  aria-hidden
                  width={1200}
                  height={1500}
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                  className="absolute inset-0 w-full opacity-0 transition-opacity duration-[var(--duration-ui)] group-hover:opacity-100 motion-reduce:transition-none"
                />
              ) : null}
            </>
          ) : (
            <PlaceholderImage
              filename={`/products/${product.category}/${product.slug}-1.webp`}
              ratio="4/5"
            />
          )}
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl tracking-[-0.02em]">
              {product.name[locale]}
            </h3>
            <p className="mt-1 text-sm text-teal-body">
              {product.capacityMl === null
                ? t('specPending')
                : t('capacity', { value: product.capacityMl })}
            </p>
          </div>

          <span
            aria-hidden
            className="mt-1 inline-block transition-transform duration-[var(--duration-ui)] ease-[var(--ease-brand)] group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </div>

        {product.material ? (
          <span className="mt-3 inline-block border border-teal-mid/40 px-2 py-1 text-xs tracking-[0.08em] text-teal-body uppercase">
            {product.material}
          </span>
        ) : null}
      </TransitionLink>
    </article>
  );
}
