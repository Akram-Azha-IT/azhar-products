import type {
  Application,
  Material,
  Product,
} from '@/content/products';
import type { Category } from '@/content/categories';

export interface ProductFilters {
  category: Category['slug'] | null;
  material: Material | null;
  application: Application | null;
  /** Inclusive upper bound in ml. Null means no capacity constraint. */
  maxCapacityMl: number | null;
}

export const EMPTY_FILTERS: ProductFilters = {
  category: null,
  material: null,
  application: null,
  maxCapacityMl: null,
};

/**
 * Facets are derived from the data rather than hardcoded, so a filter whose
 * values are entirely unknown simply does not render. That keeps the bar honest
 * while specs are still being collected, and it fills itself in as they land.
 */
export interface Facets {
  categories: readonly Category['slug'][];
  materials: readonly Material[];
  applications: readonly Application[];
  capacities: readonly number[];
}

export function deriveFacets(products: readonly Product[]): Facets {
  const categories = new Set<Category['slug']>();
  const materials = new Set<Material>();
  const applications = new Set<Application>();
  const capacities = new Set<number>();

  for (const product of products) {
    categories.add(product.category);
    if (product.material) materials.add(product.material);
    if (product.capacityMl !== null) capacities.add(product.capacityMl);
    for (const application of product.applications) {
      applications.add(application);
    }
  }

  return {
    categories: [...categories],
    materials: [...materials].sort(),
    applications: [...applications].sort(),
    capacities: [...capacities].sort((a, b) => a - b),
  };
}

export function applyFilters(
  products: readonly Product[],
  filters: ProductFilters,
): Product[] {
  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.material && product.material !== filters.material) return false;
    if (
      filters.application &&
      !product.applications.includes(filters.application)
    ) {
      return false;
    }
    if (
      filters.maxCapacityMl !== null &&
      (product.capacityMl === null || product.capacityMl > filters.maxCapacityMl)
    ) {
      return false;
    }
    return true;
  });
}

export function countActive(filters: ProductFilters): number {
  return Object.values(filters).filter((value) => value !== null).length;
}

/** Serialises filters for the address bar; null values are omitted. */
export function filtersToSearchParams(filters: ProductFilters): string {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.material) params.set('material', filters.material);
  if (filters.application) params.set('application', filters.application);
  if (filters.maxCapacityMl !== null) {
    params.set('maxCapacity', String(filters.maxCapacityMl));
  }
  return params.toString();
}

export function filtersFromSearchParams(
  search: string,
  facets: Facets,
): ProductFilters {
  const params = new URLSearchParams(search);

  const category = params.get('category') as Category['slug'] | null;
  const material = params.get('material') as Material | null;
  const application = params.get('application') as Application | null;
  const maxCapacity = Number(params.get('maxCapacity'));

  // Anything not present in the current facets is discarded rather than trusted.
  return {
    category:
      category && facets.categories.includes(category) ? category : null,
    material: material && facets.materials.includes(material) ? material : null,
    application:
      application && facets.applications.includes(application)
        ? application
        : null,
    maxCapacityMl: Number.isFinite(maxCapacity) && maxCapacity > 0
      ? maxCapacity
      : null,
  };
}
