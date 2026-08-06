import { motion } from 'motion/react';
import { Boxes, Layers, Recycle, ShieldCheck, type LucideIcon } from 'lucide-react';
import { useI18n } from '../i18n';
import type { StepId } from '../i18n/types';

/** Les textes des quatre étapes vivent dans `src/i18n`, l'icône reste ici. */
const STEPS: { id: StepId; icon: LucideIcon }[] = [
  { id: 'matiere', icon: Layers },
  { id: 'decor', icon: Boxes },
  { id: 'conformite', icon: ShieldCheck },
  { id: 'recyclage', icon: Recycle },
];

export default function Expertise() {
  const { t } = useI18n();

  return (
    <section
      id="savoir-faire"
      className="bg-ink text-bone relative overflow-hidden px-4 py-14 sm:px-8 sm:py-24"
    >
      <div className="grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[1400px]">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="font-display mb-4 whitespace-pre-line uppercase leading-[0.92]"
          style={{ fontSize: 'clamp(38px, 6.5vw, 106px)', letterSpacing: '-0.02em' }}
        >
          {t.expertise.title}
        </motion.h2>

        <p className="text-bone/70 mb-14 max-w-xl text-sm leading-relaxed sm:text-base">
          {t.expertise.lead}
        </p>

        <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const copy = t.expertise.steps[step.id];

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: index * 0.08 }}
                className="bg-ink hover:bg-bone/[0.04] border-bone/15 border-t px-0 py-8 transition-colors duration-300 sm:px-6"
              >
                <step.icon className="mb-6 h-7 w-7" strokeWidth={1.5} />
                <p className="text-bone/40 mb-2 text-[11px] font-semibold tabular-nums tracking-[0.24em]">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mb-3 text-lg font-bold leading-tight">{copy.title}</h3>
                <p className="text-bone/65 text-sm leading-relaxed">{copy.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
