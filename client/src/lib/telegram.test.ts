import { describe, expect, it } from "vitest";
import { createTelegramOrderUrl, hasTelegramOrderLines } from "./telegram";

describe("Telegram order handoff", () => {
  it("does not open a handoff for an empty cart", () => {
    expect(hasTelegramOrderLines([])).toBe(false);
  });

  it("includes a trimmed order comment and omits blank comments", () => {
    const withComment = createTelegramOrderUrl({ lines: [{ title: "Black Fig", quantity: 1, price: 2400 }], subtotal: 2400, discountedSubtotal: 2400, shipping: 450, freeShipping: false, regionLabel: "Урал", deliveryWindow: "4–8 рабочих дней", comment: "  Позвонить после 18:00  " });
    const withMessage = decodeURIComponent(withComment.split("?text=")[1]);
    expect(withMessage).toContain("Комментарий к заказу: Позвонить после 18:00");
    const withoutComment = createTelegramOrderUrl({ lines: [{ title: "Black Fig", quantity: 1, price: 2400 }], subtotal: 2400, discountedSubtotal: 2400, shipping: 450, freeShipping: false, regionLabel: "Урал", deliveryWindow: "4–8 рабочих дней", comment: "   " });
    expect(decodeURIComponent(withoutComment.split("?text=")[1])).not.toContain("Комментарий к заказу");
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
