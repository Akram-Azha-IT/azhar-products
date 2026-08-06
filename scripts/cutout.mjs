/**
 * Detoure les rendus produits : le fond studio blanc (et son ombre portee) est
 * supprime par un remplissage par diffusion depuis les bords de l'image, ce qui
 * preserve les hautes lumieres blanches a l'interieur du pot.
 * Sortie : PNG transparents, rognes sur le contenu, dans public/products/.
 */
import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = join(ROOT, 'images');
const OUTPUT_DIR = join(ROOT, 'public', 'products');
const MAX_WIDTH = 1100;
const BACKGROUND_LUMA = Number(process.env.BG_LUMA ?? 241);
const EDGE_LUMA = 252;
/** Rayon d'ouverture : casse les ponts fins par lesquels le fond s'infiltre dans le pot. */
const OPENING_RADIUS = 3;

/**
 * nom de fichier source -> nom de sortie (voir src/data/products.ts).
 * Valeur objet : `luma` abaisse le seuil pour les fonds gris ou les produits sombres,
 * dont l'ombre portée n'est pas assez claire pour être vue comme du fond.
 */
const FILES = {
  'WhatsApp Image 2026-07-17 at 11.01.22 AM.jpeg': 'raib-solo',
  'WhatsApp Image 2026-07-17 at 11.01.25 AM (2).jpeg': 'raib-stack',
  'WhatsApp Image 2026-07-17 at 11.01.22 AM (1).jpeg': 'ghot-sudan',
  'WhatsApp Image 2026-07-17 at 11.01.22 AM (3).jpeg': 'milkman-plain',
  'WhatsApp Image 2026-07-17 at 11.01.22 AM (2).jpeg': 'milkman-plain-stack',
  'WhatsApp Image 2026-07-17 at 11.01.24 AM (3).jpeg': 'milkman-greek',
  'WhatsApp Image 2026-07-17 at 11.01.24 AM (2).jpeg': 'milkman-greek-stack',
  'WhatsApp Image 2026-07-17 at 11.01.24 AM (1).jpeg': 'danone-plain',
  'WhatsApp Image 2026-07-17 at 11.01.23 AM.jpeg': 'danone-plain-stack',
  'WhatsApp Image 2026-07-17 at 11.01.24 AM.jpeg': 'activia',
  'WhatsApp Image 2026-07-17 at 11.01.24 AM (4).jpeg': 'activia-stack',
  'WhatsApp Image 2026-07-17 at 11.01.23 AM (1).jpeg': 'alhana',
  'WhatsApp Image 2026-07-17 at 11.01.25 AM.jpeg': 'alhana-stack',
  'WhatsApp Image 2026-07-17 at 11.01.23 AM (2).jpeg': 'gado',
  'WhatsApp Image 2026-07-17 at 11.01.23 AM (3).jpeg': 'gado-stack',
  'WhatsApp Image 2026-07-17 at 11.01.25 AM (3).jpeg': 'yopolis',
  'WhatsApp Image 2026-07-17 at 11.01.25 AM (1).jpeg': 'yopolis-stack',

  'image2.png': 'pet-cup-dome',
  'image3.png': 'pet-can',
  'image4.png': 'pet-tart-box',
  'image5.png': 'pet-hinged-tray',
  'image6.png': 'pet-sauce-pot',
  'image7.png': 'pet-deli-pot',
  'image8.png': 'pet-cup-flat',
  'image9.png': 'pet-salad-bowl',
  'image10.png': { name: 'ppr-pipe-green', luma: 232 },
  'image11.png': { name: 'ppr-pipe-black', luma: 232 },
  'image12.png': { name: 'ppr-valve', luma: 232 },
  'image13.png': { name: 'ppr-elbow', luma: 232 },
  'image14.png': { name: 'ppr-tee', luma: 232 },
  'image15.png': { name: 'ppr-socket', luma: 232 },
  'image17.png': { name: 'bagasse-box', luma: 232 },
  'image18.png': { name: 'kraft-window-box', luma: 228 },
  'image19.png': { name: 'kraft-soup-pot', luma: 222 },
  'image21.png': { name: 'kraft-cup-carrier', luma: 210 },
};

