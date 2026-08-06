import { motion } from 'motion/react';
import ProductRail from './catalogue/ProductRail';
import { CATEGORY_IDS, PRODUCTS } from '../data/products';
import { interpolate, useI18n } from '../i18n';

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

              <ProductRail
                items={items}
                isReversed={index % 2 === 1}
                label={interpolate(t.catalogue.railLabel, {
                  label: category.label,
                  n: items.length,
                })}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
