'use client';

import { useTranslations } from 'next-intl';

import { COMPANY, isConfirmed } from '@/content/company';
import { useRevealText } from '@/hooks/useRevealText';
import { ContactForm } from '@/features/contact/ContactForm';
import { Blob, Sparkle } from '@/components/ui/Blob';

export function QuoteSection() {
  const t = useTranslations('landing.quote');
  const titleRef = useRevealText<HTMLHeadingElement>();

  const channels = [
    { key: 'email', value: COMPANY.email, href: `mailto:${COMPANY.email}` },
    {
      key: 'phone',
      value: COMPANY.phone,
      href: `tel:${COMPANY.phone.replace(/\s/g, '')}`,
    },
    {
      key: 'instagram',
      value: '@azhar.product',
      href: COMPANY.social.instagram,
    },
  ].filter((channel) => isConfirmed(channel.value) && isConfirmed(channel.href));

  return (
    <section
      id="contact"
      aria-labelledby="quote-heading"
      className="scroll-mt-24 px-(--spacing-gutter) pb-(--spacing-section)"
    >
      <div className="relative mx-auto max-w-[80rem] overflow-hidden rounded-(--radius-panel) bg-panel px-6 py-14 sm:px-12 sm:py-20">
        <Blob tone="accent" className="-top-20 -right-16 h-80 w-80" />
        <Sparkle className="top-14 left-[8%] h-5 w-5 text-accent-bright" />

        <div className="relative grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <p className="eyebrow text-accent">{t('eyebrow')}</p>
            <h2
              ref={titleRef}
              id="quote-heading"
              className="mt-4 max-w-[13ch] text-(length:--text-section) font-semibold"
            >
              {t('title')}
            </h2>
            <p className="mt-6 max-w-[42ch] leading-relaxed text-muted">
              {t('body')}
            </p>

            {channels.length > 0 ? (
              <ul className="mt-10 flex flex-col gap-3">
                {channels.map((channel) => (
                  <li key={channel.key}>
                    <a
                      href={channel.href}
                      {...(channel.key === 'instagram'
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="inline-flex rounded-(--radius-pill) bg-paper px-5 py-3 text-sm font-medium transition-colors duration-[var(--duration-ui)] hover:text-accent"
                    >
                      {channel.value}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="rounded-(--radius-card) bg-paper p-6 sm:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