const luma = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

/** Marque tous les pixels clairs relies a un bord de l'image. */
function floodBackground(data, width, height, channels, threshold) {
  const total = width * height;
  const isBackground = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const push = (index) => {
    if (isBackground[index]) return;
    const offset = index * channels;
    if (luma(data[offset], data[offset + 1], data[offset + 2]) < threshold) return;
    isBackground[index] = 1;
    queue[tail++] = index;
  };

  for (let x = 0; x < width; x += 1) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    push(y * width);
    push(y * width + width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    const y = (index - x) / width;
    if (x > 0) push(index - 1);
    if (x < width - 1) push(index + 1);
    if (y > 0) push(index - width);
    if (y < height - 1) push(index + width);
  }

  return isBackground;
}

/** Erode le masque, ne garde que les composantes touchant un bord, puis dilate. */
function openMask(mask, width, height, radius) {
  const eroded = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (!mask[index]) continue;
      let solid = 1;
      for (let dy = -radius; dy <= radius && solid; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          if (!mask[ny * width + nx]) {
            solid = 0;
            break;
          }
        }
      }
      eroded[index] = solid;
    }
  }

  const kept = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  const push = (index) => {
    if (kept[index] || !eroded[index]) return;
    kept[index] = 1;
    queue[tail++] = index;
  };
  for (let x = 0; x < width; x += 1) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    push(y * width);
    push(y * width + width - 1);
  }
  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    const y = (index - x) / width;
    if (x > 0) push(index - 1);
    if (x < width - 1) push(index + 1);
    if (y > 0) push(index - width);
    if (y < height - 1) push(index + width);
  }

  const dilated = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!kept[y * width + x]) continue;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const neighbour = ny * width + nx;
          if (mask[neighbour]) dilated[neighbour] = 1;
        }
      }
    }
  }

  return dilated;
}

async function cutout(sourceName, outputName, threshold) {
  const input = await readFile(join(SOURCE_DIR, sourceName));
  const resized = sharp(input).resize({ width: MAX_WIDTH, withoutEnlargement: true });
  const { data, info } = await resized.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const flooded = floodBackground(data, width, height, channels, threshold);
  const isBackground = openMask(flooded, width, height, OPENING_RADIUS);

  for (let index = 0; index < width * height; index += 1) {
    const offset = index * channels;
    if (isBackground[index]) {
      data[offset + 3] = 0;
      continue;
    }
    // Adoucit la frange : les pixels presque blancs du contour deviennent semi-transparents.
    const value = luma(data[offset], data[offset + 1], data[offset + 2]);
    if (value > threshold) {
      const ratio = Math.min(1, (value - threshold) / Math.max(1, EDGE_LUMA - threshold));
      data[offset + 3] = Math.round(255 * (1 - 0.35 * ratio));
    }
  }

  // Adoucit le contour : le masque binaire laisse sinon un bord en escalier.
  const alpha = Buffer.alloc(width * height);
  for (let index = 0; index < width * height; index += 1) {
    alpha[index] = data[index * channels + 3];
  }
  const feathered = await sharp(alpha, { raw: { width, height, channels: 1 } })
    .blur(1.1)
    .toColourspace('b-w')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const stride = feathered.info.channels;
  for (let index = 0; index < width * height; index += 1) {
    data[index * channels + 3] = feathered.data[index * stride];
  }

  const webp = await sharp(data, { raw: { width, height, channels } })
    .trim({ threshold: 1 })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toBuffer();

  await writeFile(join(OUTPUT_DIR, `${outputName}.webp`), webp);
  return webp.length;
}

await mkdir(OUTPUT_DIR, { recursive: true });

const only = process.env.ONLY?.split(',');

for (const [sourceName, target] of Object.entries(FILES)) {
  const outputName = typeof target === 'string' ? target : target.name;
  const threshold = typeof target === 'string' ? BACKGROUND_LUMA : target.luma;
  if (only && !only.includes(outputName)) continue;
  const bytes = await cutout(sourceName, outputName, threshold);
  console.log(`${outputName}.webp  ${(bytes / 1024).toFixed(0)} ko`);
}
