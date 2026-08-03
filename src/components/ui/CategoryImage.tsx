import Image from 'next/image';

import { PlaceholderImage } from './PlaceholderImage';

interface CategoryImageProps {
  /** Processed asset path, or null when none has been supplied yet. */
  src: string | null;
  /** Path the slot expects, printed on the placeholder when `src` is null. */
  expectedPath: string;
  alt: string;
  ratio?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Renders the real asset when there is one, and a labelled placeholder when
 * there is not. Keeps the "no stock photography, no borrowed shots" rule in one
 * place instead of repeating the conditional at every call site.
 */
export function CategoryImage({
  src,
  expectedPath,
  alt,
  ratio = '4/3',
  sizes,
  priority = false,
  className = '',
}: CategoryImageProps) {
  if (!src) {
    return <PlaceholderImage filename={expectedPath} ratio={ratio} />;
  }

  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`relative w-full overflow-hidden bg-mist ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain"
      />
    </div>
  );
}
