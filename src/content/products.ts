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
 * Families are grouped by FORM FACTOR — that is what the renders actually show
 * and what a buyer selects on. Specs stay null until the format sheets arrive
 * (DECISIONS.md D14); the images are real.
 *
 * Alt text describes the packaging, never the customer's printed brand.
 */

function localised(en: string): Record<Locale, string> {
  return { en, fr: `TODO_TRANSLATE: ${en}`, de: `TODO_TRANSLATE: ${en}` };
}

function image(src: string, description: string): ProductImage {
  return { src, alt: localised(description) };
}

const WIDE_TUB_IMAGES: readonly ProductImage[] = [
  image(
    '/products/dairy/yogurt-tub-wide-1.webp',
    'Wide thermoformed dairy tub with a rolled sealing rim and full-wrap printed sleeve',
  ),
  image(
    '/products/dairy/yogurt-tub-wide-2.webp',
    'Wide dairy tub at a three-quarter angle, print running to the base',
  ),
  image(
    '/products/dairy/yogurt-tub-wide-3.webp',
    'Wide dairy tub with a banded print and reinforced stacking rib',
  ),
  image(
    '/products/dairy/yogurt-tub-wide-4.webp',
    'Wide dairy tubs nested in a stack beside a single filled unit',
  ),
  image('/products/dairy/yogurt-tub-wide-5.webp', 'Wide dairy tub, side view'),
  image(
    '/products/dairy/yogurt-tub-wide-6.webp',
    'Wide dairy tub with an alternate print treatment',
  ),
  image(
    '/products/dairy/yogurt-tub-wide-7.webp',
    'Wide dairy tub showing its stacking profile',
  ),
];

const TALL_CUP_IMAGES: readonly ProductImage[] = [
  image(
    '/products/dairy/yogurt-cup-tall-1.webp',
    'Tall thermoformed yogurt cup with a printed sleeve, shown with a nested stack',
  ),
  image(
    '/products/dairy/yogurt-cup-tall-2.webp',
    'Tall yogurt cups, one tipped to show the base and stacking ribs',
  ),
  image('/products/dairy/yogurt-cup-tall-3.webp', 'Tall yogurt cup, front view'),
  image(
    '/products/dairy/yogurt-cup-tall-4.webp',
    'Tall yogurt cup, three-quarter view',
  ),
  image(
    '/products/dairy/yogurt-cup-tall-5.webp',
    'Tall yogurt cup with an alternate print treatment',
  ),
  image(
    '/products/dairy/yogurt-cup-tall-6.webp',
    'Tall yogurt cup showing its rim detail',
  ),
];

const POT_IMAGES: readonly ProductImage[] = [
  image(
    '/products/dairy/cream-cheese-pot-1.webp',
    'Small cream cheese pot with a wide rim and full-wrap printed sleeve',
  ),
  image(
    '/products/dairy/cream-cheese-pot-2.webp',
    'Cream cheese pots nested in a stack beside a single filled unit',
  ),
  image(
    '/products/dairy/cream-cheese-pot-3.webp',
    'Cream cheese pot, three-quarter view',
  ),
  image(
    '/products/dairy/cream-cheese-pot-4.webp',
    'Cream cheese pot showing its lid seat',
  ),
];

function family(
  slug: string,
  name: string,
  description: string,
  applications: readonly Application[],
  images: readonly ProductImage[],
): Product {
  return {
    slug,
    category: 'dairy',
    name: localised(name),
    description: localised(description),
    material: null,
    capacityMl: null,
    diameterMm: null,
    heightMm: null,
    lidCompatibility: null,
    unitsPerCarton: null,
    moq: null,
    applications,
    images,
  };
}

export const PRODUCTS: readonly Product[] = [
  family(
    'yogurt-tub-wide',
    'Wide dairy tub',
    'Low, wide-mouth thermoformed tub for set yogurt, raib and fermented milk. Rolled rim for foil sealing, stacking ribs on the base, and a full-wrap print area from rim to foot.',
    ['yogurt', 'dessert'],
    WIDE_TUB_IMAGES,
  ),
  family(
    'yogurt-cup-tall',
    'Tall yogurt cup',
    'Taller profile on a smaller footprint, for drinking yogurt, stirred yogurt and chilled desserts. Nests tightly for transport and takes the same foil lid standard as the wide tub.',
    ['yogurt', 'dessert', 'foodService'],
    TALL_CUP_IMAGES,
  ),
  family(
    'cream-cheese-pot',
    'Cream cheese pot',
    'Small-format pot for spreadable cream cheese and portion dairy. Wide rim relative to its height for easy scooping, with a deep lid seat for a secure foil seal.',
    ['creamCheese', 'foodService'],
    POT_IMAGES,
  ),
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
