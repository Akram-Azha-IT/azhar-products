import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Catalogue } from '@/features/catalogue/Catalogue';

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

  const t = await getTranslations('catalogue');

  return (
    <div className="px-(--spacing-gutter) pt-40 pb-(--spacing-section)">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <h1 className="mt-6 max-w-[16ch] text-(length:--text-section) font-medium">
        {t('title')}
      </h1>
      <p className="mt-8 mb-16 max-w-[52ch] text-lg leading-relaxed text-teal-body">
        {t('intro')}
      </p>

      <Catalogue />
    </div>
  );
}
