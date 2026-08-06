import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORY_IDS, PRODUCTS, type Product } from '../data/products';
import { interpolate, useI18n } from '../i18n';
import type { ProductCopy } from '../i18n';

/** Secondes par carte : une famille longue défile plus longtemps, pas plus vite. */
const SECONDS_PER_CARD = 5.2;

function ProductCard({
  product,
  copy,
  isDuplicate,
}: {
  product: Product;
  copy: ProductCopy;
  isDuplicate: boolean;
}) {
  return (
    <article
      aria-hidden={isDuplicate || undefined}
      className="group relative mr-3 w-[248px] shrink-0 overflow-hidden rounded-2xl p-5 sm:mr-5 sm:w-[288px] sm:rounded-3xl"
      style={{ backgroundColor: product.panel }}
    >
      <div className="grain pointer-events-none absolute inset-0" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-ink/55 text-[10px] font-semibold uppercase tracking-[0.24em]">
            {copy.brand}
          </p>
          <h3 className="text-ink mt-1 truncate text-base font-bold leading-tight sm:text-lg">
            {copy.range}
          </h3>
        </div>
        <span className="border-ink/20 text-ink/60 group-hover:border-ink group-hover:text-ink flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300">
          <ArrowUpRight size={15} strokeWidth={2.25} />
        </span>
      </div>

      <div className="relative my-4 flex h-36 items-center justify-center sm:h-40">
        <img
          src={product.stack}
          alt={`${copy.brand} ${copy.range}`}
          loading="lazy"
          className="max-h-full w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
      </div>

      <div className="border-ink/10 relative flex items-baseline justify-between gap-3 border-t pt-4 text-[11px]">
        <span className="text-ink truncate font-semibold">{copy.format}</span>
        <span className="text-ink/55 shrink-0 tabular-nums">{copy.capacity}</span>
      </div>
    </article>
  );
}

export default function Catalogue() {
  const { t } = useI18n();

  return (
    <section id="catalogue" className="bg-bone px-4 py-14 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-ink/50 mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] sm:text-[11px]">
              {interpolate(t.catalogue.eyebrow, { n: PRODUCTS.length })}
            </p>
            <h2
              className="font-display whitespace-pre-line uppercase leading-[0.9]"
              style={{ fontSize: 'clamp(36px, 6vw, 92px)', letterSpacing: '-0.02em' }}
            >
              {t.catalogue.title}
            </h2>
          </div>
          <p className="text-ink-soft max-w-xs text-sm leading-relaxed">{t.catalogue.lead}</p>
        </motion.div>
      </div>

      <div className="flex flex-col gap-12 sm:gap-16">
        {CATEGORY_IDS.map((categoryId, index) => {
          const category = t.catalogue.categories[categoryId];
          const items = PRODUCTS.filter((product) => product.category === categoryId);
          const duration = `${(items.length * SECONDS_PER_CARD).toFixed(1)}s`;

          return (
            <motion.div
              key={categoryId}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="mx-auto mb-5 flex max-w-[1400px] flex-col gap-2 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-8">
                <div className="flex items-baseline gap-3">
                  <span className="text-ink/40 text-[11px] font-semibold tabular-nums tracking-[0.24em]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className="font-display uppercase leading-none"
                    style={{ fontSize: 'clamp(22px, 2.4vw, 36px)', letterSpacing: '-0.01em' }}
                  >
                    {category.label}
                  </h3>
                  <span className="text-ink/45 text-[11px] font-semibold tabular-nums">
                    {String(items.length).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-ink-soft max-w-md text-[13px] leading-relaxed">
                  {category.blurb}
                </p>
              </div>

              {/* Les rails alternent de sens pour que la page ne parte pas d'un seul côté. */}
              <div className="marquee" style={{ ['--marquee-duration' as string]: duration }}>
                <div
                  className={`marquee-track ${index % 2 === 1 ? 'marquee-track--reverse' : ''}`}
                  aria-label={interpolate(t.catalogue.railLabel, {
                    label: category.label,
                    n: items.length,
                  })}
                >
                  {/*
                   * La piste contient deux fois la liste pour boucler. Le second
                   * exemplaire est masqué aux lecteurs d'écran et aux moteurs :
                   * sans cela, chaque référence compterait en double.
                   */}
                  {[...items, ...items].map((product, cardIndex) => (
                    <ProductCard
                      key={`${product.id}-${cardIndex}`}
                      product={product}
                      copy={t.catalogue.products[product.id]}
                      isDuplicate={cardIndex >= items.length}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
