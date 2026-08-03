import type { Metadata } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import '../globals.css';
import { routing, locales, type Locale } from '@/i18n/routing';
import { COMPANY } from '@/content/company';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SkipLink } from '@/components/layout/SkipLink';
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd';

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500'],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: Pick<LayoutProps, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });

  return {
    metadataBase: new URL(COMPANY.siteUrl),
    title: { default: t('title'), template: '%s' },
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        locales.map((alternate) => [alternate, `/${alternate}`]),
      ),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale,
      type: 'website',
      siteName: 'Azhar Products',
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enables static rendering for this locale segment.
  setRequestLocale(locale as Locale);

  return (
    <html lang={locale} className={`${interTight.variable} ${inter.variable}`}>
      <body className="min-h-dvh">
        <OrganizationJsonLd locale={locale as Locale} />
        <NextIntlClientProvider>
          <MotionProvider>
            <SkipLink />
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
