interface BlobProps {
  className?: string;
  /** Accent-tinted rather than grey. Use sparingly. */
  tone?: 'panel' | 'accent';
}

/**
 * Soft organic shape used as a backdrop for floating product renders.
 *
 * Purely decorative and `aria-hidden`. Built from a border-radius quartet
 * rather than an SVG path so it scales fluidly and costs nothing to render.
 */
export function Blob({ className = '', tone = 'panel' }: BlobProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute ${
        tone === 'accent' ? 'bg-accent-bright/15' : 'bg-panel'
      } ${className}`}
      style={{ borderRadius: '58% 42% 47% 53% / 46% 51% 49% 54%' }}
    />
  );
}

/** Four-pointed sparkle, the small punctuation mark in this visual language. */
export function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`pointer-events-none absolute ${className}`}
      fill="currentColor"
    >
      <path d="M12 0c.6 6.2 5.2 10.8 12 12-6.8 1.2-11.4 5.8-12 12-.6-6.2-5.2-10.8-12-12C6.8 10.8 11.4 6.2 12 0Z" />
    </svg>
  );
}
