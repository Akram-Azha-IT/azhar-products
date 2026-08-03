/**
 * Normalises product photography into the assets the site expects.
 *
 * For each source file it:
 *   1. trims the uniform border around the subject,
 *   2. pads back out to a fixed 4:5 frame on a flat plate colour,
 *   3. resizes to 1600px wide,
 *   4. writes WebP + AVIF,
 *   5. records a tiny base64 blur placeholder in public/products/blur-map.json.
 *
 * Usage:
 *   node scripts/process-images.mjs                 # process everything in ./images
 *   node scripts/process-images.mjs --dry           # report what it would write
 *   node scripts/process-images.mjs --map scripts/image-map.json
 *
 * The map file is a plain { "<source filename>": "<output path under /public>" }
 * object. Sources with no mapping land in /public/products/_unsorted/ using a
 * slugified version of their filename, so nothing is silently dropped.
 *
 * NOTE ON BACKGROUNDS: the plate is white, not cream. The products are white
 * cups photographed on a white sweep — any threshold-based background swap
 * eats the product along with the background. The UI therefore presents these
 * images on an --off-white surface rather than pretending they are cut out.
 * See DECISIONS.md D6.
 */
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const PLATE = { r: 255, g: 255, b: 255, alpha: 1 };
const TARGET_WIDTH = 1600;
const ASPECT = 4 / 5;
const TRIM_THRESHOLD = 6;
const BLUR_WIDTH = 16;
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif']);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'images');
const publicDir = path.join(root, 'public');

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry');
const mapIndex = args.indexOf('--map');
const mapPath = mapIndex === -1 ? null : args[mapIndex + 1];

function slugify(filename) {
  return path
    .basename(filename, path.extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function loadMap() {
  if (!mapPath) return {};
  try {
    return JSON.parse(await readFile(path.resolve(root, mapPath), 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Map file not found: ${mapPath}`);
    }
    throw error;
  }
}

/** Trim the flat border, then re-pad to an exact 4:5 frame. */
async function normalise(buffer) {
  const trimmed = await sharp(buffer)
    .trim({ threshold: TRIM_THRESHOLD })
    .toBuffer();

  const { width, height } = await sharp(trimmed).metadata();
  if (!width || !height) throw new Error('Could not read image dimensions');

  // Grow the shorter axis so the subject keeps its proportions inside 4:5.
  const targetHeight = Math.max(height, Math.round(width / ASPECT));
  const targetWidth = Math.max(width, Math.round(targetHeight * ASPECT));

  return sharp(trimmed)
    .extend({
      top: Math.floor((targetHeight - height) / 2),
      bottom: Math.ceil((targetHeight - height) / 2),
      left: Math.floor((targetWidth - width) / 2),
      right: Math.ceil((targetWidth - width) / 2),
      background: PLATE,
    })
    .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
    .toBuffer();
}

async function blurPlaceholder(buffer) {
  const tiny = await sharp(buffer)
    .resize({ width: BLUR_WIDTH })
    .webp({ quality: 40 })
    .toBuffer();
  return `data:image/webp;base64,${tiny.toString('base64')}`;
}

async function main() {
  const map = await loadMap();

  let entries;
  try {
    entries = await readdir(sourceDir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Source directory not found: ${sourceDir}`);
    }
    throw error;
  }

  const sources = entries.filter((entry) =>
    SOURCE_EXTENSIONS.has(path.extname(entry).toLowerCase()),
  );

  if (sources.length === 0) {
    process.stdout.write(`No source images in ${sourceDir}\n`);
    return;
  }

  const blurMap = {};
  let written = 0;

  for (const source of sources) {
    const target =
      map[source] ?? `/products/_unsorted/${slugify(source)}.webp`;
    const withoutExtension = target.replace(/\.[a-z0-9]+$/i, '');
    const outputDir = path.join(publicDir, path.dirname(withoutExtension));

    if (isDryRun) {
      process.stdout.write(`${source}\n  -> ${withoutExtension}.{webp,avif}\n`);
      continue;
    }

    const buffer = await readFile(path.join(sourceDir, source));
    const normalised = await normalise(buffer);

    await mkdir(outputDir, { recursive: true });
    await sharp(normalised)
      .webp({ quality: 82 })
      .toFile(path.join(publicDir, `${withoutExtension}.webp`));
    await sharp(normalised)
      .avif({ quality: 60 })
      .toFile(path.join(publicDir, `${withoutExtension}.avif`));

    blurMap[`${withoutExtension}.webp`] = await blurPlaceholder(normalised);
    written += 1;
    process.stdout.write(`${source} -> ${withoutExtension}.{webp,avif}\n`);
  }

  if (isDryRun) return;

  await writeFile(
    path.join(publicDir, 'products', 'blur-map.json'),
    `${JSON.stringify(blurMap, null, 2)}\n`,
    'utf8',
  );

  process.stdout.write(`\n${written} image(s) processed.\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
