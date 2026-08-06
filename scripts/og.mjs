// Génère la carte de partage (OpenGraph / Twitter) à partir du logo détouré.
// À relancer après tout changement de logo ou de signature : npm run og
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;
const BONE = '#F6F4EF';
const INK = '#0E1B36';
const INK_SOFT = '#4A5670';
const LOGO_HEIGHT = 190;
const OUTPUT = 'public/og.png';

/** Le texte est rendu en SVG : sharp le compose sans dépendance supplémentaire. */
function textLayer() {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
      <text x="430" y="285" font-family="Arial Black, Arial, sans-serif" font-size="64"
            font-weight="900" letter-spacing="-1.2" fill="${INK}">AZHAR PRODUCTS</text>
      <text x="433" y="333" font-family="Arial, sans-serif" font-size="23"
            letter-spacing="3.6" fill="${INK_SOFT}">EMBALLER · PROTÉGER · VALORISER</text>
      <rect x="433" y="372" width="110" height="5" fill="${INK}" />
      <text x="433" y="428" font-family="Arial, sans-serif" font-size="24"
            fill="${INK_SOFT}">Emballage alimentaire · Préformes PET · Raccords</text>
      <text x="433" y="464" font-family="Arial, sans-serif" font-size="24"
            fill="${INK_SOFT}">Logistique · Poubelles PEHD · Mohammedia, Maroc</text>
    </svg>
  `);
}

async function run() {
  const logo = await sharp('public/brand/logo.png')
    .resize({ height: LOGO_HEIGHT, fit: 'inside' })
    .toBuffer();
  const { width: logoWidth } = await sharp(logo).metadata();

  await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 4, background: BONE },
  })
    .composite([
      { input: logo, top: Math.round((HEIGHT - LOGO_HEIGHT) / 2), left: 250 - (logoWidth ?? 0) / 2 },
      { input: textLayer(), top: 0, left: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(OUTPUT);

  const out = await sharp(OUTPUT).metadata();
  console.log(`${OUTPUT} ${out.width}x${out.height}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
