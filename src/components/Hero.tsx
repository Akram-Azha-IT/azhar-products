import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { HERO_PRODUCTS } from '../data/products';
import { useI18n } from '../i18n';

const SWAP_MS = 650;
/** Enchaînement le plus court possible : la transition dure déjà SWAP_MS. */
const AUTOPLAY_MS = 2600;
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const COUNT = HERO_PRODUCTS.length;
const COMPACT_BREAKPOINT = 1280;

type Role = 'center' | 'left' | 'right' | 'back';

function roleOf(index: number, activeIndex: number): Role {
  if (index === activeIndex) return 'center';
  if (index === (activeIndex + COUNT - 1) % COUNT) return 'left';
  if (index === (activeIndex + 1) % COUNT) return 'right';
  return 'back';
}

/**
 * Chaque vignette est un carré dont la taille se déduit de la hauteur ET de la largeur
 * de la fenêtre : sur un écran étroit et haut, c'est la largeur qui borne le produit,
 * ce qui évite de le rogner sur les côtés.
 */
function styleFor(role: Role, isCompact: boolean) {
  switch (role) {
    case 'center':
      return {
        left: '50%',
        bottom: isCompact ? '29%' : '8%',
        height: isCompact ? 'min(33vh, 56vw)' : 'min(46vh, 40vw)',
        transform: `translateX(-50%) scale(${isCompact ? 1.3 : 1.42})`,
        filter: 'none',
        opacity: 1,
        zIndex: 20,
      };
    case 'left':
      return {
        left: isCompact ? '17%' : '27%',
        bottom: isCompact ? '40%' : '13%',
        height: isCompact ? 'min(9vh, 15vw)' : 'min(17vh, 15vw)',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
      };
    case 'right':
      return {
        left: isCompact ? '83%' : '73%',
        bottom: isCompact ? '40%' : '13%',
        height: isCompact ? 'min(9vh, 15vw)' : 'min(17vh, 15vw)',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
      };
    default:
      return {
        left: '50%',
        bottom: isCompact ? '40%' : '13%',
        height: isCompact ? 'min(7vh, 12vw)' : 'min(13vh, 12vw)',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(4px)',
        opacity: 0.9,
        zIndex: 5,
      };
  }
}

