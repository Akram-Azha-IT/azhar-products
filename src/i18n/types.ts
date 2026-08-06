import type { CategoryId, ProductId } from '../data/products';
import type { RangeId } from '../data/ranges';

export const LOCALES = ['fr', 'en', 'de'] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * Textes propres à une référence catalogue. `brand` porte soit un nom propre
 * (Danone, Q-Therm), soit une famille descriptive qui, elle, se traduit.
 */
export type ProductCopy = {
  brand: string;
  range: string;
  /** Mot affiché en typo display derrière le produit dans le héros. */
  ghost: string;
  format: string;
  capacity: string;
  decor: string;
  description: string;
};

export type RangeCopy = {
  title: string;
  lead: string;
  bullets: string[];
  alt: string;
};

export type CategoryCopy = {
  label: string;
  blurb: string;
};

export type StepCopy = {
  title: string;
  text: string;
};

export type StatCopy = {
  value: string;
  label: string;
};

export type NavKey = 'univers' | 'catalogue' | 'savoirFaire' | 'atelier' | 'contact';

export type StepId = 'matiere' | 'decor' | 'conformite' | 'recyclage';

export type Dictionary = {
  /** Titre et description injectés dans le `<head>` au changement de langue. */
  meta: {
    title: string;
    description: string;
  };
  nav: {
    links: Record<NavKey, string>;
    quote: string;
    quoteShort: string;
    ariaMain: string;
    ariaLanguage: string;
  };
  hero: {
    prev: string;
    next: string;
    catalogueLink: string;
  };
  marquee: string[];
  ranges: {
    /** `{n}` est remplacé par le nombre d'univers. */
    eyebrow: string;
    title: string;
    lead: string;
    items: Record<RangeId, RangeCopy>;
  };
  catalogue: {
    /** `{n}` est remplacé par le nombre de références. */
    eyebrow: string;
    title: string;
    lead: string;
    /** `{label}` et `{n}` sont remplacés à l'affichage. */
    railLabel: string;
    categories: Record<CategoryId, CategoryCopy>;
    products: Record<ProductId, ProductCopy>;
  };
  expertise: {
    title: string;
    lead: string;
    steps: Record<StepId, StepCopy>;
  };
  atelier: {
    eyebrow: string;
    title: string;
    paragraphs: [string, string];
    stats: StatCopy[];
    alt: Record<'danone' | 'milkman' | 'gado', string>;
  };
  contact: {
    title: string;
    lead: string;
    phone: string;
    email: string;
    address: string;
    cta: string;
    /** Objet du mailto, encodé au moment du rendu. */
    mailSubject: string;
  };
  footer: {
    ariaNav: string;
    site: string;
    universes: string;
    contact: string;
    rights: string;
    city: string;
  };
  company: {
    baseline: string;
    addressLines: string[];
  };
};

/** Remplace les jetons `{clé}` d'un libellé par leurs valeurs. */
export function interpolate(
  template: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
