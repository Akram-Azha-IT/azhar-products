import { useRef } from 'react';
import { RANGES } from '../../data/ranges';
import { useI18n } from '../../i18n';

/**
 * Accordéon horizontal : les cinq univers tiennent sur une seule hauteur d'écran.
 * Le panneau actif prend la place, les autres se réduisent à une tranche titrée.
 */
type RangePanelsProps = {
  activeIndex: number;
  onActivate: (index: number) => void;
  /** Suspend la rotation tant que le pointeur ou le clavier reste sur un panneau. */
  onHoldChange: (isHeld: boolean) => void;
  isHeld: boolean;
  /** Durée d'un palier, ou `null` quand la rotation est coupée (mouvement réduit). */
  autoplayMs: number | null;
};

const ACTIVE_FLEX = '6 1 0%';
const IDLE_FLEX = '1 1 0%';

export default function RangePanels({
  activeIndex,
  onActivate,
  onHoldChange,
  isHeld,
  autoplayMs,
}: RangePanelsProps) {
  const { t } = useI18n();
  const groupRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLButtonElement | null)[]>([]);

  /** Le focus qui saute d'un panneau à l'autre ne relance pas la rotation. */
  const onBlurCapture = (event: React.FocusEvent) => {
    if (!groupRef.current?.contains(event.relatedTarget as Node | null)) onHoldChange(false);
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (step === 0) return;

    event.preventDefault();
    const next = (index + step + RANGES.length) % RANGES.length;
    onActivate(next);
    panelsRef.current[next]?.focus();
  };

  return (
    <div
      ref={groupRef}
      onMouseEnter={() => onHoldChange(true)}
      onMouseLeave={() => onHoldChange(false)}
      onFocusCapture={() => onHoldChange(true)}
      onBlurCapture={onBlurCapture}
      className="flex h-[clamp(400px,56vh,580px)] gap-2"
    >
      {RANGES.map((range, index) => {
        const copy = t.ranges.items[range.id];
        const isActive = index === activeIndex;

        return (
          <button
            key={range.id}
            ref={(node) => {
              panelsRef.current[index] = node;
            }}
            type="button"
            aria-expanded={isActive}
            aria-label={copy.title}
            onMouseEnter={() => onActivate(index)}
            onFocus={() => onActivate(index)}
            onClick={() => onActivate(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
            style={{
              flex: isActive ? ACTIVE_FLEX : IDLE_FLEX,
              backgroundColor: range.bg,
              transition: 'flex 620ms cubic-bezier(0.32, 0.72, 0, 1)',
            }}
            className="group focus-visible:outline-ink relative min-w-[76px] cursor-pointer overflow-hidden rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <img
              src={range.image}
              alt=""
              loading="lazy"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out"
              style={{
                opacity: isActive ? 1 : 0,
                transform: `scale(${isActive ? 1 : 1.12})`,
              }}
            />

            {/* Voile encre : le texte reste lisible quelle que soit la photo. */}
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: isActive ? 1 : 0,
                backgroundImage:
                  'linear-gradient(to top, rgba(14,27,54,0.92) 0%, rgba(14,27,54,0.55) 42%, rgba(14,27,54,0.05) 100%)',
              }}
            />
            <div className="grain pointer-events-none absolute inset-0" />

            <span
              className="text-ink/45 absolute left-0 right-0 top-5 text-center text-[11px] font-semibold tabular-nums tracking-[0.2em] transition-opacity duration-300"
              style={{ opacity: isActive ? 0 : 1 }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>

            {/* Tranche repliée : le titre se lit de bas en haut, comme sur une tranche de livre. */}
            <span
              aria-hidden="true"
              className="font-display text-ink/80 absolute bottom-6 left-1/2 max-h-[calc(100%-5.5rem)] overflow-hidden whitespace-nowrap text-[15px] uppercase tracking-[0.02em] transition-opacity duration-300 [writing-mode:vertical-rl] [transform:translateX(-50%)_rotate(180deg)]"
              style={{ opacity: isActive ? 0 : 1 }}
            >
              {copy.title}
            </span>

            <div
              className="text-bone absolute inset-x-0 bottom-0 p-7 transition-[opacity,transform] duration-500 ease-out"
              style={{
                opacity: isActive ? 1 : 0,
                transform: `translateY(${isActive ? 0 : 16}px)`,
                transitionDelay: isActive ? '180ms' : '0ms',
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <p className="text-bone/60 mb-2 text-[11px] font-semibold tabular-nums tracking-[0.24em]">
                {String(index + 1).padStart(2, '0')} / {String(RANGES.length).padStart(2, '0')}
              </p>
              <h3
                className="font-display mb-3 uppercase leading-[0.95]"
                style={{ fontSize: 'clamp(24px, 2.3vw, 40px)', letterSpacing: '-0.01em' }}
              >
                {copy.title}
              </h3>
              <p className="text-bone/80 mb-4 max-w-md text-sm leading-relaxed">{copy.lead}</p>
              <ul className="flex flex-wrap gap-1.5">
                {copy.bullets.map((bullet, bulletIndex) => (
                  <li
                    key={bullet}
                    className="border-bone/25 text-bone/90 rounded-full border px-3 py-1.5 text-[11px] leading-none backdrop-blur-sm transition-[opacity,transform] duration-500 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: `translateY(${isActive ? 0 : 10}px)`,
                      transitionDelay: isActive ? `${260 + bulletIndex * 60}ms` : '0ms',
                    }}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Jauge du palier en cours : la rotation devient lisible, pas subie. */}
            {autoplayMs !== null && isActive && (
              <span
                key={activeIndex}
                aria-hidden="true"
                className="bg-bone/70 absolute inset-x-0 bottom-0 h-[3px] origin-left"
                style={{
                  animation: `range-progress ${autoplayMs}ms linear forwards`,
                  animationPlayState: isHeld ? 'paused' : 'running',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
