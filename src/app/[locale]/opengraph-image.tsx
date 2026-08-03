import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

import { locales } from '@/i18n/routing';

export const alt = 'Azhar Products — thermoformed food packaging';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Per-locale OpenGraph card.
 *
 * Drawn with the brand palette and system fonts only — no font fetch, no
 * remote asset — so generation cannot fail on a network hiccup at build time.
 */
/**
 * Falls back to the English source for strings that are still untranslated.
 *
 * On a page, a visible `TODO_TRANSLATE:` marker is useful — it shows exactly
 * what is outstanding. On an OpenGraph card it would be published to every
 * social feed that touches the link, so the marker is stripped here.
 */
function withoutTranslationMarker(value: string): string {
  return value.replace(/^TODO_TRANSLATE:\s*/, '');
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#10263f',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#8fa6bc',
          }}
        >
          Azhar Products
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 76,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            maxWidth: '900px',
          }}
        >
          {withoutTranslationMarker(t('headline'))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div
            style={{
              display: 'flex',
              width: '64px',
              height: '6px',
              backgroundColor: '#2e7bc4',
            }}
          />
          <div style={{ display: 'flex', fontSize: 26, color: '#8fa6bc' }}>
            Thermoformed food packaging
          </div>
        </div>
      </div>
    ),
    size,
  );
}
