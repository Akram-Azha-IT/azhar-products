import type { Locale } from '@/i18n/routing';
import { COMPANY, isConfirmed } from '@/content/company';

/**
 * Organization schema for the site root.
 *
 * Only confirmed fields are emitted. Publishing a placeholder phone number or a
 * guessed address into structured data would feed search engines — and Google
 * Business listings downstream — something nobody can stand behind.
 */
export function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const sameAs = Object.values(COMPANY.social).filter(isConfirmed);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Azhar Products',
    description:
      'Manufacturer of thermoformed plastic food packaging — food-grade cups and containers for yogurt, cream cheese, dairy, desserts and food service.',
    url: `${COMPANY.siteUrl}/${locale}`,
    logo: `${COMPANY.siteUrl}/brand/azhar-logo.png`,
  };

  if (sameAs.length > 0) schema.sameAs = sameAs;
  if (isConfirmed(COMPANY.email)) schema.email = COMPANY.email;
  if (isConfirmed(COMPANY.phone)) schema.telephone = COMPANY.phone;
  if (isConfirmed(COMPANY.address)) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.address,
    };
  }

  return (
    <script
      type="application/ld+json"
      // Serialised from a locally-constructed object; no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
