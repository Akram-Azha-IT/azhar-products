'use client';

import { PRODUCTS } from '@/content/products';
import { countActive, filtersToSearchParams } from './filters';
import { useProductFilters } from './useProductFilters';
import { FilterBar } from './FilterBar';
import { ProductGrid } from './ProductGrid';

export function Catalogue() {
  const { filters, facets, results, setFilter, reset } =
    useProductFilters(PRODUCTS);

  return (
    <>
      <FilterBar
        facets={facets}
        filters={filters}
        resultCount={results.length}
        activeCount={countActive(filters)}
        setFilter={setFilter}
        onReset={reset}
      />
      <ProductGrid
        products={results}
        signature={filtersToSearchParams(filters)}
        onReset={reset}
      />
    </>
  );
}
