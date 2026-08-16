export const CART_STORAGE_KEY = "night-market-cart";
export const CART_STORAGE_VERSION = 1;

type CartProduct = { id: string; stock: number };
export type PersistedCartLine<T extends CartProduct> = { product: T; quantity: number };
type PersistedCart<T extends CartProduct> = { version: number; lines: PersistedCartLine<T>[] };

function isLine<T extends CartProduct>(value: unknown): value is PersistedCartLine<T> {
  if (!value || typeof value !== "object") return false;
  const line = value as Partial<PersistedCartLine<T>>;
  const product = line.product as Partial<T> | undefined;
  return Boolean(product && typeof product.id === "string" && Number.isFinite(product.stock) && typeof line.quantity === "number" && Number.isFinite(line.quantity));
}

export function readCart<T extends CartProduct>(validProductIds?: ReadonlySet<string>): PersistedCartLine<T>[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    const lines = Array.isArray(parsed) ? parsed : (parsed && typeof parsed === "object" && "version" in parsed && (parsed as PersistedCart<T>).version === CART_STORAGE_VERSION ? (parsed as PersistedCart<T>).lines : []);
    if (!Array.isArray(lines)) return [];
    return lines.filter(isLine).filter((line) => !validProductIds || validProductIds.has(line.product.id)).map((line) => ({ ...line, product: line.product as T, quantity: Math.max(0, Math.min(Math.floor(line.product.stock), Math.floor(line.quantity))) })).filter((line) => line.quantity > 0);
  } catch {
    return [];
  }
}

export function writeCart<T extends CartProduct>(lines: PersistedCartLine<T>[]) {
  try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: CART_STORAGE_VERSION, lines } satisfies PersistedCart<T>)); } catch { /* Storage may be unavailable; cart remains in memory. */ }
}
