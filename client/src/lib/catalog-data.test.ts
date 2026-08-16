import { describe, expect, it } from "vitest";
import { catalogProductBySlug, catalogProducts } from "./catalog-data";

describe("shared product catalog", () => {
  it("contains eight routable products with truthful detail fields", () => {
    expect(catalogProducts).toHaveLength(8);
    for (const product of catalogProducts) {
      expect(product.slug).toMatch(/^[a-z0-9-]+$/);
      expect(product.descriptionRu.length).toBeGreaterThan(20);
      expect(product.price).toBeGreaterThan(0);
      expect(product.stock).toBeGreaterThanOrEqual(0);
      expect(catalogProductBySlug(product.slug)?.id).toBe(product.id);
    }
  });

  it("returns undefined for an unknown detail route", () => {
    expect(catalogProductBySlug("not-a-real-product")).toBeUndefined();
  });
});
