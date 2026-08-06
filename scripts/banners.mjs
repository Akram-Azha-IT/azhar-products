/**
 * Prepare les visuels de la section Univers.
 *
 * Les sources sont des fiches commerciales (captures d'ecran) : on retire les bandes
 * noires, puis on ne garde que la zone photo du produit, jamais la fiche entiere avec
 * son texte et ses coordonnees.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = join(ROOT, 'images');
const OUTPUT_DIR = join(ROOT, 'public', 'ranges');

/**
 * `crop` : zone photo en fractions de la bande utile (left, top, width, height).
 * Sans `crop`, l'image source est deja une photo produit et part telle quelle.
 */
const FILES = [
  { source: 'image1.png', name: 'alimentaire' },
  { source: 'image00.png', name: 'preformes', crop: [0.3, 0.0, 0.7, 0.58] },
  { source: 'image01.png', name: 'raccords', crop: [0.27, 0.0, 0.73, 0.55] },
  { source: 'image02.png', name: 'logistique', crop: [0.34, 0.0, 0.66, 0.58] },
  { source: 'image.png', name: 'poubelles', crop: [0.375, 0.0, 0.59, 0.63] },
];

/** Bande utile d'une capture : premieres et dernieres lignes non noires. */
async function contentBand(path) {
  const { data, info } = await sharp(path).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const rowIsDark = (y) => {
    let sum = 0;
    for (let x = 0; x < width; x += 4) {
      const offset = (y * width + x) * channels;
      sum += data[offset] + data[offset + 1] + data[offset + 2];
    }
    return sum / (3 * Math.ceil(width / 4)) < 26;
  };

  let top = 0;
  let bottom = height - 1;
  while (top < height - 1 && rowIsDark(top)) top += 1;
  while (bottom > top && rowIsDark(bottom)) bottom -= 1;

  return { left: 0, top, width, height: bottom - top + 1 };
}

await mkdir(OUTPUT_DIR, { recursive: true });

for (const { source, name, crop } of FILES) {
  const path = join(SOURCE_DIR, source);
  const band = await contentBand(path);

  const region = crop
    ? {
        left: band.left + Math.round(band.width * crop[0]),
        top: band.top + Math.round(band.height * crop[1]),
        width: Math.round(band.width * crop[2]),
        height: Math.round(band.height * crop[3]),
      }
    : band;

  const info = await sharp(path)
    .extract(region)
    .resize({ width: 1000, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(join(OUTPUT_DIR, `${name}.webp`));

  console.log(`${name}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} ko`);
}
