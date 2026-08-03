'use client';

import { useTranslations } from 'next-intl';

import type { Facets, ProductFilters } from './filters';

interface FilterBarProps {
  facets: Facets;
  filters: ProductFilters;
  resultCount: number;
  activeCount: number;
  setFilter: <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K],
  ) => void;
  onReset: () => void;
}

interface FilterGroupProps {
  label: string;
  children: React.ReactNode;
}

function FilterGroup({ label, children }: FilterGroupProps) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="eyebrow mr-3 float-left text-steel">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

interface ChipProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

/** Toggle chip. Meets the 44px touch target via padding, not a fixed height. */
function Chip({ isActive, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`cursor-pointer border px-4 py-2.5 text-sm transition-colors duration-[var(--duration-ui)] ${
        isActive
          ? 'border-accent-strong bg-accent-strong text-mist'
          : 'border-steel-light/40 text-steel hover:border-navy-deep hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Sticky catalogue filter bar.
 *
 * Only groups with values render — while specs are still being collected the
 * material, application and capacity groups are simply absent rather than shown
 * empty. Each control is a toggle: selecting the active option clears it.
 */
export function FilterBar({
  facets,
  filters,
  resultCount,
  activeCount,
  setFilter,
  onReset,
}: FilterBarProps) {
  const t = useTranslations('catalogue');
  const tCategories = useTranslations('home.categories.items');

  return (
    <div className="sticky top-0 z-40 -mx-(--spacing-gutter) mb-16 border-y border-steel-light/30 bg-paper/95 px-(--spacing-gutter) py-5 backdrop-blur-sm">
      <div className="flex flex-col gap-5">
        {facets.categories.length > 0 ? (
          <FilterGroup label={t('filters.category')}>
            {facets.categories.map((category) => (
              <Chip
                key={category}
                isActive={filters.category === category}
                onClick={() => setFilter('category', category)}
              >
                {tCategories(`${category}.name`)}
              </Chip>
            ))}
          </FilterGroup>
        ) : null}

        {facets.materials.length > 0 ? (
          <FilterGroup label={t('filters.material')}>
            {facets.materials.map((material) => (
              <Chip
                key={material}
                isActive={filters.material === material}
                onClick={() => setFilter('material', material)}
              >
                {material}
              </Chip>
            ))}
          </FilterGroup>
        ) : null}

        {facets.applications.length > 0 ? (
          <FilterGroup label={t('filters.application')}>
            {facets.applications.map((application) => (
              <Chip
                key={application}
                isActive={filters.application === application}
                onClick={() => setFilter('application', application)}
              >
                {t(`applications.${application}`)}
              </Chip>
            ))}
          </FilterGroup>
        ) : null}

        {facets.capacities.length > 1 ? (
          <FilterGroup label={t('filters.capacity')}>
            {facets.capacities.map((capacity) => (
              <Chip
                key={capacity}
                isActive={filters.maxCapacityMl === capacity}
                onClick={() => setFilter('maxCapacityMl', capacity)}
              >
                {t('capacityUpTo', { value: capacity })}
              </Chip>
            ))}
          </FilterGroup>
        ) : null}

        <div className="flex items-center justify-between gap-4">
          {/* Announced politely so filtering never steals focus from the chips. */}
          <p aria-live="polite" className="text-sm text-steel">
            {t('resultCount', { count: resultCount })}
          </p>
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={onReset}
              className="cursor-pointer text-sm tracking-[0.08em] text-accent-strong uppercase underline underline-offset-4"
            >
              {t('filters.clear')}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
