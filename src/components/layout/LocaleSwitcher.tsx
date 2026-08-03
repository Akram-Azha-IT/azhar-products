'use client';

import { useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/routing';

/**
 * Inline EN / FR / DE group. Switching keeps the current path *and* its query
 * string, so a filtered catalogue view survives a language change.
 */
export function LocaleSwitcher() {
  const t = useTranslations('nav');
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  /*
   * Read the query string at click time rather than through useSearchParams:
   * that hook opts the whole page out of static rendering, and the value is
   * only ever needed in response to a user action.
   */
  const switchTo = (locale: Locale) => {
    const query = Object.fromEntries(
      new URLSearchParams(window.location.search).entries(),
    );
    router.replace({ pathname, query }, { locale });
  };

  return (
    <nav aria-label={t('languageLabel')} className="flex items-center gap-1">
      {locales.map((locale: Locale, index) => {
        const isActive = locale === activeLocale;
        return (
          <span key={locale} className="flex items-center gap-1">
            {index > 0 ? (
              <span aria-hidden className="text-line">
                /
              </span>
            ) : null}
            <button
              type="button"
              lang={locale}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => switchTo(locale)}
              className={`cursor-pointer px-1 py-2 text-xs tracking-[0.12em] uppercase transition-colors duration-[var(--duration-ui)] ${
                isActive
                  ? 'text-accent'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {locale}
            </button>
          </span>
        );
      })}
    </nav>
  );
}
