import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useI18n } from '../i18n';

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Les réponses restent montées, repliées par la hauteur : le texte est toujours
 * présent dans le HTML, donc lisible par les robots qui n'exécutent pas de script.
 */
export default function Faq() {
  const { t } = useI18n();
  const [openId, setOpenId] = useState<string | null>(t.faq.items[0]?.id ?? null);

  return (
    <section id="faq" className="bg-bone px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="border-line mb-9 grid gap-6 border-t pt-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:gap-10">
          <div>
            <p className="text-ink/50 mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] sm:text-[11px]">
              {t.faq.eyebrow}
            </p>
            <h2
              className="font-display whitespace-pre-line uppercase leading-[0.88]"
              style={{ fontSize: 'clamp(34px, 5.6vw, 84px)', letterSpacing: '-0.03em' }}
            >
              {t.faq.title}
            </h2>
          </div>
          <p className="text-ink-soft border-ink/15 max-w-md text-sm leading-relaxed lg:border-l lg:pl-5">
            {t.faq.lead}
          </p>
        </div>

        <dl className="border-line border-t">
          {t.faq.items.map((item) => {
            const isOpen = item.id === openId;
            const answerId = `faq-answer-${item.id}`;

            return (
              <div key={item.id} className="border-line border-b">
                <dt>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="hover:text-ink/70 focus-visible:outline-ink flex w-full items-start gap-4 py-5 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 sm:gap-6 sm:py-6"
                  >
                    <span className="flex-1 text-[15px] font-semibold leading-snug sm:text-lg">
                      {item.question}
                    </span>
                    <Plus
                      size={20}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="text-ink/45 mt-0.5 shrink-0 transition-transform duration-300 ease-out"
                      style={{ transform: `rotate(${isOpen ? 45 : 0}deg)` }}
                    />
                  </button>
                </dt>
                <motion.dd
                  id={answerId}
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.38, ease: EASE }}
                  className="m-0 overflow-hidden"
                >
                  <p className="text-ink-soft max-w-3xl pb-6 pr-10 text-sm leading-relaxed sm:text-[15px]">
                    {item.answer}
                  </p>
                </motion.dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
