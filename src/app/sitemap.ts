import type { MetadataRoute } from 'next';

import { COMPANY } from '@/content/company';
import { locales } from '@/i18n/routing';
import { PRODUCTS } from '@/content/products';

const STATIC_ROUTES = ['', '/products', '/about', '/contact'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...STATIC_ROUTES,
    ...PRODUCTS.map((product) => `/products/${product.slug}` as const),
  ];

  return locales.flatMap((locale) =>
    routes.map((route) => ({
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
