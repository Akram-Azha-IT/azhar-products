# Azhar Products : site vitrine

Site vitrine Azhar Products : emballage alimentaire et traiteur, préformes PET et bouchons,
raccords plastiques bâtiment, bacs et palettes logistiques, poubelles PEHD. React 19 +
TypeScript + Vite + Tailwind CSS v4, animations avec `motion` (Framer Motion) et icônes
`lucide-react`.

Convention de rédaction : pas de tiret cadratin dans les textes du site.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + build production dans dist/
npm run preview
```

## Structure

```
images/                  photos sources (fond studio blanc) et fiches de gamme
public/products/*.webp   produits détourés servis par le site
public/ranges/*.webp     photos produit extraites des fiches de gamme (section Univers)
public/brand/logo.png    logo
scripts/cutout.mjs       détourage automatique des photos produits
scripts/banners.mjs      extraction de la zone photo des fiches de gamme
src/data/products.ts     catalogue (27 références) et 3 familles filtrables
src/data/ranges.ts       les 5 univers présentés en section Univers
src/data/company.ts      raison sociale, téléphone, e-mail, adresse
src/components/          Hero, Nav, Marquee, Ranges, Catalogue, Expertise, Atelier, Contact, Footer
```

## Détourage des visuels

`npm run cutout` régénère `public/products/*.webp` à partir de `images/`. Le fond studio blanc
est supprimé par remplissage par diffusion depuis les bords, suivi d'une ouverture
morphologique (les hautes lumières à l'intérieur du pot sont préservées) puis d'un adoucissement
du canal alpha.

Variables utiles :

- `BG_LUMA` (défaut `241`) : seuil de luminance du fond. Plus bas = plus d'ombre retirée, mais
  risque de percer le corps blanc du pot.
- `ONLY=raib-solo,gado` : ne retraiter que certaines images.

Un seuil par image se déclare directement dans la table `FILES` :
`'image21.png': { name: 'kraft-cup-carrier', luma: 210 }`. Utile pour les fonds gris et les
produits sombres (kraft, PPR noir), dont l'ombre portée reste trop foncée pour le seuil global.

`node scripts/banners.mjs` régénère `public/ranges/*.webp` : les bandes noires des captures
d'écran sont détectées ligne par ligne, puis la zone photo est extraite via le champ `crop`
(fractions left, top, width, height). Le texte et les coordonnées des fiches ne sont jamais
repris dans le site.

Pour ajouter un produit : ajouter la photo dans `images/`, la référencer dans la table `FILES`
de `scripts/cutout.mjs`, relancer `npm run cutout`, puis ajouter l'entrée dans
`src/data/products.ts`.

## À compléter avant mise en ligne

Les coordonnées (`src/data/company.ts`) proviennent des fiches de gamme Azhar Products. En
revanche, les caractéristiques produits (contenances, décors, diamètres) et les chiffres de
`src/components/Atelier.tsx` ont été déduits des visuels : à relire et corriger.
