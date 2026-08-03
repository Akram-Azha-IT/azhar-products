'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Product } from '@/content/products';
import {
  EMPTY_FILTERS,
  applyFilters,
  deriveFacets,
  filtersFromSearchParams,
  filtersToSearchParams,
  type Facets,
  type ProductFilters,
} from './filters';

interface UseProductFiltersResult {
  filters: ProductFilters;
  facets: Facets;
  results: Product[];
  setFilter: <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K],
  ) => void;
  reset: () => void;
}

/**
 * Client-side catalogue filtering with the state mirrored into the URL.
 *
 * The URL is written with `history.replaceState` and read once on mount rather
 * than through `useSearchParams`, which would opt the whole route out of static
 * rendering for a value only ever needed after hydration. The result: a
 * shareable, back-button-friendly filtered URL on a statically served page.
 */
export function useProductFilters(
  products: readonly Product[],
): UseProductFiltersResult {
  const facets = useMemo(() => deriveFacets(products), [products]);
  const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS);

  // Adopt whatever the incoming URL asked for, once the DOM exists.
  useEffect(() => {
    setFilters(filtersFromSearchParams(window.location.search, facets));
  }, [facets]);

  const commit = useCallback((next: ProductFilters) => {
    setFilters(next);
    const query = filtersToSearchParams(next);
    const url = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, []);

  const setFilter = useCallback(
    <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
      // Clicking the active option clears it, so every control is a toggle.
      commit({ ...filters, [key]: filters[key] === value ? null : value });
    },
    [filters, commit],
  );

  const reset = useCallback(() => commit(EMPTY_FILTERS), [commit]);

  const results = useMemo(
    () => applyFilters(products, filters),
    [products, filters],
  );

  return { filters, facets, results, setFilter, reset };
}
