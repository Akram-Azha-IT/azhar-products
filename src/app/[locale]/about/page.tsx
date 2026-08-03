import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { ABOUT_CHAPTERS } from '@/content/milestones';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Chapter } from '@/components/about/Chapter';
import { Timeline } from '@/components/about/Timeline';
import { CtaBand } from '@/components/home/CtaBand';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.about' });
  return { title: t('title'), description: t('description') };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations('about');

  return (
    <>
      <header className="px-(--spacing-gutter) pt-40 pb-(--spacing-section)">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] text-(length:--text-hero) font-medium">
          {t('title')}
        </h1>
        <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-teal-body">
          {t('intro')}
        </p>
      </header>

      {ABOUT_CHAPTERS.map((chapter, index) => (
        <Chapter
          key={chapter}
          chapterKey={chapter}
          index={String(index + 1).padStart(2, '0')}
          image={`/facility/${chapter}.webp`}
          isReversed={index % 2 === 1}
          tone={index === 2 ? 'dark' : 'cream'}
        />
      ))}

      <Timeline />
      <CtaBand />
    </>
  );
}
