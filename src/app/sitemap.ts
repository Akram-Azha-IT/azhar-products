import type { MetadataRoute } from 'next';

import { COMPANY } from '@/content/company';
import { locales } from '@/i18n/routing';

/** One page per locale — the site is a single landing document. */
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${COMPANY.siteUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        locales.map((alternate) => [
          alternate,
          `${COMPANY.siteUrl}/${alternate}`,
        ]),
      ),
    },
  }));
}
