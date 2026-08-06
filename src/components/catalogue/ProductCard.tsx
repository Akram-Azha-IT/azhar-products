import { ArrowUpRight } from 'lucide-react';
import type { Product } from '../../data/products';
import type { ProductCopy } from '../../i18n';

type ProductCardProps = {
  product: Product;
  copy: ProductCopy;
  /** Second exemplaire de la piste : présent pour boucler, masqué aux robots. */
  isDuplicate: boolean;
};

export default function ProductCard({ product, copy, isDuplicate }: ProductCardProps) {
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
          draggable={false}
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
