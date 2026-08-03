import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { PlaceholderSection } from '@/components/ui/PlaceholderSection';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.products' });
  return { title: t('title'), description: t('description') };
}

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations('products.placeholder');

  return (
    <PlaceholderSection
      eyebrow={t('eyebrow')}
      title={t('title')}
      body={t('body')}
      className="pt-40"
    />
  );
}
