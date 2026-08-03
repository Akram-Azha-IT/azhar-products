import type { Locale } from '@/i18n/routing';
import type { Category } from './categories';

export type Material = 'PP' | 'PS' | 'PET' | 'PVC';

export type Application =
  | 'yogurt'
  | 'creamCheese'
  | 'dessert'
  | 'foodService';

export interface ProductImage {
  /** Path under /public. See IMAGES.md for the expected filenames. */
  src: string;
  alt: Record<Locale, string>;
}

/**
 * A catalogue entry.
 *
 * Every dimension is nullable on purpose. A missing spec renders an em dash in
 * the spec table and drops the item out of the corresponding filter facet — it
 * is never approximated. Inventing a capacity or an MOQ would put a number in
 * front of a procurement manager that nobody can stand behind.
 */
export interface Product {
  slug: string;
  category: Category['slug'];
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  material: Material | null;
  capacityMl: number | null;
  diameterMm: number | null;
  heightMm: number | null;
  lidCompatibility: string | null;
  unitsPerCarton: number | null;
  moq: number | null;
  applications: readonly Application[];
  images: readonly ProductImage[];
}

/*
 * ---------------------------------------------------------------------------
 * SCAFFOLD DATA — not a real catalogue.
 *
 * These entries exist so the filter bar, grid, detail template and empty
 * states are all reviewable. Every spec is null and every name is a positional
 * label, because the real SKUs, capacities, diameters, lid standards, carton
 * counts and MOQs have not been supplied yet.
 *
 * To turn this into the real catalogue: replace each entry's `name`,
 * `description` and specs, point `images` at the processed files listed in
 * IMAGES.md, and delete this comment. No component changes are required —
 * filter facets are derived from whatever data is present.
 * ---------------------------------------------------------------------------
 */

const TODO_NAME = (label: string): Record<Locale, string> => ({
  en: label,
  fr: `TODO_TRANSLATE: ${label}`,
  de: `TODO_TRANSLATE: ${label}`,
});

const TODO_DESCRIPTION: Record<Locale, string> = {
  en: 'Specification pending. Send the format sheet and this entry fills in.',
  fr: 'TODO_TRANSLATE: Specification pending.',
  de: 'TODO_TRANSLATE: Specification pending.',
};

function scaffold(
  slug: string,
  category: Category['slug'],
  label: string,
): Product {
  return {
    slug,
    category,
    name: TODO_NAME(label),
    description: TODO_DESCRIPTION,
    material: null,
    capacityMl: null,
    diameterMm: null,
    heightMm: null,
    lidCompatibility: null,
    unitsPerCarton: null,
    moq: null,
    applications: [],
    images: [],
  };
}

export const PRODUCTS: readonly Product[] = [
  scaffold('dairy-format-a', 'dairy', 'Dairy format A'),
  scaffold('dairy-format-b', 'dairy', 'Dairy format B'),
  scaffold('dairy-format-c', 'dairy', 'Dairy format C'),
  scaffold('clear-format-a', 'clear', 'Clear format A'),
  scaffold('clear-format-b', 'clear', 'Clear format B'),
  scaffold('foodservice-format-a', 'foodservice', 'Food service format A'),
  scaffold('foodservice-format-b', 'foodservice', 'Food service format B'),
  scaffold('carton-format-a', 'carton', 'Carton format A'),
] as const;

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

/** Products in the same category, excluding the one being viewed. */
export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return PRODUCTS.filter(
    (candidate) =>
      candidate.category === product.category &&
      candidate.slug !== product.slug,
  ).slice(0, limit);
}
