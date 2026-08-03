'use client';

import { useTranslations } from 'next-intl';

import { useRevealText } from '@/hooks/useRevealText';

const QUESTION_KEYS = [
  'custom',
  'moq',
  'materials',
  'lidding',
  'leadTime',
] as const;

/**
 * FAQ built on native `<details>`.
 *
 * No JS state, no ARIA to get wrong, keyboard and screen-reader behaviour comes
 * free, and every answer is present in the DOM for search engines.
 */
export function Faq() {
  const t = useTranslations('landing.faq');
  const titleRef = useRevealText<HTMLHeadingElement>();

  return (
    <section
      aria-labelledby="faq-heading"
      className="px-(--spacing-gutter) py-(--spacing-section)"
    >
      <div className="mx-auto grid max-w-[80rem] gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2
            ref={titleRef}
            id="faq-heading"
            className="mt-4 max-w-[14ch] text-(length:--text-section) font-semibold"
          >
            {t('title')}
          </h2>
        </div>

        <ul>
          {QUESTION_KEYS.map((key) => (
            <li key={key}>
              <details className="group border-b border-line py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium marker:hidden">
                  {t(`items.${key}.q`)}
                  <span
                    aria-hidden
                    className="relative h-4 w-4 shrink-0 text-accent"
                  >
                    <span className="absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 bg-current" />
                    <span className="absolute top-0 left-1/2 h-4 w-0.5 -translate-x-1/2 bg-current transition-transform duration-[var(--duration-ui)] group-open:scale-y-0 motion-reduce:transition-none" />
                  </span>
                </summary>
                <p className="mt-3 max-w-[62ch] leading-relaxed text-muted">
                  {t(`items.${key}.a`)}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
