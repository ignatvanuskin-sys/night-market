import { randomUUID } from "node:crypto";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { orderIntents } from "../drizzle/schema";
import { getDb } from "./db";
import { ORDER_CATALOG } from "./order-catalog";

export const orderIntentInputSchema = z.object({
  idempotencyKey: z.string().trim().min(16).max(96),
  currency: z.literal("RUB"),
  region: z.enum(["RU_MOSCOW", "RU_CENTRAL", "RU_NORTHWEST", "RU_SOUTH", "RU_VOLGA", "RU_URAL", "RU_SIBERIA", "RU_FAR_EAST"]),
  regionLabel: z.string().trim().min(2).max(80),
  deliveryWindow: z.string().trim().min(2).max(80),
  lines: z.array(z.object({
    productId: z.string().trim().min(1).max(100),
    title: z.string().trim().min(1).max(160),
    quantity: z.number().int().min(1).max(99),
    price: z.number().int().positive().max(1_000_000),
  })).min(1).max(20),
  subtotal: z.number().int().nonnegative().max(10_000_000),
  discountedSubtotal: z.number().int().nonnegative().max(10_000_000),
  shipping: z.number().int().nonnegative().max(1_000_000),
  freeShipping: z.boolean(),
  comment: z.string().trim().max(1000).optional(),
});

export type OrderIntentInput = z.infer<typeof orderIntentInputSchema>;

export function normalizeOrderIntent(input: OrderIntentInput) {
  for (const line of input.lines) {
    const canonical = ORDER_CATALOG[line.productId as keyof typeof ORDER_CATALOG];
    if (!canonical) throw new Error("ORDER_PRODUCT_UNKNOWN");
    if (line.price !== canonical.price) throw new Error("ORDER_PRICE_STALE");
    if (line.quantity > canonical.stock) throw new Error("ORDER_STOCK_EXCEEDED");
  }
  const lineSubtotal = input.lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const total = input.discountedSubtotal + (input.freeShipping ? 0 : input.shipping);
  if (lineSubtotal !== input.subtotal) throw new Error("ORDER_SUBTOTAL_MISMATCH");
  if (input.discountedSubtotal > input.subtotal) throw new Error("ORDER_DISCOUNT_MISMATCH");
  if (input.freeShipping && input.shipping !== 0) throw new Error("ORDER_SHIPPING_MISMATCH");
  return { ...input, total, comment: input.comment?.trim() || null };
}

export async function prepareOrderIntent(input: OrderIntentInput) {
  const normalized = normalizeOrderIntent(input);
  const db = await getDb();
  if (!db) return { status: "local_only" as const, orderIntentId: null, idempotencyKey: input.idempotencyKey };
  const existing = await db.select({ id: orderIntents.id, status: orderIntents.status }).from(orderIntents).where(eq(orderIntents.idempotencyKey, input.idempotencyKey)).limit(1);
  if (existing[0]) return { status: "already_prepared" as const, orderIntentId: existing[0].id, idempotencyKey: input.idempotencyKey };
  const inserted = await db.insert(orderIntents).values({
    idempotencyKey: input.idempotencyKey,
    currency: normalized.currency,
    region: normalized.region,
    subtotal: normalized.subtotal,
    discountedSubtotal: normalized.discountedSubtotal,
    shipping: normalized.freeShipping ? 0 : normalized.shipping,
    total: normalized.total,
    linesJson: JSON.stringify(normalized.lines.map(({ productId, title, quantity, price }) => ({ productId, title, quantity, price }))),
    comment: null,
  });
  return { status: "prepared" as const, orderIntentId: Number(inserted[0].insertId), idempotencyKey: input.idempotencyKey };
}

export async function markOrderIntentOpened(idempotencyKey: string) {
  const db = await getDb();
  if (!db) return { status: "local_only" as const };
  await db.update(orderIntents).set({ status: "opened", updatedAt: sql`CURRENT_TIMESTAMP` }).where(eq(orderIntents.idempotencyKey, idempotencyKey));
  return { status: "opened" as const };
}

export const newOrderIntentKey = () => randomUUID();
