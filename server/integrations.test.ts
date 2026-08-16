import { describe, expect, it } from "vitest";
import { calculateShipping, fallbackNaturalSearch, getVerifiedReviews } from "./integrations";

describe("integration fallbacks", () => {
  it("returns intent-ranked products without an NLP credential", () => {
    const result = fallbackNaturalSearch("quiet botanical gift for a dark room");
    expect(result.mode).toBe("fallback");
    expect(result.intent.mood).toBe("quiet");
    expect(result.intent.theme).toBe("botanical");
    expect(result.productIds).toContain("night-herbarium");
  });

  it("returns an honest empty review state when no provider is configured", async () => {
    const result = await getVerifiedReviews("raven-hour");
    expect(result.reviews).toEqual([]);
    expect(["unavailable", "error", "connected"]).toContain(result.status);
  });

  it("calculates regional shipping and free-shipping progress", () => {
    expect(calculateShipping("EU", 50)).toMatchObject({ shipping: 8, freeShipping: false, remaining: 70 });
    expect(calculateShipping("US", 120)).toMatchObject({ shipping: 0, freeShipping: true, remaining: 0 });
  });
});
