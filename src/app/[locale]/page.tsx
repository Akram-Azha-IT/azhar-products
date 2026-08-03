import { setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { Hero } from '@/components/landing/Hero';
import { Products } from '@/components/landing/Products';
import { Expertise } from '@/components/landing/Expertise';
import { Faq } from '@/components/landing/Faq';
import { QuoteSection } from '@/components/landing/QuoteSection';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function LandingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <div id="top">
      <Hero />
      <Products />
      <Expertise />
      <Faq />
      <QuoteSection />
    </div>
  );
}
