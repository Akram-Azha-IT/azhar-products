import type { MetadataRoute } from 'next';

import { COMPANY } from '@/content/company';

/** The Wix original was noindex. This one is explicitly open to crawlers. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${COMPANY.siteUrl}/sitemap.xml`,
  };
}
