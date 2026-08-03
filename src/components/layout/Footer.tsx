import { useTranslations } from 'next-intl';

import { TransitionLink } from '@/components/ui/TransitionLink';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { NAV_ITEMS } from '@/content/nav';
import { COMPANY } from '@/content/company';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className="bg-navy-deep px-(--spacing-gutter) py-(--spacing-section) text-paper">
      <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-md">
          <Eyebrow className="!text-paper/70">{t('eyebrow')}</Eyebrow>
          <p className="mt-6 font-display text-3xl tracking-[-0.03em] md:text-4xl">
            {t('tagline')}
          </p>
        </div>

        <nav aria-label={tNav('primaryLabel')} className="flex flex-col gap-3">
          {NAV_ITEMS.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              className="w-fit text-sm tracking-[0.04em] text-paper/80 uppercase transition-colors duration-[var(--duration-ui)] hover:text-paper"
            >
              {tNav(item.key)}
            </TransitionLink>
          ))}
        </nav>

        <address className="flex flex-col gap-3 text-sm not-italic text-paper/80">
          <a
            href={`mailto:${COMPANY.email}`}
            className="w-fit transition-colors duration-[var(--duration-ui)] hover:text-paper"
          >
            {COMPANY.email}
          </a>
          <a
            href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
            className="w-fit transition-colors duration-[var(--duration-ui)] hover:text-paper"
          >
            {COMPANY.phone}
          </a>
          <p>{COMPANY.address}</p>
        </address>
      </div>

      <div className="mt-16 flex flex-col gap-2 border-t border-paper/20 pt-6 text-xs text-paper/60 sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} Azhar Products. {t('rights')}
        </p>
        <p>{t('builtFor')}</p>
      </div>
    </footer>
  );
}
