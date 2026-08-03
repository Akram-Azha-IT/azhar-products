/**
 * In-page anchors. The site is a single landing page, so navigation scrolls
 * rather than routes — every id here must exist as a section on the page.
 */
export const NAV_ITEMS = [
  { href: '#products', key: 'products' },
  { href: '#expertise', key: 'expertise' },
  { href: '#contact', key: 'contact' },
] as const;
