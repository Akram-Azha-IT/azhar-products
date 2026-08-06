export type Range = {
  id: string;
  image: string;
  bg: string;
};

/** Les cinq univers commercialisés. Les textes vivent dans `src/i18n`. */
export const RANGES = [
  { id: 'alimentaire', image: '/ranges/alimentaire.webp', bg: '#E9E2D4' },
  { id: 'preformes', image: '/ranges/preformes.webp', bg: '#DCE6E9' },
  { id: 'raccords', image: '/ranges/raccords.webp', bg: '#D7E3DC' },
  { id: 'logistique', image: '/ranges/logistique.webp', bg: '#DDE2E8' },
  { id: 'poubelles', image: '/ranges/poubelles.webp', bg: '#D9E4D8' },
] as const satisfies readonly Range[];

/** Force chaque locale à décrire les cinq univers. */
export type RangeId = (typeof RANGES)[number]['id'];
