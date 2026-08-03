/**
 * The four product families shown on the home page and used as the top-level
 * catalogue filter.
 *
 * `image` is null where no processed asset exists yet — the tile then renders a
 * labelled placeholder naming the file it wants, rather than borrowing a shot
 * from another category.
 */
export interface Category {
  /** Matches the catalogue filter value and the i18n key. */
  slug: 'dairy' | 'clear' | 'foodservice' | 'carton';
  image: string | null;
}

export const CATEGORIES: readonly Category[] = [
  { slug: 'dairy', image: '/products/dairy/yogurt-tub-wide-4.webp' },
  { slug: 'clear', image: null },
  { slug: 'foodservice', image: null },
  { slug: 'carton', image: null },
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
