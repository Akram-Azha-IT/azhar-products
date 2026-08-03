import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { COMPANY } from '@/content/company';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ContactForm } from '@/features/contact/ContactForm';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.contact' });
  return { title: t('title'), description: t('description') };
}

const SOCIAL_KEYS = ['instagram', 'facebook', 'linkedin'] as const;

/** True once the placeholder has been replaced with a real value. */
function isConfirmed(value: string): boolean {
  return !value.includes('TODO_CONFIRM');
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations('contact');

  return (
    <div className="px-(--spacing-gutter) pt-40 pb-(--spacing-section)">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <h1 className="mt-6 max-w-[16ch] text-(length:--text-section) font-medium">
        {t('title')}
      </h1>
      <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-teal-body">
        {t('intro')}
      </p>

      <div className="mt-20 grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
        <ContactForm />

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="eyebrow text-teal-body">{t('panel.title')}</h2>

          <address className="mt-6 flex flex-col gap-4 text-base not-italic">
            {isConfirmed(COMPANY.email) ? (
              <a
                href={`mailto:${COMPANY.email}`}
                className="w-fit underline underline-offset-4 transition-colors duration-[var(--duration-ui)] hover:text-accent-strong"
              >
                {COMPANY.email}
              </a>
            ) : (
              <span className="text-teal-body">{t('panel.pending')}</span>
            )}

            {isConfirmed(COMPANY.phone) ? (
              <a
                href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
                className="w-fit underline underline-offset-4 transition-colors duration-[var(--duration-ui)] hover:text-accent-strong"
              >
                {COMPANY.phone}
              </a>
            ) : null}

            {isConfirmed(COMPANY.whatsapp) ? (
              <a
                href={`https://wa.me/${COMPANY.whatsapp}`}
                rel="noopener noreferrer"
                target="_blank"
                className="w-fit underline underline-offset-4 transition-colors duration-[var(--duration-ui)] hover:text-accent-strong"
              >
                {t('panel.whatsapp')}
              </a>
            ) : null}

            {isConfirmed(COMPANY.address) ? (
              <p className="max-w-[32ch] text-teal-body">{COMPANY.address}</p>
            ) : null}
          </address>

          <ul className="mt-8 flex flex-wrap gap-4">
            {SOCIAL_KEYS.filter((key) =>
              isConfirmed(COMPANY.social[key]),
            ).map((key) => (
              <li key={key}>
                <a
                  href={COMPANY.social[key]}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-sm tracking-[0.08em] uppercase underline underline-offset-4 transition-colors duration-[var(--duration-ui)] hover:text-accent-strong"
                >
                  {t(`panel.social.${key}`)}
                </a>
              </li>
            ))}
          </ul>

          {/*
           * The map is omitted rather than pointed at a guessed location, and
           * omitting it also avoids loading a third-party frame for nothing.
           */}
          <div className="mt-10 border border-teal-mid/30 bg-off-white p-6">
            <p className="text-sm text-teal-body">{t('panel.mapPending')}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
