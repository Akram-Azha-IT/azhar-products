import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { Hero } from '@/components/home/Hero';
import { PlaceholderSection } from '@/components/ui/PlaceholderSection';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations('home.placeholder');

  return (
    <>
      <Hero />
      <PlaceholderSection
        eyebrow={t('eyebrow')}
        title={t('title')}
        body={t('body')}
        tone="dark"
      />
    </>
  );
}
