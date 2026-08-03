import { Eyebrow } from './Eyebrow';

interface PlaceholderSectionProps {
  eyebrow: string;
  title: string;
  body: string;
  tone?: 'cream' | 'dark';
  className?: string;
}

/**
 * Scaffold block for a section whose real content arrives in a later phase.
 * Uses the real type scale and rhythm so the skeleton reads at the intended
 * proportions rather than as filler.
 */
export function PlaceholderSection({
  eyebrow,
  title,
  body,
  tone = 'cream',
  className = '',
}: PlaceholderSectionProps) {
  const isDark = tone === 'dark';

  return (
    <section
      className={`px-(--spacing-gutter) py-(--spacing-section) ${
        isDark ? 'bg-teal-deep text-cream' : 'bg-cream text-ink'
      } ${className}`}
    >
      <Eyebrow className={isDark ? '!text-cream/70' : ''}>{eyebrow}</Eyebrow>
      <h2 className="mt-8 max-w-[14ch] text-(length:--text-section) font-medium">
        {title}
      </h2>
      <p
        className={`mt-8 max-w-[52ch] text-lg leading-relaxed ${
          isDark ? 'text-cream/80' : 'text-teal-body'
        }`}
      >
        {body}
      </p>
    </section>
  );
}
