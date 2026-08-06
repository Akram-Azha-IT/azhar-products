import type { Dictionary } from '../types';

export const en: Dictionary = {
  meta: {
    title: 'Azhar Products: packaging, PET preforms, plastic fittings and bins',
    description:
      'Azhar Products: food and deli packaging, PET preforms and closures, PE, PVC and PP plastic fittings, logistics crates and pallets, HDPE bins in 120, 240 and 360 litres. Mohammedia, Morocco.',
  },
  nav: {
    links: {
      univers: 'Ranges',
      catalogue: 'Catalogue',
      savoirFaire: 'Know-how',
      atelier: 'Workshop',
      contact: 'Contact',
    },
    quote: 'Request a quote',
    quoteShort: 'Quote',
    ariaMain: 'Main navigation',
    ariaLanguage: 'Language selection',
  },
  hero: {
    prev: 'Previous product',
    next: 'Next product',
    catalogueLink: 'The catalogue',
  },
  marquee: [
    'Food packaging',
    'PET preforms',
    'Closures',
    'Trays',
    'Kraft and bagasse',
    'PPR fittings',
    'Pallets and crates',
    'HDPE bins',
  ],
  ranges: {
    eyebrow: 'Our ranges · {n} families',
    title: 'Package, protect,\nadd value',
    lead: 'Five families produced and distributed in house, from the food tray to the waste container.',
    items: {
      alimentaire: {
        title: 'Food packaging',
        lead: 'Dairy pots, PET trays, cups, kraft and bagasse for processing plants and takeaway service.',
        bullets: ['Food-contact grade', 'IML, sleeve and offset decoration', 'From 100 ml pot to 1 litre bowl'],
        alt: 'Range of trays, kraft boxes and cups for takeaway service',
      },
      preformes: {
        title: 'PET preforms and closures',
        lead: 'Virgin preforms in every capacity plus standard or custom closures, PCO, 1881, 1810 and 30/25 necks.',
        bullets: [
          'Clear, blue-tinted or coloured',
          'Screw, sport, flip-top, push-pull',
          'Fit every filling machine',
        ],
        alt: 'PET preforms and closures in every size and colour',
      },
      raccords: {
        title: 'Plastic building fittings',
        lead: 'PE, PVC and PP fittings and accessories for drinking water, waste water and hot and cold networks.',
        bullets: [
          'PE: strength and flexibility',
          'PVC: waste water, corrosion proof',
          'PP: high chemical resistance',
        ],
        alt: 'PE, PVC and PP plastic fittings for the building trade',
      },
      logistique: {
        title: 'Industry and logistics',
        lead: 'Palox bins, KLT crates, plastic pallets, stretch film and shrink film for storage and shipping.',
        bullets: [
          'Reusable and stackable',
          '100% recyclable pallets',
          'Stretch and shrink films',
        ],
        alt: 'Palox bins, crates, plastic pallets and industrial packaging film',
      },
      poubelles: {
        title: 'Bins and containers',
        lead: 'HDPE bins in 120, 240 and 360 litres for local authorities, businesses, industry and retail sites.',
        bullets: ['UV and impact resistant HDPE', 'Wheels and ergonomic handle', '100% recyclable'],
        alt: 'Plastic bins in 120, 240 and 360 litres',
      },
    },
  },
  catalogue: {
    eyebrow: 'Product catalogue · {n} references',
    title: 'Our containers,\nyour brands',
    lead: 'Three families, one workshop. Hover a rail to stop it and read a reference.',
    railLabel: '{label}: {n} references',
    categories: {
      laitier: {
        label: 'Dairy packaging',
        blurb: 'Thermoformed pots and cups for yoghurts, fresh cheeses and dairy desserts.',
      },
      traiteur: {
        label: 'Deli & takeaway',
        blurb: 'PET trays, cups, kraft and bagasse for takeaway service and delivery.',
      },
      raccords: {
        label: 'Fittings & pipes',
        blurb: 'PPR pipes and PE, PVC, PP fittings for building water networks.',
      },
    },
    products: {
      raib: {
        brand: "Raib",
        range: 'Sweetened Raib',
        ghost: 'RAIB',
        format: 'Round pot with wide flange',
        capacity: '500 ml',
        decor: 'Full-height photo sleeve',
        description:
          'Fluted pot for fermented milk, full-body four-colour sleeve and reinforced flange for a tight seal at high line speed.',
      },
      'milkman-plain': {
        brand: "The Milkman",
        range: 'Plain Yogurt Creamy',
        ghost: 'CREAMY',
        format: 'Stackable tapered pot',
        capacity: '170 g',
        decor: '6-colour offset print + gold',
        description:
          'Satin white pot with a double stacking groove, printed directly on the body for a premium finish without an applied label.',
      },
      'milkman-greek': {
        brand: "The Milkman",
        range: 'Greek Style Light',
        ghost: 'GREEK',
        format: 'Stackable tapered pot',
        capacity: '170 g',
        decor: '6-colour offset print',
        description:
          'Greek Style variant of the Milkman range: same mould, new palette. Artwork changes without new tooling.',
      },
      danone: {
        brand: "Danone",
        range: 'Natural Plain',
        ghost: 'NATURAL',
        format: 'High-speed round pot',
        capacity: '105 g',
        decor: 'Four-colour sleeve + varnish',
        description:
          'High-volume thermoformed pot, lightweight wall and controlled rigidity for filling lines running 40,000 pots per hour.',
      },
      activia: {
        brand: "Activia",
        range: 'Natural Probiotics',
        ghost: 'ACTIVIA',
        format: 'Round pot with wide shoulder',
        capacity: '120 g',
        decor: 'Four-colour barrier sleeve',
        description:
          'Barrier pot built for probiotic cultures: full-surface artwork, structured base and a flange calibrated for aluminium sealing.',
      },
      alhana: {
        brand: "Al Hana",
        range: 'Milk drink',
        ghost: 'AL HANA',
        format: 'Tall cup',
        capacity: '250 ml',
        decor: 'Bilingual four-colour sleeve',
        description:
          'Tall cup for milk drinks, slim silhouette and a bilingual Arabic and Latin artwork band that stays legible on shelf.',
      },
      gado: {
        brand: "Gado",
        range: 'Creama Cheese',
        ghost: 'GADO',
        format: 'Low pot with wide opening',
        capacity: '200 g',
        decor: 'Two-sided in-mould label',
        description:
          'Wide-opening pot for spreadable cheese, in-mould label fused into the material: no peeling along the cold chain.',
      },
      yopolis: {
        brand: "Yopolis",
        range: 'Cream Cheese sun-dried tomato',
        ghost: 'YOPOLIS',
        format: 'Two-tone low pot',
        capacity: '200 g',
        decor: 'High-definition photo IML',
        description:
          'Red and white two-tone pot, 360-degree high-definition photographic IML and an over-cap lid.',
      },
      'ghot-sudan': {
        brand: "Ghot Sudan",
        range: 'Banana yoghurt',
        ghost: 'BANANA',
        format: 'Flared bowl',
        capacity: '400 ml',
        decor: 'Four-colour fruit sleeve',
        description:
          'Flared export bowl, full-body fruit artwork and a thickened base that holds up through long-distance palletising.',
      },
      'pet-cup-dome': {
        brand: "PET cup",
        range: 'Dome lid',
        ghost: 'SMOOTHIE',
        format: 'Crystal PET cup',
        capacity: '400 ml',
        decor: 'Plain or screen printed',
        description:
          'Crystal cup with a straw-slot dome lid: smoothies, pressed juices and iced coffee. The product stays fully visible.',
      },
      'pet-cup-flat': {
        brand: "PET cup",
        range: 'Flat lid',
        ghost: 'ICED',
        format: 'Crystal PET cup',
        capacity: '500 ml',
        decor: 'Plain or screen printed',
        description:
          'Flat lid version with a central cross slot, stacks in a dispenser and works with automatic sealing machines.',
      },
      'pet-can': {
        brand: "PET can",
        range: 'Can format',
        ghost: 'CAN',
        format: 'Seamable PET can',
        capacity: '330 ml',
        decor: 'Sleeve or label',
        description:
          'Clear PET can with a seamed aluminium lid: industrial drink look, visible contents and a tamper-evident closure.',
      },
      'pet-salad-bowl': {
        brand: "PET bowl",
        range: 'Built-in dome lid',
        ghost: 'SALAD',
        format: 'Round PET bowl',
        capacity: '750 ml',
        decor: 'Plain',
        description:
          'Bowl with a clip-on dome lid, designed for composed salads and poke bowls in a refrigerated display.',
      },
      'pet-hinged-tray': {
        brand: "PET tray",
        range: 'Rectangular hinge',
        ghost: 'TRAY',
        format: 'Hinged tray',
        capacity: '1,000 ml',
        decor: 'Plain',
        description:
          'One-piece rectangular tray, integrated hinge and clip closure: pastry, deli counters and chilled aisles.',
      },
      'pet-tart-box': {
        brand: "PET tray",
        range: 'Tart slice',
        ghost: 'PASTRY',
        format: 'Triangular tray',
        capacity: 'Single portion',
        decor: 'Plain',
        description:
          'Tall triangular shell for tart and cake slices, ribbed for rigidity and stackable in a display case.',
      },
      'pet-deli-pot': {
        brand: "PET pot",
        range: 'Round hinge',
        ghost: 'DELI',
        format: 'Round hinged pot',
        capacity: '350 ml',
        decor: 'Plain',
        description:
          'Round pot with an attached lid, fast counter filling for salads, olives and deli preparations.',
      },
      'pet-sauce-pot': {
        brand: "Sauce cup",
        range: 'Separate lid',
        ghost: 'SAUCE',
        format: 'PET portion cup',
        capacity: '30 to 120 ml',
        decor: 'Plain',
        description:
          'Sauce cup with a flat lid, a full capacity range for delivery and takeaway menus.',
      },
      'kraft-soup-pot': {
        brand: "Kraft pot",
        range: 'Soups and hot meals',
        ghost: 'KRAFT',
        format: 'Kraft board pot + lid',
        capacity: '500 ml',
        decor: 'Natural or printed kraft',
        description:
          'Double-wall board pot for soups, hot meals and desserts, vented board lid and a hot-contact lining.',
      },
      'kraft-window-box': {
        brand: "Kraft box",
        range: 'Clear window',
        ghost: 'BOX',
        format: 'Board box with window',
        capacity: 'Square format',
        decor: 'Natural or printed kraft',
        description:
          'Box with a separate window lid: pastry, gift sets and premium takeaway.',
      },
      'kraft-cup-carrier': {
        brand: "Cup carrier",
        range: 'Two and four drinks',
        ghost: 'TAKEAWAY',
        format: 'Kraft board carrier with handle',
        capacity: '2 or 4 cups',
        decor: 'Natural or printed kraft',
        description:
          'Cup carrier with a tall handle, shipped flat for storage and locked without staples or glue.',
      },
      'bagasse-box': {
        brand: "Bagasse",
        range: 'Compartment lunch box',
        ghost: 'BAGASSE',
        format: 'Hinged sugarcane fibre box',
        capacity: '2 compartments',
        decor: 'Natural fibre',
        description:
          'Sugarcane fibre meal box, compartmented, compostable and safe in both the microwave and the freezer.',
      },
      'ppr-pipe-green': {
        brand: "Q-Therm",
        range: 'Green PPR pipe',
        ghost: 'PPR',
        format: 'Polypropylene pipe',
        capacity: 'Ø 20 to 110 mm',
        decor: 'Continuous marking',
        description:
          'PPR pipe for hot and cold sanitary water networks, joined by polyfusion welding: a network with no weak point.',
      },
      'ppr-pipe-black': {
        brand: "Q-Therm",
        range: 'Pre-insulated PPR pipe',
        ghost: 'INSULATED',
        format: 'Sleeved polypropylene pipe',
        capacity: 'Ø 20 to 63 mm',
        decor: 'Continuous marking',
        description:
          'PPR pipe in an insulating sleeve: limits heat loss on risers and condensation on cold water lines.',
      },
      'ppr-valve': {
        brand: "Q-Therm",
        range: 'Ball valve',
        ghost: 'VALVE',
        format: 'Quarter-turn PPR valve',
        capacity: 'Ø 20 to 63 mm',
        decor: 'Green body',
        description:
          'Weldable quarter-turn ball valve, butterfly handle and a PPR body consistent with the rest of the network.',
      },
      'ppr-elbow': {
        brand: "Q-Therm",
        range: 'Brass threaded elbow',
        ghost: 'ELBOW',
        format: '90-degree female elbow',
        capacity: 'Ø 20 to 32 mm',
        decor: 'Brass insert',
        description:
          'Elbow with an overmoulded brass insert for threaded pick-up: connects taps and sanitary appliances.',
      },
      'ppr-tee': {
        brand: "Q-Therm",
        range: 'Brass threaded tee',
        ghost: 'TEE',
        format: 'Female branch tee',
        capacity: 'Ø 20 to 32 mm',
        decor: 'Brass insert',
        description:
          'Branch tee with a brass insert for riser tapping, thread alignment checked at assembly.',
      },
      'ppr-socket': {
        brand: "Q-Therm",
        range: 'Male threaded socket',
        ghost: 'SOCKET',
        format: 'Transition socket',
        capacity: 'Ø 20 to 63 mm',
        decor: 'Brass insert',
        description:
          'PPR to male brass thread transition socket: joins onto existing metal networks.',
      },
    },
  },
  expertise: {
    title: 'From pellet\nto site',
    lead: 'Four steps, one chain of responsibility. Nothing leaves the site until it is decorated, checked and palletised.',
    steps: {
      matiere: {
        title: 'Material and forming',
        text: 'PS, PP, PET, HDPE and cane fibre. Thermoforming, injection and blow moulding: the material is chosen for the use, never the reverse.',
      },
      decor: {
        title: 'Integrated decoration',
        text: 'In-mould label, shrink sleeve or direct offset print: the decoration is chosen for the run size, the shelf life and the budget.',
      },
      conformite: {
        title: 'Verified compliance',
        text: 'Virgin materials certified for food contact, batch traceability and a dimensional check at every production start-up.',
      },
      recyclage: {
        title: 'Material recovered',
        text: 'Trim offcuts go back through in-house grinding. Bins, pallets and crates are designed to be recycled at end of life.',
      },
    },
  },
  atelier: {
    eyebrow: 'The workshop',
    title: 'One mould,\na thousand brands',
    paragraphs: [
      'Azhar Products makes the containers dairies fill every morning. The same pot body carries a Danone, Yopolis or Milkman decoration in turn: only the decoration module changes, never the tooling.',
      'The same logic applies across the other ranges: preforms, fittings, crates and bins start from shared materials and processes, which shortens the time between an approved mock-up and the first pallet delivered.',
    ],
    stats: [
      { value: '05', label: 'Product ranges covered' },
      { value: '40,000', label: 'Units per hour per line' },
      { value: '27', label: 'Active catalogue references' },
      { value: '100%', label: 'Decoration done in house' },
    ],
    alt: {
      danone: 'Stacked Danone Natural Plain pots',
      milkman: 'The Milkman Greek Style pot',
      gado: 'Gado Creama Cheese pot',
    },
  },
  contact: {
    title: "Let's talk about\nyour run",
    lead: 'Volume, target capacity, material, decoration type: send us your brief and we come back with a sample and a price.',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    cta: 'Request a quote',
    mailSubject: 'Quote request',
  },
  footer: {
    ariaNav: 'Footer',
    site: 'The site',
    universes: 'Ranges',
    contact: 'Contact',
    rights: 'All rights reserved.',
    city: 'Mohammedia, Morocco',
  },
  company: {
    baseline: 'Package · Protect · Add value',
    addressLines: [
      'Kamal Park Center, Office 30',
      'Corner of Bd Zerktouni and Bd de Fès',
      'Building B, 5th floor, No. 30',
      '20200 Mohammedia, Morocco',
    ],
  },
};
