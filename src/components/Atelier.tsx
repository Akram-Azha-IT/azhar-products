import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useI18n } from '../i18n';

export default function Atelier() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  return (
    <section
      id="atelier"
      ref={sectionRef}
      className="bg-bone relative overflow-hidden px-4 py-14 sm:px-8 sm:py-24"
    >
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="text-ink/50 mb-4 text-[11px] font-semibold uppercase tracking-[0.24em]">
            {t.atelier.eyebrow}
          </p>
          <h2
            className="font-display mb-6 whitespace-pre-line uppercase leading-[0.92]"
            style={{ fontSize: 'clamp(34px, 5.2vw, 80px)', letterSpacing: '-0.02em' }}
          >
            {t.atelier.title}
          </h2>
          {t.atelier.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={`text-ink-soft text-sm leading-relaxed sm:text-base ${
                index === 0 ? 'mb-5' : ''
              }`}
            >
              {paragraph}
            </p>
          ))}

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8">
            {t.atelier.stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: index * 0.07 }}
              >
                <dt className="font-display text-4xl leading-none sm:text-5xl">{stat.value}</dt>
                <dd className="text-ink/55 mt-2 text-xs uppercase tracking-[0.14em]">
                  {stat.label}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>

        <motion.div style={{ y }} className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 overflow-hidden rounded-3xl bg-[#C6D8F6] p-8">
              <img
                src="/products/danone-plain-stack.webp"
                alt={t.atelier.alt.danone}
                loading="lazy"
                className="mx-auto h-56 w-auto object-contain"
              />
            </div>
            <div className="overflow-hidden rounded-3xl bg-[#F7CFDD] p-6">
              <img
                src="/products/milkman-greek.webp"
                alt={t.atelier.alt.milkman}
                loading="lazy"
                className="mx-auto h-40 w-auto object-contain"
              />
            </div>
            <div className="overflow-hidden rounded-3xl bg-[#C3E3DB] p-6">
              <img
                src="/products/gado.webp"
                alt={t.atelier.alt.gado}
                loading="lazy"
                className="mx-auto h-40 w-auto object-contain"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