export default function Hero() {
  const { locale, t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  // En dessous de cette largeur, le bloc de texte ne tient plus à côté du produit :
  // on passe à l'empilement vertical (produit au-dessus, texte dessous).
  // Le prérendu part de l'hypothèse compacte, corrigée après montage.
  const [isCompact, setIsCompact] = useState(true);

  useEffect(() => {
    HERO_PRODUCTS.forEach((product) => {
      const image = new Image();
      image.src = product.image;
    });
  }, []);

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < COMPACT_BREAKPOINT);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating) return;
      setIsAnimating(true);
      setActiveIndex((previous) =>
        direction === 'next' ? (previous + 1) % COUNT : (previous + COUNT - 1) % COUNT,
      );
      window.setTimeout(() => setIsAnimating(false), SWAP_MS);
    },
    [isAnimating],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') navigate('next');
      if (event.key === 'ArrowLeft') navigate('prev');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  // La rotation ne s'arrête jamais : les flèches ne font que la devancer.
  useEffect(() => {
    const timer = window.setInterval(() => navigate('next'), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [navigate]);

  const active = HERO_PRODUCTS[activeIndex];
  const copy = t.catalogue.products[active.id];

  return (
    <section
      id="accueil"
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: active.bg,
        transition: `background-color ${SWAP_MS}ms ${EASE}`,
      }}
    >
      {/*
       * Seul titre de niveau 1 de la page. Il porte la requête réelle des
       * prospects ; le visuel du héros ne peut pas la porter puisqu'il change
       * de produit toutes les 2,6 secondes.
       */}
      <h1 className="sr-only">{t.h1}</h1>

      <div className="relative h-[100svh] w-full overflow-hidden">
        <div className="grain pointer-events-none absolute inset-0 z-50" />

        {/* Halo clair sous le pot central : détache le produit du fond coloré. */}
        <div
          className="pointer-events-none absolute left-1/2 z-[2] h-[70vmin] w-[70vmin] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            bottom: '-14vmin',
            backgroundColor: active.panel,
            transition: `background-color ${SWAP_MS}ms ${EASE}`,
          }}
        />

        <div
          className="pointer-events-none absolute inset-x-0 z-[2] flex select-none items-center justify-center"
          style={{ top: isCompact ? '26%' : '16%' }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={`${locale}-${active.id}`}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -26 }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              className="font-display whitespace-nowrap uppercase text-white"
              style={{
                fontSize: 'clamp(72px, 22vw, 300px)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              {copy.ghost}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 z-[3]">
          {HERO_PRODUCTS.map((product, index) => {
            const role = roleOf(index, activeIndex);
            const style = styleFor(role, isCompact);
            return (
              <div
                key={product.id}
                className="absolute aspect-square"
                style={{
                  ...style,
                  // Le pot grandit vers le haut : il reste posé sur la même ligne de sol.
                  transformOrigin: 'bottom center',
                  willChange: 'transform, filter, opacity',
                  transition: [
                    `transform ${SWAP_MS}ms ${EASE}`,
                    `filter ${SWAP_MS}ms ${EASE}`,
                    `opacity ${SWAP_MS}ms ${EASE}`,
                    `left ${SWAP_MS}ms ${EASE}`,
                    `bottom ${SWAP_MS}ms ${EASE}`,
                    `height ${SWAP_MS}ms ${EASE}`,
                  ].join(', '),
                }}
              >
                <img
                  src={product.image}
                  alt={`${t.catalogue.products[product.id].brand} ${t.catalogue.products[product.id].range}`}
                  draggable={false}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="h-full w-full object-contain"
                  style={{ objectPosition: 'bottom center' }}
                />
              </div>
            );
          })}
        </div>

        <div
          className={`absolute z-[60] ${
            isCompact ? 'bottom-6 left-4 sm:left-8' : 'bottom-16 left-10 2xl:left-16'
          }`}
          style={{ maxWidth: 340 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${locale}-${active.id}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <p className="text-ink/60 mb-1 text-[11px] font-semibold uppercase tracking-[0.24em]">
                {copy.format} · {copy.capacity}
              </p>
              <p className="text-ink mb-2 text-base font-bold uppercase tracking-wide sm:mb-3 sm:text-[22px]">
                {copy.brand} · {copy.range}
              </p>
              <p className="text-ink-soft mb-4 hidden text-xs leading-relaxed sm:mb-5 sm:block sm:text-sm">
                {copy.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={t.hero.prev}
              onClick={() => navigate('prev')}
              className="border-ink/70 text-ink hover:bg-ink/10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-[transform,background-color] duration-150 hover:scale-[1.08] sm:h-16 sm:w-16"
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              type="button"
              aria-label={t.hero.next}
              onClick={() => navigate('next')}
              className="border-ink/70 text-ink hover:bg-ink/10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-[transform,background-color] duration-150 hover:scale-[1.08] sm:h-16 sm:w-16"
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
            <span className="text-ink/50 ml-2 text-xs font-semibold tabular-nums tracking-[0.2em]">
              {String(activeIndex + 1).padStart(2, '0')} / {String(COUNT).padStart(2, '0')}
            </span>
          </div>
        </div>

        <a
          href="#catalogue"
          className={`text-ink absolute z-[60] flex items-center gap-2 uppercase no-underline opacity-95 transition-opacity duration-200 hover:opacity-100 ${
            isCompact ? 'bottom-6 right-4 sm:right-8' : 'bottom-16 right-10'
          }`}
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(20px, 4vw, 56px)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          {t.hero.catalogueLink}
          <ArrowRight className="h-5 w-5 sm:h-8 sm:w-8" strokeWidth={2.25} />
        </a>
      </div>
    </section>
  );
}
