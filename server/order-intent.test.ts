import { describe, expect, it } from "vitest";
import { normalizeOrderIntent, orderIntentInputSchema } from "./order-intent";

const base = {
  idempotencyKey: "order-intent-test-123456",
  currency: "RUB" as const,
  region: "RU_MOSCOW" as const,
  regionLabel: "Москва и область",
  deliveryWindow: "1–3 рабочих дня",
  lines: [{ productId: "raven-hour", title: "Raven Hour", quantity: 1, price: 8800 }],
  subtotal: 8800,
  discountedSubtotal: 8800,
  shipping: 299,
  freeShipping: false,
  comment: "  Позвонить после 18:00  ",
};

describe("order intent boundary", () => {
  it("normalizes a valid RUB manual-order snapshot", () => {
    const result = normalizeOrderIntent(orderIntentInputSchema.parse(base));
    expect(result.total).toBe(9099);
    expect(result.comment).toBe("Позвонить после 18:00");
  });

  it("rejects a subtotal that does not match line prices", () => {
    expect(() => normalizeOrderIntent(orderIntentInputSchema.parse({ ...base, subtotal: 1 }))).toThrow("ORDER_SUBTOTAL_MISMATCH");
  });

  it("rejects free shipping with a non-zero tariff", () => {
    expect(() => normalizeOrderIntent(orderIntentInputSchema.parse({ ...base, freeShipping: true }))).toThrow("ORDER_SHIPPING_MISMATCH");
  });

  it("rejects stale price and quantity above the server stock cap", () => {
    expect(() => normalizeOrderIntent(orderIntentInputSchema.parse({ ...base, lines: [{ ...base.lines[0], price: 1 }], subtotal: 1 }))).toThrow("ORDER_PRICE_STALE");
    expect(() => normalizeOrderIntent(orderIntentInputSchema.parse({ ...base, lines: [{ ...base.lines[0], quantity: 5 }], subtotal: 44000 }))).toThrow("ORDER_STOCK_EXCEEDED");
  });
});
