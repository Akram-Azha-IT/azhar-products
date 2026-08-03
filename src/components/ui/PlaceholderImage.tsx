interface PlaceholderImageProps {
  /** Exact path the processed asset will occupy, e.g. /products/dairy/raib-1.webp */
  filename: string;
  /** CSS aspect-ratio value, e.g. "4/5". */
  ratio?: string;
  className?: string;
}

/**
 * Stand-in for a product photograph that has not been processed yet.
 *
 * Prints the exact filename the slot expects so the hand-over is unambiguous —
 * the same paths are listed in IMAGES.md. Replaced by `next/image` as each
 * asset lands; no stock photography is ever substituted.
 */
export function PlaceholderImage({
  filename,
  ratio = '4/5',
  className = '',
}: PlaceholderImageProps) {
  return (
    <div
      role="img"
      aria-label={`Placeholder for ${filename}`}
      style={{ aspectRatio: ratio }}
      className={`flex w-full items-center justify-center border border-steel-light/30 bg-mist p-6 ${className}`}
    >
      <span className="text-center font-mono text-xs break-all text-steel">
        {filename}
      </span>
    </div>
  );
}
