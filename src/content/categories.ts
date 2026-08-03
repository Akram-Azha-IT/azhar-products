/**
 * The four product families shown on the home page and used as the top-level
 * catalogue filter in Phase 3.
 *
 * `skuCount` stays null until the product data model lands — the tile renders
 * an em dash rather than a guessed figure.
 */
export interface Category {
  /** Matches the catalogue filter value and the i18n key. */
  slug: 'dairy' | 'clear' | 'foodservice' | 'carton';
  /** Path the processed hero asset for this family will occupy. */
  image: string;
  skuCount: number | null;
}

export const CATEGORIES: readonly Category[] = [
  { slug: 'dairy', image: '/products/dairy/category.webp', skuCount: null },
  { slug: 'clear', image: '/products/clear/category.webp', skuCount: null },
  {
    slug: 'foodservice',
    image: '/products/foodservice/category.webp',
    skuCount: null,
  },
  { slug: 'carton', image: '/products/carton/category.webp', skuCount: null },
] as const;

/** Six capability statements. Copy lives in `home.capabilities.items.<key>`. */
export const CAPABILITY_KEYS = [
  'materials',
  'moulds',
  'tooling',
  'volume',
  'hygiene',
  'leadTimes',
] as const;
