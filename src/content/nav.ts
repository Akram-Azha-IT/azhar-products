/**
 * Primary navigation. Lives apart from the components so the header, the
 * mobile overlay and the footer can all read it without importing each other.
 */
export const NAV_ITEMS = [
  { href: '/products', key: 'products' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const;
