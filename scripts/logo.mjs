// Prépare le logo pour le site : détoure le fond blanc et recadre sur la marque.
// Le PNG source est fourni sur fond blanc opaque, illisible sur les fonds sombres.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SOURCE = 'images/azhar-logo.png';
const OUTPUT = 'public/brand/logo.png';
/** Au-delà de ce niveau sur les trois canaux, le pixel est considéré comme du fond. */
const WHITE_THRESHOLD = 244;

async function run() {
  const { data, info } = await sharp(SOURCE)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);
  for (let offset = 0; offset < pixels.length; offset += info.channels) {
    const [r, g, b] = [pixels[offset], pixels[offset + 1], pixels[offset + 2]];
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      pixels[offset + 3] = 0;
    }
  }

  await mkdir('public/brand', { recursive: true });
  await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .resize({ height: 256, fit: 'inside', withoutEnlargement: false })
    .png({ compressionLevel: 9 })
    .toFile(OUTPUT);

  const out = await sharp(OUTPUT).metadata();
  console.log(`${OUTPUT} ${out.width}x${out.height}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
