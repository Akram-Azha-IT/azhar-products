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

/**
 * Product copy is authored in English only for now.
 *
 * Every locale gets the English source rather than a `TODO_TRANSLATE:`-prefixed
 * string: the marker belongs in the translation files as a record of what is
 * outstanding, not on the page, where it inflates every string and breaks the
 * layout. Swap the `fr`/`de` values here when the real translations arrive —
 * packaging terminology should not be machine-translated.
 */
function localised(en: string): Record<Locale, string> {
  return { en, fr: en, de: en };
}

function image(src: string, description: string): ProductImage {
  return { src, alt: localised(description) };
}

/*
 * Slot order is deliberate: odd slots are single-unit shots, even slots are the
 * matching stack shot. The card's hover swap uses images[1], so it always
 * reveals the same format from a second angle rather than a different product.
 */
const WIDE_TUB_IMAGES: readonly ProductImage[] = [
  image(
    '/products/dairy/yogurt-tub-wide-1.webp',
    'Wide thermoformed dairy tub with a rolled sealing rim, beaded foot and full-wrap printed sleeve',
  ),
  image(
    '/products/dairy/yogurt-tub-wide-2.webp',
    'Wide dairy tubs nested in a stack beside two filled units, showing the beaded foot detail',
  ),
  image(
    '/products/dairy/yogurt-tub-wide-3.webp',
    'Wide dairy tub with a deep banded print and reinforced stacking rib below the rim',
  ),
  image(
    '/products/dairy/yogurt-tub-wide-4.webp',
    'Wide dairy tubs nested in a tall stack beside a single filled unit and one laid on its side',
  ),
  image(
    '/products/dairy/yogurt-tub-wide-5.webp',
    'Wide dairy tub with a shallow profile and print running from rim to foot',
  ),
  image(
    '/products/dairy/yogurt-tub-wide-6.webp',
    'Wide dairy tub, three-quarter view showing the rim roll and inner wall',
  ),
  image(
    '/products/dairy/yogurt-tub-wide-7.webp',
    'Wide dairy tub with a minimal print treatment, front view',
  ),
  image(
    '/products/dairy/yogurt-tub-wide-8.webp',
    'Wide dairy tubs nested in a stack beside a single unit, minimal print treatment',
  ),
  image(
    '/products/dairy/yogurt-tub-wide-9.webp',
    'Wide dairy tub in a lighter format, showing the stacking step under the rim',
  ),
  image(
    '/products/dairy/yogurt-tub-wide-10.webp',
    'Wide dairy tubs nested in a stack beside a single unit and one laid on its side',
  ),
];

const TALL_CUP_IMAGES: readonly ProductImage[] = [
  image(
    '/products/dairy/yogurt-cup-tall-1.webp',
    'Tall tapered thermoformed yogurt cup with a rolled rim and full-wrap printed sleeve',
  ),
  image(
    '/products/dairy/yogurt-cup-tall-2.webp',
    'Tall yogurt cups nested in a stack beside a single unit and one laid on its side',
  ),
  image(
    '/products/dairy/yogurt-cup-tall-3.webp',
    'Tall yogurt cups shown as a deep nested stack beside two filled units',
  ),
];

const POT_IMAGES: readonly ProductImage[] = [
  image(
    '/products/dairy/cream-cheese-pot-1.webp',
    'Small cream cheese pot with a wide rolled rim, shallow body and full-wrap printed sleeve',
  ),
  image(
    '/products/dairy/cream-cheese-pot-2.webp',
    'Cream cheese pots nested in a stack beside a single unit and one laid on its side',
  ),
  image(
    '/products/dairy/cream-cheese-pot-3.webp',
    'Cream cheese pot, three-quarter view showing the deep lid seat below the rim',
  ),
  image(
    '/products/dairy/cream-cheese-pot-4.webp',
    'Cream cheese pots nested in a stack beside a single filled unit',
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
