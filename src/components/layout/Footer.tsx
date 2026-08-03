import { useTranslations } from 'next-intl';

import { NAV_ITEMS } from '@/content/nav';
import { COMPANY, isConfirmed } from '@/content/company';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className="px-(--spacing-gutter) pb-10">
      <div className="mx-auto max-w-[80rem] rounded-(--radius-panel) bg-shell px-8 py-12 text-paper sm:px-12">
        <div className="grid gap-10 sm:grid-cols-[2fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="text-xl font-semibold tracking-[-0.02em]">
              Azhar Products
            </p>
            <p className="mt-3 leading-relaxed text-paper/70">{t('tagline')}</p>
          </div>

          <nav
            aria-label={tNav('primaryLabel')}
            className="flex flex-col gap-2.5"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="w-fit text-sm text-paper/70 transition-colors duration-[var(--duration-ui)] hover:text-paper"
              >
                {tNav(item.key)}
              </a>
            ))}
          </nav>

          <address className="flex flex-col gap-2.5 text-sm not-italic text-paper/70">
            {isConfirmed(COMPANY.email) ? (
              <a
                href={`mailto:${COMPANY.email}`}
                className="w-fit transition-colors duration-[var(--duration-ui)] hover:text-paper"
              >
                {COMPANY.email}
              </a>
            ) : null}
            {isConfirmed(COMPANY.phone) ? (
              <a
                href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
                className="w-fit transition-colors duration-[var(--duration-ui)] hover:text-paper"
              >
                {COMPANY.phone}
              </a>
            ) : null}
            {isConfirmed(COMPANY.social.instagram) ? (
              <a
                href={COMPANY.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit transition-colors duration-[var(--duration-ui)] hover:text-paper"
              >
                Instagram
              </a>
            ) : null}
          </address>
        </div>

        <p className="mt-12 border-t border-paper/15 pt-6 text-xs text-paper/50">
          © {new Date().getFullYear()} Azhar Products. {t('rights')}
        </p>
      </div>
    </footer>
  );
}
