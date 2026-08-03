'use client';

import { useTranslations } from 'next-intl';

import { CAPABILITY_KEYS } from '@/content/categories';
import { useRevealText } from '@/hooks/useRevealText';
import { Eyebrow } from '@/components/ui/Eyebrow';

export function Capabilities() {
  const t = useTranslations('home.capabilities');
  const titleRef = useRevealText<HTMLHeadingElement>();

  return (
    <section
      aria-labelledby="capabilities-heading"
      className="bg-off-white px-(--spacing-gutter) py-(--spacing-section)"
    >
      <Eyebrow index="03">{t('eyebrow')}</Eyebrow>
      <h2
        ref={titleRef}
        id="capabilities-heading"
        className="mt-6 max-w-[18ch] text-(length:--text-section) font-medium"
      >
        {t('title')}
      </h2>

      <ul className="mt-16 grid gap-x-16 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {CAPABILITY_KEYS.map((key, index) => (
          <li key={key} className="border-t border-teal-mid/30 pt-6">
            <span aria-hidden className="eyebrow text-teal-mid">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-4 font-display text-2xl tracking-[-0.02em]">
              {t(`items.${key}.title`)}
            </h3>
            <p className="mt-3 max-w-[38ch] leading-relaxed text-teal-body">
              {t(`items.${key}.body`)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
