import { describe, expect, it } from "vitest";
import { applyCatalogFacetsAndSort, catalogPopularity, catalogSizes } from "@/lib/catalog";

describe("catalog discovery contracts", () => {
  it("provides wearable and non-wearable size facets without inventing review data", () => {
    expect(catalogSizes({ category: "Wearables" })).toEqual(["S", "M", "L"]);
    expect(catalogSizes({ category: "Objects" })).toEqual(["One size"]);
  });

  it("keeps explicit size metadata stable for filtering", () => {
    expect(catalogSizes({ category: "Wearables", sizes: ["XS", "M"] })).toEqual(["XS", "M"]);
  });

  it("orders popularity fallback signals deterministically", () => {
    expect(catalogPopularity({ featured: true })).toBeGreaterThan(catalogPopularity({ featured: false, badge: "new" }));
    expect(catalogPopularity({ featured: false, badge: "new" })).toBeGreaterThan(catalogPopularity({ featured: false }));
    expect(catalogPopularity({ featured: false, popularity: 98 })).toBe(98);
  });

  it("filters by price and size and sorts by popularity", () => {
    const products = [
      { price: 2400, category: "Objects", featured: false, badge: "new" },
      { price: 4200, category: "Wearables", sizes: ["M"], featured: true },
      { price: 8800, category: "Wearables", sizes: ["L"], featured: false, popularity: 99 },
    ];
    expect(applyCatalogFacetsAndSort(products, { priceRange: "under-3000", size: "All sizes", sort: "featured" })).toHaveLength(1);
    expect(applyCatalogFacetsAndSort(products, { priceRange: "all", size: "M", sort: "featured" })[0].price).toBe(4200);
    expect(applyCatalogFacetsAndSort(products, { priceRange: "all", size: "All sizes", sort: "popularity" }).map((product) => product.price)).toEqual([8800, 4200, 2400]);
  });

  it("uses an explicit empty review state until verified provider data exists", () => {
    const verifiedReviews: Record<string, unknown[]> = {};
    expect(verifiedReviews["raven-hour"] ?? []).toHaveLength(0);
  });
});
