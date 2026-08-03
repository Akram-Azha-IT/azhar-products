'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';

import type { Product } from '@/content/products';
import { EASE } from '@/lib/motionTokens';
import { useGsapEffect } from '@/hooks/useGsapEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ProductCard } from './ProductCard';

const STAGGER_S = 0.04;
const DURATION_S = 0.5;

interface ProductGridProps {
  products: readonly Product[];
  /** Changes whenever the filter selection changes; drives the re-entry. */
  signature: string;
  onReset: () => void;
}

export function ProductGrid({
  products,
  signature,
  onReset,
}: ProductGridProps) {
  const t = useTranslations('catalogue');
  const gridRef = useRef<HTMLUListElement>(null);
  const prefersReduced = useReducedMotion();
  const isFirstRender = useRef(true);

  useGsapEffect(
    ({ gsap }) => {
      const grid = gridRef.current;
      if (!grid) return;

      // The first paint is handled by the page's own reveal; only re-filters animate.
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      const context = gsap.context(() => {
        gsap.fromTo(
          grid.children,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION_S,
            ease: EASE.out,
            stagger: STAGGER_S,
            // Never leave a card stuck at opacity 0 if the tween is interrupted.
            clearProps: 'opacity,transform',
          },
        );
      }, grid);

      return () => context.revert();
    },
    [signature],
    !prefersReduced,
  );

  if (products.length === 0) {
    return (
      <div className="border-t border-steel-light/30 py-20 text-center">
        <p className="font-display text-2xl tracking-[-0.02em]">
          {t('empty.title')}
        </p>
        <p className="mx-auto mt-3 max-w-[42ch] text-steel">
          {t('empty.body')}
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 cursor-pointer text-sm tracking-[0.08em] text-accent-strong uppercase underline underline-offset-4"
        >
          {t('empty.reset')}
        </button>
      </div>
    );
  }

  return (
    <ul
      ref={gridRef}
      className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
    >
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
