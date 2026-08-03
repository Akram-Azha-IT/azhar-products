'use client';

import { useTranslations } from 'next-intl';

import { useRevealImage } from '@/hooks/useRevealImage';
import { useRevealText } from '@/hooks/useRevealText';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';

interface ChapterProps {
  chapterKey: string;
  index: string;
  image: string;
  /** Alternating sides keep the long scroll from settling into a rhythm. */
  isReversed?: boolean;
  tone?: 'cream' | 'dark';
}

export function Chapter({
  chapterKey,
  index,
  image,
  isReversed = false,
  tone = 'cream',
}: ChapterProps) {
  const t = useTranslations(`about.chapters.${chapterKey}`);
  const titleRef = useRevealText<HTMLHeadingElement>();
  const { ref: imageRef, innerRef } = useRevealImage<
    HTMLDivElement,
    HTMLDivElement
  >();

  const isDark = tone === 'dark';

  return (
    <section
      aria-labelledby={`chapter-${chapterKey}`}
      className={`px-(--spacing-gutter) py-(--spacing-section) ${
        isDark ? 'bg-teal-deep text-cream' : 'bg-cream text-ink'
      }`}
    >
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div className={isReversed ? 'lg:order-2' : ''}>
          <Eyebrow index={index} className={isDark ? '!text-cream/70' : ''}>
            {t('eyebrow')}
          </Eyebrow>
          <h2
            ref={titleRef}
            id={`chapter-${chapterKey}`}
            className="mt-6 max-w-[18ch] text-(length:--text-section) font-medium"
          >
            {t('title')}
          </h2>
          <p
            className={`mt-8 max-w-[52ch] text-lg leading-relaxed ${
              isDark ? 'text-cream/80' : 'text-teal-body'
            }`}
          >
            {t('body')}
          </p>
        </div>

        <div
          ref={imageRef}
          className={`overflow-hidden ${isReversed ? 'lg:order-1' : ''}`}
        >
          <div ref={innerRef}>
            <PlaceholderImage filename={image} ratio="4/3" />
          </div>
        </div>
      </div>
    </section>
  );
}
