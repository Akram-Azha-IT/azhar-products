import { motion, useReducedMotion } from 'motion/react';
import { COMPANY } from '../data/company';
import { useI18n } from '../i18n';

const EASE = [0.32, 0.72, 0, 1] as const;
/** Les lettres entrent l'une après l'autre : assez serré pour rester un seul mot. */
const LETTER_STAGGER = 0.045;
const FIRST_LETTER_DELAY = 0.35;

/**
 * Signature de marque en tête du héros, réservée au mobile : sous 640 px la
 * barre de navigation ne peut plus porter le nom à côté du sélecteur de langue
 * et du bouton de devis, alors c'est le héros qui l'annonce.
 */
export default function HeroBrand() {
  const { t } = useI18n();
  const prefersReducedMotion = useReducedMotion();
  const letters = Array.from(COMPANY.name);
  const lastLetterDelay = FIRST_LETTER_DELAY + letters.length * LETTER_STAGGER;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[72px] z-[55] flex flex-col items-center px-6 sm:hidden">
      {/* Le nom est découpé en lettres pour l'animation : on le redonne entier ici. */}
      <span className="sr-only">{COMPANY.name}</span>

      <p
        aria-hidden="true"
        className="font-display text-ink flex uppercase leading-none"
        style={{ fontSize: 'clamp(24px, 8vw, 40px)', letterSpacing: '0.01em' }}
      >
        {letters.map((letter, index) => (
          <motion.span
            key={`${letter}-${index}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 22, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.65,
              ease: EASE,
              delay: FIRST_LETTER_DELAY + index * LETTER_STAGGER,
            }}
            className="inline-block"
            // L'espace du nom composé doit garder sa largeur une fois découpé.
            style={letter === ' ' ? { width: '0.28em' } : undefined}
          >
            {letter === ' ' ? ' ' : letter}
          </motion.span>
        ))}
      </p>

      {/* Le trait se tire sous le nom une fois la dernière lettre posée. */}
      <motion.span
        aria-hidden="true"
        initial={prefersReducedMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: lastLetterDelay }}
        className="bg-ink/25 my-2 h-px w-24 origin-center"
      />

      <motion.p
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: lastLetterDelay + 0.18 }}
        className="text-ink/55 text-center text-[9px] font-semibold uppercase tracking-[0.26em]"
      >
        {t.company.baseline}
      </motion.p>
    </div>
  );
}
