import { setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { Hero } from '@/components/home/Hero';
import { Marquee } from '@/components/home/Marquee';
import { Categories } from '@/components/home/Categories';
import { Manufacturing } from '@/components/home/Manufacturing';
import { Capabilities } from '@/components/home/Capabilities';
import { CtaBand } from '@/components/home/CtaBand';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <>
      <Hero />
      <Marquee />
      <Categories />
      <Manufacturing />
      <Capabilities />
      <CtaBand />
    </>
  );
}
