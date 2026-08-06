import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { RANGES } from '../data/ranges';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { interpolate, useI18n } from '../i18n';
import RangeList from './ranges/RangeList';
import RangePanels from './ranges/RangePanels';

const EASE = [0.32, 0.72, 0, 1] as const;
const TOTAL = String(RANGES.length).padStart(2, '0');
/** Palier de lecture : l'ouverture dure 620 ms, il reste ~3 s de lecture réelle. */
const AUTOPLAY_MS = 4200;

export default function Ranges() {
  const { t } = useI18n();
  const isWide = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  // `-1` = tout replié, seulement possible sur la liste tactile.
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHeld, setIsHeld] = useState(false);

  // La rotation ne concerne que les panneaux : sur mobile, ouvrir une fiche
  // pendant que l'utilisateur fait défiler la page se ferait contre lui.
  const isRotating = isWide && !isHeld && !prefersReducedMotion;

  useEffect(() => {
    if (!isRotating) return;
    // `activeIndex` en dépendance : un panneau choisi à la main garde un palier plein.
    const timer = window.setTimeout(
      () => setActiveIndex((index) => (index + 1) % RANGES.length),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [isRotating, activeIndex]);

  const counter = activeIndex >= 0 ? String(activeIndex + 1).padStart(2, '0') : '--';
  const titleLines = t.ranges.title.split('\n');

  return (
    <section id="univers" className="bg-bone px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="border-line mb-6 flex items-baseline justify-between gap-4 border-t pt-4">
          <p className="text-ink/50 text-[10px] font-semibold uppercase tracking-[0.24em] sm:text-[11px]">
            {interpolate(t.ranges.eyebrow, { n: RANGES.length })}
          </p>
          <p className="text-ink/40 text-[11px] font-semibold tabular-nums tracking-[0.2em]">
            <span className="text-ink">{counter}</span> / {TOTAL}
          </p>
        </div>

        <div className="mb-9 grid gap-6 lg:mb-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:gap-10">
          <h2
            className="font-display uppercase leading-[0.88]"
            style={{ fontSize: 'clamp(40px, 7vw, 108px)', letterSpacing: '-0.03em' }}
          >
            {/*
             * Révélation ligne par ligne. On anime l'opacité en plus du décalage :
             * si l'observateur d'intersection ne se déclenche pas, le titre reste
             * lisible au lieu de disparaître hors d'un masque.
             */}
            {titleLines.map((line, index) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: EASE, delay: index * 0.09 }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.24 }}
            className="text-ink-soft border-ink/15 max-w-md text-sm leading-relaxed lg:border-l lg:pl-5"
          >
            {t.ranges.lead}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
        >
          {isWide ? (
            <RangePanels
              activeIndex={activeIndex < 0 ? 0 : activeIndex}
              onActivate={setActiveIndex}
              onHoldChange={setIsHeld}
              isHeld={isHeld}
              autoplayMs={prefersReducedMotion ? null : AUTOPLAY_MS}
            />
          ) : (
            <RangeList activeIndex={activeIndex} onActivate={setActiveIndex} />
          )}
        </motion.div>
      </div>
    </section>
  );
}
