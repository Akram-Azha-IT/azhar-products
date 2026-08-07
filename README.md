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
public/brand/logo.png    logo détouré (fond transparent)
public/og.png            carte de partage OpenGraph 1200x630
scripts/cutout.mjs       détourage automatique des photos produits
scripts/banners.mjs      extraction de la zone photo des fiches de gamme
scripts/logo.mjs         détourage et recadrage du logo source
scripts/og.mjs           génération de la carte de partage
src/data/products.ts     catalogue (27 références) et 3 familles, sans texte traduisible
src/data/ranges.ts       les 5 univers présentés en section Univers
src/data/company.ts      raison sociale, téléphone, e-mail
src/i18n/                dictionnaires fr / en / de et fournisseur de langue
src/hooks/               useMediaQuery
src/components/          Hero, Nav, Marquee, Ranges, Catalogue, Expertise, Atelier, Contact, Footer
src/components/ranges/   accordéon horizontal (desktop) et liste dépliante (tactile)
```

## Référencement : prérendu et URL par langue

Le site est rendu côté client, mais il n'est **pas** servi côté client. `npm run build`
enchaîne trois étapes :

1. `build:client` produit le bundle et `dist/index.html`, qui n'est qu'un gabarit ;
2. `build:server` compile `src/entry-server.tsx` en bundle SSR dans `dist-ssr/` ;
3. `prerender` appelle ce bundle une fois par langue et écrit `dist/index.html`,
   `dist/en/index.html` et `dist/de/index.html`, contenu complet inclus.

Pourquoi : Google finit par exécuter le script d'une application cliente, mais GPTBot,
PerplexityBot et ClaudeBot ne le font pas. Sans prérendu, ces robots ne voient qu'un
`<div id="root">` vide, et le site est absent des réponses des moteurs génératifs. Chaque
page fait environ 148 kB de HTML réel.

Trois conséquences à respecter en développement :

- **La langue vient de l'URL, jamais d'un état interne.** `/` est le français, `/en/`
  l'anglais, `/de/` l'allemand. Le sélecteur de langue est fait de liens, pas de boutons.
- **Le premier rendu client doit être identique au prérendu.** `useMediaQuery` ne lit donc
  la requête média qu'après montage : le prérendu part toujours de l'hypothèse mobile.
  Ne jamais lire `window` dans un initialiseur `useState`.
- **Ne jamais démonter du contenu replié.** Les accordéons (univers, FAQ) se replient par
  la hauteur, avec le contenu monté en permanence. Un `AnimatePresence` qui démonte
  retirerait ce texte du HTML, donc de l'index.

Le `<head>` par langue (titre, description, canonical, hreflang, OpenGraph, JSON-LD) est
écrit par `scripts/prerender.mjs`, à l'emplacement du marqueur `<!--head-->` de
`index.html`. Rien qui varie selon la langue ne doit être écrit dans `index.html`.

### Données structurées

Chaque page porte un graphe JSON-LD : `Organization` (adresse, téléphone, e-mail,
`areaServed`, `contactPoint` multilingue), `WebSite`, `ItemList` des cinq univers et
`FAQPage` des sept questions. La FAQ est visible dans la page, condition posée par Google
pour un balisage `FAQPage` légitime.

### Moteurs génératifs

`public/robots.txt` autorise explicitement GPTBot, OAI-SearchBot, ClaudeBot,
PerplexityBot, Google-Extended et Applebot-Extended. `public/llms.txt` résume l'entreprise,
les cinq familles, les contenances et la procédure de devis, dans le format que les agents
lisent en priorité.

## Langues

Le site est trilingue français, anglais, allemand. Tous les textes vivent dans
`src/i18n/locales/*.ts` ; les fichiers de `src/data/` ne portent plus que la structure
(identifiants, visuels, couleurs). Les clés sont typées à partir des données réelles
(`Record<ProductId, ProductCopy>`) : une traduction manquante casse la compilation.

La langue est déduite du stockage local, puis de `navigator.languages`, puis retombe sur le
français. Le changement met à jour `<html lang>`, le titre et la méta description.

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

## Déploiement Vercel

Le projet est un site statique Vite. Vercel détecte le préréglage seul ; `vercel.json` fixe
malgré tout la commande (`npm run build`), le dossier de sortie (`dist`), les en-têtes de
sécurité et le cache.

1. Pousser la branche sur GitHub, puis « Add New Project » sur Vercel et sélectionner le dépôt.
2. Ne rien changer aux réglages détectés : build `npm run build`, sortie `dist`, Node 20.
3. Déployer. Aucune variable d'environnement n'est nécessaire, le site n'appelle aucune API.

En ligne de commande : `npx vercel` pour une préversion, `npx vercel --prod` pour la production.

### Domaine

Le domaine canonique est `https://azhar-products.com`, centralisé dans
`scripts/prerender.mjs` (constante `SITE_URL`) et surchargeable par variable
d'environnement dans les réglages du projet Vercel :

```
SITE_URL=https://www.exemple.ma
```

### DNS sur Cloudflare

Le domaine est géré par Cloudflare. Deux règles à ne pas enfreindre :

- **Proxy désactivé** (nuage gris, « DNS only ») sur les enregistrements pointant vers
  Vercel. Le proxy orange placé devant Vercel provoque des boucles de redirection et des
  échecs d'émission du certificat.
- Si le proxy devait être activé plus tard, le mode SSL/TLS de Cloudflare doit être
  **Full (strict)**, jamais « Flexible ».

Les valeurs exactes des enregistrements sont affichées par Vercel dans
`Project → Settings → Domains` après ajout du domaine : ce sont elles qui font foi, les
adresses IP d'apex de Vercel ayant déjà changé par le passé.

Trois fichiers gardent le domaine en dur et doivent être modifiés à la main, car ils sont
servis tels quels depuis `public/` :

- `public/robots.txt` : ligne `Sitemap:`
- `public/sitemap.xml` : les trois `<loc>` et tous les `hreflang`
- `public/llms.txt` : les trois liens de la section « Pages »

### En-têtes

`vercel.json` applique HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy` et une politique de sécurité du contenu. Cette dernière autorise
uniquement les scripts de même origine, les styles en ligne (React applique beaucoup de
`style`) et Google Fonts.

Deux conséquences à connaître :

- activer Vercel Web Analytics ou Speed Insights reste possible (script servi en même origine),
  mais toute autre balise tierce devra être ajoutée à `script-src` ;
- la barre d'outils Vercel des préversions est chargée depuis `vercel.live` : elle est bloquée
  par `script-src 'self'` et `frame-src 'none'`. Cela n'affecte que la préversion, pas le site.

## À compléter avant mise en ligne

Les coordonnées (`src/data/company.ts`) proviennent des fiches de gamme Azhar Products. En
revanche, les caractéristiques produits (contenances, décors, diamètres) et les chiffres de
`src/components/Atelier.tsx` ont été déduits des visuels : à relire et corriger.

Les réponses de la FAQ (`src/i18n/locales/*.ts`, clé `faq`) reprennent ces mêmes déductions,
plus un délai de devis annoncé à 48 h. Ce sont les phrases que les moteurs génératifs vont
citer telles quelles : à valider commercialement avant la mise en ligne.

Pour le référencement local, trois éléments manquent et ne peuvent pas être inventés :

- **Coordonnées GPS exactes.** Le JSON-LD porte l'adresse postale mais volontairement aucun
  bloc `geo` : des coordonnées approximatives placeraient l'entreprise au mauvais endroit sur
  les cartes. À ajouter dans `scripts/prerender.mjs` une fois relevées.
- **Fiche Google Business Profile.** C'est le premier levier de visibilité locale, devant le
  site lui-même. Une fois créée, ajouter son URL et celles des réseaux sociaux dans le champ
  `sameAs` de l'`Organization`.
- **Horaires d'ouverture** (`openingHoursSpecification`).
