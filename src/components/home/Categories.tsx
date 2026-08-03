'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { useGsapEffect } from '@/hooks/useGsapEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useRevealText } from '@/hooks/useRevealText';
import { CATEGORIES, type Category } from '@/content/categories';
import { PRODUCTS } from '@/content/products';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ButtonLink } from '@/components/ui/Button';
import { CategoryImage } from '@/components/ui/CategoryImage';

const DESKTOP_PINNED =
  '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

/** Derived from the catalogue so the tile count can never drift from reality. */
function countFor(slug: Category['slug']): number {
  return PRODUCTS.filter((product) => product.category === slug).length;
}

export function Categories() {
  const t = useTranslations('home.categories');
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRevealText<HTMLHeadingElement>();
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReduced = useReducedMotion();

  useGsapEffect(
    ({ gsap, ScrollTrigger }) => {
      const section = sectionRef.current;
      if (!section) return;

      const matcher = gsap.matchMedia();

      /*
       * Desktop only: pin the section and step through the four families as the
       * user scrolls. Below 1024px — and under reduced motion — the same markup
       * falls back to a plain stacked list, which is why the fallback is the
       * default rendering rather than something this effect has to undo.
       */
      matcher.add(DESKTOP_PINNED, () => {
        const steps = CATEGORIES.length;

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: `+=${(steps - 1) * 100}%`,
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            const index = Math.min(
              steps - 1,
              Math.floor(self.progress * steps * 0.999),
            );
            setActiveIndex((previous) =>
              previous === index ? previous : index,
            );
          },
        });

        return () => trigger.kill();
      });

      return () => matcher.revert();
    },
    [],
    !prefersReduced,
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="categories-heading"
      className="bg-paper px-(--spacing-gutter) py-(--spacing-section) lg:flex lg:min-h-dvh lg:flex-col lg:justify-center"
    >
      <Eyebrow index="01">{t('eyebrow')}</Eyebrow>
      <h2
        ref={titleRef}
        id="categories-heading"
        className="mt-6 max-w-[16ch] text-(length:--text-section) font-medium"
      >
        {t('title')}
      </h2>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-24">
        <ol className="flex flex-col">
          {CATEGORIES.map((category, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={category.slug}
                className="border-t border-steel-light/30 py-6 last:border-b"
              >
                {/* Mobile shows every image inline; desktop uses the pinned pane. */}
                <div className="mb-6 lg:hidden">
                  <CategoryImage
                    src={category.image}
                    expectedPath={`/products/${category.slug}/category.webp`}
                    alt={t(`items.${category.slug}.name`)}
                    sizes="100vw"
                  />
                </div>

                <div className="flex items-baseline justify-between gap-6">
                  <h3
                    className={`font-display text-3xl tracking-[-0.03em] transition-colors duration-[var(--duration-ui)] md:text-4xl ${
                      isActive ? 'text-ink' : 'text-steel lg:text-steel-light'
                    }`}
                  >
                    {t(`items.${category.slug}.name`)}
                  </h3>
                  <span className="eyebrow shrink-0 text-steel">
                    {countFor(category.slug) || t('skuPending')} {t('skuLabel')}
                  </span>
                </div>

                <p className="mt-3 max-w-[46ch] text-steel">
                  {t(`items.${category.slug}.descriptor`)}
                </p>
              </li>
            );
          })}
        </ol>

        {/* Cross-fading pane — desktop only, decorative duplicate of the list images. */}
        <div aria-hidden className="relative hidden lg:block">
          {CATEGORIES.map((category, index) => (
            <div
              key={category.slug}
              className={`transition-opacity duration-[var(--duration-reveal)] ease-[var(--ease-brand)] ${
                index === activeIndex
                  ? 'opacity-100'
                  : 'pointer-events-none absolute inset-0 opacity-0'
              }`}
            >
              <CategoryImage
                src={category.image}
                expectedPath={`/products/${category.slug}/category.webp`}
                alt=""
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <ButtonLink href="/products" variant="ghost">
          {t('cta')}
        </ButtonLink>
      </div>
    </section>
  );
}
