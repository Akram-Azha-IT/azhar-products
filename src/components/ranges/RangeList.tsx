import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { RANGES } from '../../data/ranges';
import { useI18n } from '../../i18n';

/**
 * Version tactile de l'accordéon : une seule fiche ouverte à la fois, les autres
 * restent des barres de 64 px. Cinq univers tiennent ainsi sur un écran et demi
 * au lieu de cinq cartes pleines à faire défiler.
 */
type RangeListProps = {
  activeIndex: number;
  onActivate: (index: number) => void;
};

const EASE = [0.32, 0.72, 0, 1] as const;

export default function RangeList({ activeIndex, onActivate }: RangeListProps) {
  const { t } = useI18n();

  return (
    <ul className="flex flex-col gap-2">
      {RANGES.map((range, index) => {
        const copy = t.ranges.items[range.id];
        const isActive = index === activeIndex;
        const panelId = `range-panel-${range.id}`;

        return (
          <li
            key={range.id}
            className="overflow-hidden rounded-2xl"
            style={{ backgroundColor: range.bg }}
          >
            <button
              type="button"
              aria-expanded={isActive}
              aria-controls={panelId}
              onClick={() => onActivate(isActive ? -1 : index)}
              className="focus-visible:outline-ink flex min-h-[64px] w-full items-center gap-3 px-4 py-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2"
            >
              <span className="text-ink/40 shrink-0 text-[11px] font-semibold tabular-nums tracking-[0.2em]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-display flex-1 text-[17px] uppercase leading-tight">
                {copy.title}
              </span>
              <Plus
                size={18}
                strokeWidth={2.25}
                aria-hidden="true"
                className="text-ink/50 shrink-0 transition-transform duration-300 ease-out"
                style={{ transform: `rotate(${isActive ? 45 : 0}deg)` }}
              />
            </button>

            {/*
             * Le contenu reste monté et se replie par la hauteur. Démonter le
             * panneau le retirerait du HTML, donc de tout ce qu'un robot sans
             * moteur de script peut lire.
             */}
            <motion.div
              id={panelId}
              initial={false}
              animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.42, ease: EASE }}
              aria-hidden={!isActive}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl">
                  <img
                    src={range.image}
                    alt={copy.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="grain pointer-events-none absolute inset-0" />
                </div>
                <p className="text-ink-soft mb-3 text-[13px] leading-relaxed">{copy.lead}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {copy.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="border-ink/15 text-ink/70 rounded-full border px-2.5 py-1 text-[11px] leading-none"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </li>
        );
      })}
    </ul>
  );
}
