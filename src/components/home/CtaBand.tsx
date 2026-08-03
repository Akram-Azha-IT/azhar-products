'use client';

import { useTranslations } from 'next-intl';

import { useRevealText } from '@/hooks/useRevealText';
import { ButtonLink } from '@/components/ui/Button';

export function CtaBand() {
  const t = useTranslations('home.cta');
  const titleRef = useRevealText<HTMLParagraphElement>();

  return (
    <section className="bg-teal-deep px-(--spacing-gutter) py-(--spacing-section) text-cream">
      <p
        ref={titleRef}
        className="max-w-[16ch] font-display text-(length:--text-section) font-medium tracking-[-0.03em]"
      >
        {t('title')}
      </p>
      <p className="mt-8 max-w-[48ch] text-lg leading-relaxed text-cream/80">
        {t('body')}
      </p>
      <div className="mt-10">
        <ButtonLink href="/contact" variant="primary">
          {t('button')}
        </ButtonLink>
      </div>
    </section>
  );
}
