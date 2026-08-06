// Transforme le bundle client en pages HTML complètes, une par langue.
//
// Sans cette étape le HTML servi est un <div id="root"> vide : Google finit par
// exécuter le script, mais GPTBot, PerplexityBot et ClaudeBot ne le font pas.
// C'est la différence entre être cité par un moteur génératif et en être absent.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = 'dist';
const SERVER_ENTRY = pathToFileURL(join(process.cwd(), 'dist-ssr/entry-server.js')).href;

/** Domaine canonique. Une seule valeur à changer pour un domaine personnalisé. */
const SITE_URL = process.env.SITE_URL ?? 'https://azhar-products.vercel.app';

const LOCALES = ['fr', 'en', 'de'];
const LOCALE_PATHS = { fr: '/', en: '/en/', de: '/de/' };
const OG_LOCALES = { fr: 'fr_FR', en: 'en_GB', de: 'de_DE' };
const OUTPUT_PATHS = { fr: 'index.html', en: 'en/index.html', de: 'de/index.html' };

const COMPANY = {
  name: 'Azhar Products',
  email: 'info@azhar-cons.com',
  phone: '+212521226130',
  street: 'Kamal Park Center, Bureau 30, Angle Bd Zerktouni et Bd de Fès',
  locality: 'Mohammedia',
  postalCode: '20200',
  country: 'MA',
};

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** `</script>` dans une chaîne JSON fermerait la balise qui la contient. */
const embedJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

function canonicalFor(locale) {
  return `${SITE_URL}${LOCALE_PATHS[locale]}`;
}

function alternateLinks() {
  const links = LOCALES.map(
    (locale) =>
      `<link rel="alternate" hreflang="${locale}" href="${canonicalFor(locale)}" />`,
  );
  links.push(`<link rel="alternate" hreflang="x-default" href="${canonicalFor('fr')}" />`);
  return links.join('\n    ');
}

function structuredData(locale, dictionary) {
  const { meta, faq, ranges } = dictionary;

  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: COMPANY.name,
    url: canonicalFor(locale),
    logo: `${SITE_URL}/brand/logo.png`,
    image: `${SITE_URL}/og.png`,
    description: meta.summary,
    email: COMPANY.email,
    telephone: COMPANY.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.street,
      addressLocality: COMPANY.locality,
      postalCode: COMPANY.postalCode,
      addressCountry: COMPANY.country,
    },
    areaServed: meta.areaServed.map((name) => ({ '@type': 'Place', name })),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: COMPANY.email,
        telephone: COMPANY.phone,
        availableLanguage: ['fr', 'en', 'de', 'ar'],
      },
    ],
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: canonicalFor(locale),
    name: COMPANY.name,
    inLanguage: locale,
    publisher: { '@id': `${SITE_URL}/#organization` },
  };

  const catalogue = {
    '@type': 'ItemList',
    name: dictionary.ranges.title.replace('\n', ' '),
    itemListElement: Object.keys(ranges.items).map((id, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'ProductGroup',
        name: ranges.items[id].title,
        description: ranges.items[id].lead,
        image: `${SITE_URL}/ranges/${id}.webp`,
        brand: { '@id': `${SITE_URL}/#organization` },
      },
    })),
  };

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${canonicalFor(locale)}#faq`,
    inLanguage: locale,
    mainEntity: faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return { '@context': 'https://schema.org', '@graph': [organization, website, catalogue, faqPage] };
}

function buildHead(locale, dictionary) {
  const { meta } = dictionary;
  const canonical = canonicalFor(locale);
  const alternates = LOCALES.filter((code) => code !== locale)
    .map((code) => `<meta property="og:locale:alternate" content="${OG_LOCALES[code]}" />`)
    .join('\n    ');

  return `<title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <link rel="canonical" href="${canonical}" />
    ${alternateLinks()}

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${COMPANY.name}" />
    <meta property="og:locale" content="${OG_LOCALES[locale]}" />
    ${alternates}
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:image" content="${SITE_URL}/og.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(COMPANY.name)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    <meta name="twitter:image" content="${SITE_URL}/og.png" />

    <meta name="geo.region" content="MA-CAS" />
    <meta name="geo.placename" content="${COMPANY.locality}" />

    <script type="application/ld+json">${embedJson(structuredData(locale, dictionary))}</script>`;
}

async function run() {
  const { render, DICTIONARIES } = await import(SERVER_ENTRY);
  const template = await readFile(join(DIST, 'index.html'), 'utf8');

  for (const locale of LOCALES) {
    const dictionary = DICTIONARIES[locale];
    const body = render(locale);

    const html = template
      .replace('<html lang="fr">', `<html lang="${locale}">`)
      .replace('<!--head-->', buildHead(locale, dictionary))
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

    const target = join(DIST, OUTPUT_PATHS[locale]);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, html);
    console.log(`${target}  ${(html.length / 1024).toFixed(1)} kB`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
