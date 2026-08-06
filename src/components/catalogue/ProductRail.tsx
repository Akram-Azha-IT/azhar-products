import { useCallback, useEffect, useRef } from 'react';
import type { CatalogueProduct } from '../../data/products';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useI18n } from '../../i18n';
import ProductCard from './ProductCard';

/**
 * Rail défilant. Le mouvement vient d'une vraie zone de défilement animée image
 * par image, et non d'une animation CSS sur `transform` : c'est ce qui permet à
 * l'utilisateur de faire glisser le rail à la main, ce qu'un `translate` interdit.
 *
 * La pause n'est jamais définitive. Sur mobile, `:hover` reste collé après un
 * appui et figeait le rail pour de bon ; ici tout geste programme une reprise.
 */
const SPEED_PX_PER_SECOND = 46;
/** Délai après le dernier geste : le temps de lire une fiche, sans figer le rail. */
const RESUME_DELAY_MS = 1800;
/** Bornage du pas : un onglet remis au premier plan ne doit pas sauter. */
const MAX_FRAME_SECONDS = 0.05;

type ProductRailProps = {
  items: readonly CatalogueProduct[];
  label: string;
  /** Un rail sur deux part dans l'autre sens, pour éviter la dérive d'ensemble. */
  isReversed: boolean;
};

export default function ProductRail({ items, label, isReversed }: ProductRailProps) {
  const { t } = useI18n();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const resumeTimerRef = useRef<number | undefined>(undefined);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const pause = useCallback(() => {
    isPausedRef.current = true;
    window.clearTimeout(resumeTimerRef.current);
  }, []);

  const scheduleResume = useCallback((delay: number = RESUME_DELAY_MS) => {
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      isPausedRef.current = false;
    }, delay);
  }, []);

  useEffect(() => () => window.clearTimeout(resumeTimerRef.current), []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || prefersReducedMotion) return;

    const direction = isReversed ? -1 : 1;
    let frame = 0;
    let previous = performance.now();

    const step = (now: number) => {
      const elapsed = Math.min((now - previous) / 1000, MAX_FRAME_SECONDS);
      previous = now;

      if (!isPausedRef.current) {
        // La piste contient deux fois la liste : la boucle se referme à mi-largeur.
        const loop = scroller.scrollWidth / 2;
        if (loop > 0) {
          let next = scroller.scrollLeft + direction * SPEED_PX_PER_SECOND * elapsed;
          if (next >= loop) next -= loop;
          if (next < 0) next += loop;
          scroller.scrollLeft = next;
        }
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isReversed, prefersReducedMotion]);

  return (
    <div
      ref={scrollerRef}
      role="group"
      aria-label={label}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') pause();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') scheduleResume(250);
      }}
      onPointerDown={pause}
      onPointerUp={() => scheduleResume()}
      onPointerCancel={() => scheduleResume()}
      onWheel={() => {
        pause();
        scheduleResume();
      }}
      onFocusCapture={pause}
      onBlurCapture={() => scheduleResume(400)}
      className="no-scrollbar flex overflow-x-auto [overscroll-behavior-x:contain] [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]"
    >
      {[...items, ...items].map((product, cardIndex) => (
        <ProductCard
          key={`${product.id}-${cardIndex}`}
          product={product}
          copy={t.catalogue.products[product.id]}
          isDuplicate={cardIndex >= items.length}
        />
      ))}
    </div>
  );
}
