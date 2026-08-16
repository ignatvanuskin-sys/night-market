import { beforeEach, describe, expect, it } from "vitest";
import { CART_STORAGE_KEY, readCart, upsertCartLine, writeCart } from "./cart";

type Product = { id: string; stock: number; title: string };
const storage = new Map<string, string>();

globalThis.localStorage = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => { storage.set(key, value); },
  removeItem: (key: string) => { storage.delete(key); },
  clear: () => storage.clear(),
  key: () => null,
  length: 0,
} as Storage;

describe("cart persistence", () => {
  beforeEach(() => storage.clear());
  it("writes a versioned payload and caps quantities at stock", () => {
    const product = { id: "raven-hour", stock: 4, title: "Raven Hour" } satisfies Product;
    writeCart([{ product, quantity: 9 }]);
    expect(JSON.parse(storage.get(CART_STORAGE_KEY) || "{}").version).toBe(1);
    expect(readCart<Product>()[0]?.quantity).toBe(4);
  });
  it("drops malformed and zero-quantity lines safely", () => {
    storage.set(CART_STORAGE_KEY, JSON.stringify([{ product: null, quantity: 2 }, { product: { id: "x", stock: 3 }, quantity: 0 }]));
    expect(readCart<Product>()).toEqual([]);
  });
  it("upserts a product while refreshing its record and respecting stock", () => {
    const first = { id: "raven-hour", stock: 2, title: "Raven Hour" } satisfies Product;
    const refreshed = { ...first, title: "Raven Hour / refreshed" };
    const added = upsertCartLine([], first);
    expect(added.lines[0]?.quantity).toBe(1);
    const incremented = upsertCartLine(added.lines, refreshed);
    expect(incremented.lines[0]?.quantity).toBe(2);
    expect(incremented.lines[0]?.product.title).toContain("refreshed");
    const capped = upsertCartLine(incremented.lines, refreshed);
    expect(capped.capped).toBe(true);
    expect(capped.lines[0]?.quantity).toBe(2);
  });
});
