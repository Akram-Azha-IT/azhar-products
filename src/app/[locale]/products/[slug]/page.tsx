import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { locales, type Locale } from '@/i18n/routing';
import { COMPANY } from '@/content/company';
import {
  PRODUCTS,
  getProductBySlug,
  getRelatedProducts,
  type Product,
} from '@/content/products';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ButtonLink } from '@/components/ui/Button';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { ProductGallery } from '@/features/catalogue/ProductGallery';
import { ProductCard } from '@/features/catalogue/ProductCard';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    PRODUCTS.map((product) => ({ locale, slug: product.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const typedLocale = locale as Locale;

  return {
    title: `${product.name[typedLocale]} — Azhar Products`,
    description: product.description[typedLocale],
    alternates: {
      canonical: `/${locale}/products/${slug}`,
      languages: Object.fromEntries(
        locales.map((alternate) => [
          alternate,
          `/${alternate}/products/${slug}`,
        ]),
      ),
    },
  };
}

/** Renders a spec value, or an em dash when the figure is not yet confirmed. */
function SpecValue({
  value,
  unit,
  pending,
}: {
  value: string | number | null;
  unit?: string;
  pending: string;
}) {
  if (value === null) return <span>{pending}</span>;
  return (
    <span className="tabular-nums">
      {value}
      {unit ? ` ${unit}` : ''}
    </span>
  );
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const typedLocale = locale as Locale;
  const t = await getTranslations('product');
  const related = getRelatedProducts(product);

  const specs: readonly {
    key: keyof typeof product;
    value: string | number | null;
    unit?: string;
  }[] = [
    { key: 'capacityMl', value: product.capacityMl, unit: t('units.ml') },
    { key: 'diameterMm', value: product.diameterMm, unit: t('units.mm') },
    { key: 'heightMm', value: product.heightMm, unit: t('units.mm') },
    { key: 'material', value: product.material },
    { key: 'lidCompatibility', value: product.lidCompatibility },
    {
      key: 'unitsPerCarton',
      value: product.unitsPerCarton,
      unit: t('units.units'),
    },
    { key: 'moq', value: product.moq, unit: t('units.units') },
  ];

  return (
    <div className="px-(--spacing-gutter) pt-40 pb-(--spacing-section)">
      <ProductJsonLd product={product} locale={typedLocale} />

      <TransitionLink
        href="/products"
        className="eyebrow text-steel underline underline-offset-4"
      >
        ← {t('backToCatalogue')}
      </TransitionLink>

      <div className="mt-10 grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
        <div>
          {product.images.length > 0 ? (
            <ProductGallery images={product.images} locale={typedLocale} />
          ) : (
            <PlaceholderImage
              filename={`/products/${product.category}/${product.slug}-1.webp`}
              ratio="4/5"
            />
          )}
        </div>

        <div>
          <h1 className="max-w-[16ch] text-(length:--text-section) font-medium">
            {product.name[typedLocale]}
          </h1>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-steel">
            {product.description[typedLocale]}
          </p>

          <h2 className="eyebrow mt-14 text-steel">{t('specsTitle')}</h2>
          <dl className="mt-4">
            {specs.map((spec) => (
              <div
                key={spec.key}
                className="flex items-baseline justify-between gap-6 border-b border-steel-light/30 py-4"
              >
                <dt className="text-sm text-steel">
                  {t(`specs.${spec.key}`)}
                </dt>
                <dd className="text-right">
                  <SpecValue
                    value={spec.value}
                    unit={spec.unit}
                    pending={t('pending')}
                  />
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            {/* Pre-fills the product in the contact form (Phase 4). */}
            <ButtonLink
              href={`/contact?product=${product.slug}`}
              variant="primary"
            >
              {t('quoteCta')}
            </ButtonLink>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section
          aria-labelledby="related-heading"
          className="mt-(--spacing-section)"
        >
          <Eyebrow className="mb-10">
            <span id="related-heading">{t('relatedTitle')}</span>
          </Eyebrow>
          <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

/**
 * Product schema. Only fields with confirmed values are emitted — publishing a
 * placeholder into structured data would feed a guess to search engines.
 */
function ProductJsonLd({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[locale],
    description: product.description[locale],
    url: `${COMPANY.siteUrl}/${locale}/products/${product.slug}`,
    brand: { '@type': 'Brand', name: 'Azhar Products' },
  };

  if (product.material) schema.material = product.material;
  if (product.images.length > 0) {
    schema.image = product.images.map(
      (image) => `${COMPANY.siteUrl}${image.src}`,
    );
  }

  return (
    <script
      type="application/ld+json"
      // Serialised from a locally-constructed object; no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
