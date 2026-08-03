'use client';

import Image from 'next/image';
import { useState } from 'react';

import type { Locale } from '@/i18n/routing';
import type { ProductImage } from '@/content/products';

interface ProductGalleryProps {
  images: readonly ProductImage[];
  locale: Locale;
}

/** Large image with a thumbnail strip. Keyboard operable; no hover dependency. */
export function ProductGallery({ images, locale }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div>
      <div className="bg-mist">
        <Image
          src={active.src}
          alt={active.alt[locale]}
          width={1600}
          height={2000}
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="w-full"
        />
      </div>

      {images.length > 1 ? (
        <ul className="mt-4 flex flex-wrap gap-3">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-current={index === activeIndex ? 'true' : undefined}
                className={`block cursor-pointer border-2 transition-colors duration-[var(--duration-ui)] ${
                  index === activeIndex
                    ? 'border-navy-deep'
                    : 'border-transparent hover:border-steel-light'
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt[locale]}
                  width={160}
                  height={200}
                  sizes="80px"
                  className="h-20 w-16 object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
