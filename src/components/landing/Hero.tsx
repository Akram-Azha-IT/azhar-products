'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { PRODUCTS } from '@/content/products';
import { useRevealText } from '@/hooks/useRevealText';
import { useParallax } from '@/hooks/useParallax';
import { ButtonLink } from '@/components/ui/Button';
import { Blob, Sparkle } from '@/components/ui/Blob';

/** The three renders that float on the hero panel, largest first. */
const SHOWCASE = PRODUCTS.map((product) => product.images[0]);

export function Hero() {
  const t = useTranslations('landing.hero');
  const headlineRef = useRevealText<HTMLHeadingElement>();
  const floatRef = useParallax<HTMLDivElement>({ speed: 1.08 });

  return (
    <section className="px-(--spacing-gutter) pt-32 pb-16 sm:pt-40">
      <div className="mx-auto max-w-[80rem]">
        <h1
          ref={headlineRef}
          className="max-w-[14ch] text-(length:--text-hero) font-semibold text-ink"
        >
          {t('headline')}
        </h1>

        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[46ch] text-lg leading-relaxed text-muted">
            {t('subline')}
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="#contact">{t('primaryCta')}</ButtonLink>
            <ButtonLink href="#products" variant="soft">
              {t('secondaryCta')}
            </ButtonLink>
          </div>
        </div>

        {/* The showpiece: renders floating on a soft panel. */}
        <div className="relative mt-14 overflow-hidden rounded-(--radius-panel) bg-panel px-6 py-14 sm:px-12 sm:py-20">
          <Blob className="-top-24 -left-16 h-72 w-72 bg-panel-deep" />
          <Blob tone="accent" className="-right-10 -bottom-24 h-80 w-80" />
          <Sparkle className="top-16 right-[18%] h-6 w-6 text-accent-bright" />
          <Sparkle className="bottom-20 left-[12%] h-4 w-4 text-accent-bright/70" />

          <div
            ref={floatRef}
            className="relative flex flex-wrap items-end justify-center gap-6 sm:gap-12"
          >
            {SHOWCASE.map((render, index) => (
              <div
                key={render.src}
                /*
                 * Middle render sits largest and slightly higher, so the group
                 * reads as an arrangement rather than a row.
                 *
                 * Each sits on a WHITE rounded card: the renders are shot on a
                 * white sweep, so on the pale panel they otherwise showed as
                 * hard white rectangles. The card turns that seam into a
                 * deliberate studio plate.
                 */
                className={`overflow-hidden rounded-(--radius-card) bg-paper p-4 shadow-[0_18px_40px_-24px_rgba(16,21,28,0.35)] ${
                  index === 1
                    ? 'w-[46%] max-w-[26rem] sm:-translate-y-6'
                    : 'w-[26%] max-w-[16rem]'
                }`}
              >
                <Image
                  src={render.src}
                  alt={render.alt.en}
                  width={1280}
                  height={1600}
                  priority={index === 1}
                  sizes="(min-width: 1024px) 30vw, 45vw"
                  className="h-auto w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
