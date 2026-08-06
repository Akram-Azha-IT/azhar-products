import { motion } from 'motion/react';
import { useI18n } from '../i18n';

export default function Marquee() {
  const { locale, t } = useI18n();
  const loop = [...t.marquee, ...t.marquee];

  return (
    <div className="bg-ink text-bone relative overflow-hidden py-4">
      <div className="grain pointer-events-none absolute inset-0" />
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {loop.map((word, index) => (
          <span
            key={`${locale}-${word}-${index}`}
            className="font-display flex items-center gap-10 text-lg uppercase tracking-[0.06em] sm:text-2xl"
          >
            {word}
            <span className="text-bone/40 text-base">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
