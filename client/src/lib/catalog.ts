export type CatalogFacetProduct = {
  price: number;
  featured?: boolean;
  badge?: string;
  popularity?: number;
  category: string;
  sizes?: string[];
};

export type CatalogFacetFilters = {
  priceRange: "all" | "under-3000" | "3000-6000" | "over-6000";
  size: string;
  sort: "featured" | "price-low" | "price-high" | "popularity" | "newest" | "relevance";
};

export const catalogSizes = (product: Pick<CatalogFacetProduct, "category" | "sizes">) =>
  product.sizes ?? (product.category === "Wearables" ? ["S", "M", "L"] : product.category === "Digital" ? ["Digital"] : ["One size"]);

export const catalogPopularity = (product: Pick<CatalogFacetProduct, "featured" | "badge" | "popularity">) =>
  product.popularity ?? (product.featured ? 90 : product.badge === "new" ? 75 : product.badge === "limited" ? 70 : 55);

export function applyCatalogFacetsAndSort<T extends CatalogFacetProduct>(products: T[], filters: CatalogFacetFilters): T[] {
  const result = products.filter((product) => {
    const matchesPrice = filters.priceRange === "all" || (filters.priceRange === "under-3000" ? product.price < 3000 : filters.priceRange === "3000-6000" ? product.price >= 3000 && product.price <= 6000 : product.price > 6000);
    const matchesSize = filters.size === "All sizes" || catalogSizes(product).includes(filters.size);
    return matchesPrice && matchesSize;
  });
  if (filters.sort === "price-low") result.sort((a, b) => a.price - b.price);
  if (filters.sort === "price-high") result.sort((a, b) => b.price - a.price);
  if (filters.sort === "popularity") result.sort((a, b) => catalogPopularity(b) - catalogPopularity(a));
  if (filters.sort === "newest") result.sort((a, b) => Number(b.badge === "new") - Number(a.badge === "new"));
  return result;
}
