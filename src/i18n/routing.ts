import { LOCALES, type Locale } from './types';

/**
 * Une URL par langue. C'est la seule source de vérité : sans URL distincte, un
 * moteur ne peut indexer qu'une seule version du contenu.
 */
export const LOCALE_PATHS: Record<Locale, string> = {
  fr: '/',
  en: '/en/',
  de: '/de/',
};

export const DEFAULT_LOCALE: Locale = 'fr';

export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0];
  return LOCALES.find((locale) => locale === segment) ?? DEFAULT_LOCALE;
}
