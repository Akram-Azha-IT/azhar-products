export type CategoryId = 'laitier' | 'traiteur' | 'raccords';

/** Ordre d'affichage des rails du catalogue. Les libellés vivent dans `src/i18n`. */
export const CATEGORY_IDS: CategoryId[] = ['laitier', 'traiteur', 'raccords'];

export type Product = {
  id: string;
  category: CategoryId;
  image: string;
  /** Visuel de la fiche catalogue (vue groupée quand elle existe). */
  stack: string;
  bg: string;
  panel: string;
  /** Présent dans le carrousel du héros. */
  hero?: boolean;
};

export const PRODUCTS = [
  {
    id: 'raib',
    category: 'laitier',
    image: '/products/raib-solo.webp',
    stack: '/products/raib-stack.webp',
    bg: '#BEDCF2',
    panel: '#D3E7F7',
    hero: true,
  },
  {
    id: 'milkman-plain',
    category: 'laitier',
    image: '/products/milkman-plain.webp',
    stack: '/products/milkman-plain-stack.webp',
    bg: '#EADFC6',
    panel: '#F1E9D9',
  },
  {
    id: 'milkman-greek',
    category: 'laitier',
    image: '/products/milkman-greek.webp',
    stack: '/products/milkman-greek-stack.webp',
    bg: '#F7CFDD',
    panel: '#FADEE7',
    hero: true,
  },
  {
    id: 'danone',
    category: 'laitier',
    image: '/products/danone-plain.webp',
    stack: '/products/danone-plain-stack.webp',
    bg: '#C6D8F6',
    panel: '#DAE5FA',
    hero: true,
  },
  {
    id: 'activia',
    category: 'laitier',
    image: '/products/activia.webp',
    stack: '/products/activia-stack.webp',
    bg: '#CBE0C4',
    panel: '#DCEBD6',
  },
  {
    id: 'alhana',
    category: 'laitier',
    image: '/products/alhana.webp',
    stack: '/products/alhana-stack.webp',
    bg: '#E2EBBE',
    panel: '#EBF1D3',
  },
  {
    id: 'gado',
    category: 'laitier',
    image: '/products/gado.webp',
    stack: '/products/gado-stack.webp',
    bg: '#C3E3DB',
    panel: '#D7EDE7',
    hero: true,
  },
  {
    id: 'yopolis',
    category: 'laitier',
    image: '/products/yopolis.webp',
    stack: '/products/yopolis-stack.webp',
    bg: '#F8CFCB',
    panel: '#FBDEDB',
    hero: true,
  },
  {
    id: 'ghot-sudan',
    category: 'laitier',
    image: '/products/ghot-sudan.webp',
    stack: '/products/ghot-sudan.webp',
    bg: '#FBE6A8',
    panel: '#FCEDC4',
  },

  {
    id: 'pet-cup-dome',
    category: 'traiteur',
    image: '/products/pet-cup-dome.webp',
    stack: '/products/pet-cup-dome.webp',
    bg: '#CFE0E6',
    panel: '#DFEBEF',
    hero: true,
  },
  {
    id: 'pet-cup-flat',
    category: 'traiteur',
    image: '/products/pet-cup-flat.webp',
    stack: '/products/pet-cup-flat.webp',
    bg: '#D6DFE8',
    panel: '#E4EAF0',
  },
  {
    id: 'pet-can',
    category: 'traiteur',
    image: '/products/pet-can.webp',
    stack: '/products/pet-can.webp',
    bg: '#DCE4E0',
    panel: '#E8EEEB',
  },
  {
    id: 'pet-salad-bowl',
    category: 'traiteur',
    image: '/products/pet-salad-bowl.webp',
    stack: '/products/pet-salad-bowl.webp',
    bg: '#D3E3DE',
    panel: '#E1ECE8',
    hero: true,
  },
  {
    id: 'pet-hinged-tray',
    category: 'traiteur',
    image: '/products/pet-hinged-tray.webp',
    stack: '/products/pet-hinged-tray.webp',
    bg: '#DDE3E7',
    panel: '#E9EDF0',
  },
  {
    id: 'pet-tart-box',
    category: 'traiteur',
    image: '/products/pet-tart-box.webp',
    stack: '/products/pet-tart-box.webp',
    bg: '#E4E1DA',
    panel: '#EDEBE6',
  },
  {
    id: 'pet-deli-pot',
    category: 'traiteur',
    image: '/products/pet-deli-pot.webp',
    stack: '/products/pet-deli-pot.webp',
    bg: '#DCE6E4',
    panel: '#E8EFEE',
  },
  {
    id: 'pet-sauce-pot',
    category: 'traiteur',
    image: '/products/pet-sauce-pot.webp',
    stack: '/products/pet-sauce-pot.webp',
    bg: '#E2E6E9',
    panel: '#EDEFF2',
  },
  {
    id: 'kraft-soup-pot',
    category: 'traiteur',
    image: '/products/kraft-soup-pot.webp',
    stack: '/products/kraft-soup-pot.webp',
    bg: '#E8D9C3',
    panel: '#F0E6D8',
    hero: true,
  },
  {
    id: 'kraft-window-box',
    category: 'traiteur',
    image: '/products/kraft-window-box.webp',
    stack: '/products/kraft-window-box.webp',
    bg: '#E9DCC8',
    panel: '#F2E8DA',
  },
  {
    id: 'kraft-cup-carrier',
    category: 'traiteur',
    image: '/products/kraft-cup-carrier.webp',
    stack: '/products/kraft-cup-carrier.webp',
    bg: '#E5D8C6',
    panel: '#F0E7DA',
  },
  {
    id: 'bagasse-box',
    category: 'traiteur',
    image: '/products/bagasse-box.webp',
    stack: '/products/bagasse-box.webp',
    bg: '#E7E0CC',
    panel: '#F0EBDC',
    hero: true,
  },

  {
    id: 'ppr-pipe-green',
    category: 'raccords',
    image: '/products/ppr-pipe-green.webp',
    stack: '/products/ppr-pipe-green.webp',
    bg: '#CFE3D8',
    panel: '#DEEBE4',
    hero: true,
  },
  {
    id: 'ppr-pipe-black',
    category: 'raccords',
    image: '/products/ppr-pipe-black.webp',
    stack: '/products/ppr-pipe-black.webp',
    bg: '#D8DEDA',
    panel: '#E6EAE7',
  },
  {
    id: 'ppr-valve',
    category: 'raccords',
    image: '/products/ppr-valve.webp',
    stack: '/products/ppr-valve.webp',
    bg: '#CFE3D8',
    panel: '#DEEBE4',
  },
  {
    id: 'ppr-elbow',
    category: 'raccords',
    image: '/products/ppr-elbow.webp',
    stack: '/products/ppr-elbow.webp',
    bg: '#D5E4DB',
    panel: '#E3EDE7',
  },
  {
    id: 'ppr-tee',
    category: 'raccords',
    image: '/products/ppr-tee.webp',
    stack: '/products/ppr-tee.webp',
    bg: '#D5E4DB',
    panel: '#E3EDE7',
  },
  {
    id: 'ppr-socket',
    category: 'raccords',
    image: '/products/ppr-socket.webp',
    stack: '/products/ppr-socket.webp',
    bg: '#D5E4DB',
    panel: '#E3EDE7',
  },
] as const satisfies readonly Product[];

/** Fiche telle qu'elle existe réellement, identifiant littéral compris. */
export type CatalogueProduct = (typeof PRODUCTS)[number];

/** Identifiants réels du catalogue : force chaque locale à couvrir toutes les fiches. */
export type ProductId = CatalogueProduct['id'];

export const HERO_PRODUCTS: readonly CatalogueProduct[] = PRODUCTS.filter(
  (product) => 'hero' in product && product.hero,
);
