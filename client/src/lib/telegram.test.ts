import { describe, expect, it } from "vitest";
import { createTelegramOrderUrl, hasTelegramOrderLines } from "./telegram";

describe("Telegram order handoff", () => {
  it("does not open a handoff for an empty cart", () => {
    expect(hasTelegramOrderLines([])).toBe(false);
  });

  it("builds an encoded Russian order message with totals and multiple lines", () => {
    const url = createTelegramOrderUrl({
      lines: [{ title: "Raven Hour", quantity: 2, price: 8800 }, { title: "Black Fig", quantity: 1, price: 2400 }],
      subtotal: 20000,
      discountedSubtotal: 19120,
      shipping: 0,
      freeShipping: true,
      regionLabel: "Москва и область",
      deliveryWindow: "1–3 рабочих дня",
    });
    expect(url.startsWith("https://t.me/eloquncy?text=")).toBe(true);
    const message = decodeURIComponent(url.split("?text=")[1]);
    expect(message).toContain("Raven Hour × 2");
    expect(message).toContain("Black Fig × 1");
    expect(message).toContain("Скидка за образ");
    expect(message).toContain("Москва и область");
    expect(message).toContain(`Итого: 19\u00a0120 ₽`);
  });
});
