type TelegramOrderLine = {
  title: string;
  quantity: number;
  price: number;
};

type TelegramOrderInput = {
  lines: TelegramOrderLine[];
  subtotal: number;
  discountedSubtotal: number;
  shipping: number;
  freeShipping: boolean;
  regionLabel: string;
  deliveryWindow: string;
  comment?: string;
};

export const TELEGRAM_USERNAME = "eloquncy";

export const hasTelegramOrderLines = (lines: unknown[]) => lines.length > 0;

const rub = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

export function createTelegramOrderUrl(input: TelegramOrderInput): string {
  const itemLines = input.lines.map((line) => `• ${line.title} × ${line.quantity} — ${rub(line.price * line.quantity)}`);
  const discount = input.discountedSubtotal < input.subtotal
    ? `\nСкидка за образ: −${rub(input.subtotal - input.discountedSubtotal)}`
    : "";
  const shipping = input.freeShipping ? "Бесплатно" : rub(input.shipping);
  const total = input.discountedSubtotal + (input.freeShipping ? 0 : input.shipping);
  const comment = input.comment?.trim() ? `\nКомментарий к заказу: ${input.comment.trim()}` : "";
  const message = [
    "Здравствуйте! Хочу оформить заказ в NIGHT MARKET.",
    "",
    ...itemLines,
    "",
    `Товары: ${rub(input.discountedSubtotal)}${discount}`,
    `Доставка: ${shipping}`,
    `Регион: ${input.regionLabel}`,
    `Срок: ${input.deliveryWindow}`,
    `Итого: ${rub(total)}`,
    comment,
    "",
    "Пожалуйста, подтвердите наличие, адрес доставки и способ оплаты в переписке.",
  ].join("\n");

  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
}
