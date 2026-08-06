import { createContext } from 'react';
import { fr } from './locales/fr';
import type { Dictionary, Locale } from './types';

export type I18nValue = {
  locale: Locale;
  t: Dictionary;
};

/** Le français sert de repli : c'est la langue de rédaction du contenu. */
export const I18nContext = createContext<I18nValue>({ locale: 'fr', t: fr });
