import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { I18nContext, type I18nValue } from './context';
import { de } from './locales/de';
import { en } from './locales/en';
import { fr } from './locales/fr';
import { LOCALES, type Dictionary, type Locale } from './types';

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en, de };
const DEFAULT_LOCALE: Locale = 'fr';
const STORAGE_KEY = 'azhar-locale';

function isLocale(value: string | null): value is Locale {
  return value !== null && LOCALES.includes(value as Locale);
}

/** Langue enregistrée, sinon langue du navigateur, sinon français. */
function detectLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Stockage indisponible (navigation privée) : on retombe sur le navigateur.
  }

  const preferred = window.navigator.languages ?? [window.navigator.language];
  for (const tag of preferred) {
    const base = tag.slice(0, 2).toLowerCase();
    if (isLocale(base)) return base;
  }

  return DEFAULT_LOCALE;
}

function applyDocumentLanguage(locale: Locale, dictionary: Dictionary) {
  document.documentElement.lang = locale;
  document.title = dictionary.meta.title;

  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', dictionary.meta.description);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  useEffect(() => {
    applyDocumentLanguage(locale, DICTIONARIES[locale]);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Le choix reste valable pour la session même si on ne peut pas l'écrire.
    }
  }, []);

  const value = useMemo<I18nValue>(
    () => ({ locale, t: DICTIONARIES[locale], setLocale }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
