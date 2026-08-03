import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';

import { routing } from './routing';

const MARKER = /^TODO_TRANSLATE:\s*/;

type MessageTree = { [key: string]: string | MessageTree };

/**
 * Strips the `TODO_TRANSLATE:` marker at render time, falling back to the
 * English source it wraps.
 *
 * The marker's job is to record what still needs a translator — it lives in
 * `messages/fr.json` and `messages/de.json` and `scripts/sync-messages.mjs`
 * keeps it accurate. Rendering it was a mistake: it inflates every string by 16
 * characters, which overflowed the header and clipped headings inside their
 * reveal masks at 375 and 768px. A visitor on /fr saw a broken layout rather
 * than an untranslated one.
 *
 * So: the files keep the marker, the page shows readable English.
 */
function stripMarkers(messages: MessageTree): MessageTree {
  const result: MessageTree = {};

  for (const [key, value] of Object.entries(messages)) {
    result[key] =
      typeof value === 'string' ? value.replace(MARKER, '') : stripMarkers(value);
  }

  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return { locale, messages: stripMarkers(messages) };
});
