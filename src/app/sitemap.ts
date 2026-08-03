import type { MetadataRoute } from 'next';

import { COMPANY } from '@/content/company';
import { locales } from '@/i18n/routing';

const ROUTES = ['', '/products', '/about', '/contact'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${COMPANY.siteUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alternate) => [
            alternate,
            `${COMPANY.siteUrl}/${alternate}${route}`,
          ]),
        ),
      },
    })),
  );
}
