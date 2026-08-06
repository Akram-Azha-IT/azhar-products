import { useMemo, type ReactNode } from 'react';
import { I18nContext, type I18nValue } from './context';
import { de } from './locales/de';
import { en } from './locales/en';
import { fr } from './locales/fr';
import type { Dictionary, Locale } from './types';

export const DICTIONARIES: Record<Locale, Dictionary> = { fr, en, de };

/**
 * La langue vient de l'URL, jamais d'un état interne : le rendu serveur et le
 * rendu client partent donc de la même valeur, et chaque langue reste indexable.
 */
export function LanguageProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<I18nValue>(() => ({ locale, t: DICTIONARIES[locale] }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
