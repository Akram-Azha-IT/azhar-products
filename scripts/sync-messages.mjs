/**
 * Keeps messages/fr.json and messages/de.json structurally identical to
 * messages/en.json.
 *
 * Missing keys are added as `TODO_TRANSLATE: <english source>`. Keys that
 * already hold a real translation are never overwritten, and keys that no
 * longer exist in English are dropped.
 *
 * Run: node scripts/sync-messages.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const MARKER = 'TODO_TRANSLATE';
const TARGET_LOCALES = ['fr', 'de'];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const messagesDir = path.join(root, 'messages');

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }
}

function merge(source, existing) {
  const result = {};

  for (const [key, value] of Object.entries(source)) {
    const current = existing?.[key];

    if (typeof value === 'object' && value !== null) {
      result[key] = merge(value, typeof current === 'object' ? current : {});
      continue;
    }

    const isUntranslated =
      typeof current !== 'string' || current.startsWith(MARKER);
    result[key] = isUntranslated ? `${MARKER}: ${value}` : current;
  }

  return result;
}

const english = await readJson(path.join(messagesDir, 'en.json'));

for (const locale of TARGET_LOCALES) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const merged = merge(english, await readJson(filePath));
  await writeFile(filePath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
  process.stdout.write(`synced messages/${locale}.json\n`);
}
