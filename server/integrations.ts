import { ENV } from "./_core/env";

export type SearchIntent = {
  mood: string | null;
  theme: string | null;
  useCase: string | null;
  material: string | null;
};

export type NaturalSearchResponse = {
  mode: "fallback" | "provider";
  query: string;
  intent: SearchIntent;
  productIds: string[];
  explanation: string;
};

export type ReviewRecord = {
  id: string;
  rating: number;
  title: string;
  body: string;
  author: string;
  verified: boolean;
  photoUrls: string[];
};

export type ReviewResponse = {
  status: "unavailable" | "connected" | "error";
  provider: string | null;
  reviews: ReviewRecord[];
};

const fallbackCatalog = [
  { id: "raven-hour", tokens: ["cloak", "wearable", "black", "after dark", "silhouette"] },
  { id: "ember-ritual", tokens: ["candle", "object", "ritual", "smoke", "orange"] },
  { id: "night-herbarium", tokens: ["botanical", "pressed", "archival", "green", "flora"] },
  { id: "black-fig", tokens: ["scent", "candle", "fig", "warm", "low flame"] },
  { id: "nocturne", tokens: ["mask", "ceramic", "sculptural", "black", "quiet"] },
  { id: "last-seance", tokens: ["print", "graphic", "poster", "violet", "occult"] },
  { id: "acid-moon", tokens: ["amulet", "lime", "metal", "strange", "gift"] },
  { id: "haunted-textures", tokens: ["digital", "texture", "paper", "smoke", "graphic"] },
];

const intentRules: Array<[keyof SearchIntent, string[], string]> = [
  ["mood", ["quiet", "calm", "slow", "strange", "dramatic", "dark", "moody"], "after-dark mood"],
  ["theme", ["ritual", "occult", "botanical", "archive", "archival", "night"], "ritual / archive theme"],
  ["useCase", ["gift", "room", "wear", "wearable", "scent", "poster", "digital"], "use-case match"],
  ["material", ["ceramic", "cotton", "metal", "paper", "wax", "glass", "texture"], "material match"],
];

function normalize(value: string) {
  return value.toLocaleLowerCase().replace(/[^A-Za-z0-9А-Яа-яЁё]+/g, " ").trim();
}

export function inferSearchIntent(query: string): SearchIntent {
  const value = normalize(query);
  return Object.fromEntries(intentRules.map(([key, tokens]) => [key, tokens.find(token => value.includes(token)) ?? null])) as SearchIntent;
}

export function fallbackNaturalSearch(query: string): NaturalSearchResponse {
  const normalized = normalize(query);
  const intent = inferSearchIntent(query);
  const ranked = fallbackCatalog
    .map(item => ({ id: item.id, score: item.tokens.reduce((score, token) => score + (normalized.includes(token) ? 1 : 0), 0) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.id);
  const productIds = ranked.length ? ranked : fallbackCatalog.slice(0, 4).map(item => item.id);
  const signals = intentRules.map(([key, tokens, label]) => intent[key] && tokens.includes(intent[key] as string) ? label : null).filter(Boolean);
  return {
    mode: "fallback",
    query,
    intent,
    productIds,
    explanation: signals.length ? `Matched by ${signals.join(", ")}.` : "Showing a curated after-dark selection.",
  };
}

async function fetchJson(url: string, init: RequestInit, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    if (!response.ok) throw new Error(`Integration request failed with ${response.status}`);
    return await response.json() as unknown;
  } finally {
    clearTimeout(timeout);
  }
}

export async function naturalLanguageSearch(query: string): Promise<NaturalSearchResponse> {
  const fallback = fallbackNaturalSearch(query);
  if (!ENV.nlpApiUrl || !ENV.nlpApiKey) return fallback;
  try {
    const payload = await fetchJson(`${ENV.nlpApiUrl.replace(/\/$/, "")}/search`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${ENV.nlpApiKey}` },
      body: JSON.stringify({ query, catalog: fallbackCatalog.map(({ id, tokens }) => ({ id, tokens })) }),
    }) as Partial<NaturalSearchResponse>;
    return {
      mode: "provider",
      query,
      intent: payload.intent ?? fallback.intent,
      productIds: Array.isArray(payload.productIds) ? payload.productIds.filter((id): id is string => typeof id === "string") : fallback.productIds,
      explanation: typeof payload.explanation === "string" ? payload.explanation : fallback.explanation,
    };
  } catch {
    return fallback;
  }
}

export async function getVerifiedReviews(productId: string): Promise<ReviewResponse> {
  if (!ENV.reviewsApiUrl || !ENV.reviewsApiToken || !ENV.reviewsProvider) {
    return { status: "unavailable", provider: ENV.reviewsProvider || null, reviews: [] };
  }
  try {
    const payload = await fetchJson(`${ENV.reviewsApiUrl.replace(/\/$/, "")}/reviews?product_id=${encodeURIComponent(productId)}`, {
      headers: { authorization: `Bearer ${ENV.reviewsApiToken}`, accept: "application/json" },
    });
    const rows = Array.isArray(payload) ? payload : (payload as { reviews?: unknown[] })?.reviews;
    const reviews = Array.isArray(rows) ? rows.flatMap((row): ReviewRecord[] => {
      if (!row || typeof row !== "object") return [];
      const item = row as Record<string, unknown>;
      const rating = Number(item.rating);
      if (!item.id || !Number.isFinite(rating) || rating < 1 || rating > 5 || typeof item.body !== "string") return [];
      return [{ id: String(item.id), rating, title: typeof item.title === "string" ? item.title : "", body: item.body, author: typeof item.author === "string" ? item.author : "Verified customer", verified: item.verified === true, photoUrls: Array.isArray(item.photoUrls) ? item.photoUrls.filter((url): url is string => typeof url === "string" && /^https?:\/\//.test(url)) : [] }];
    }) : [];
    return { status: "connected", provider: ENV.reviewsProvider, reviews };
  } catch {
    return { status: "error", provider: ENV.reviewsProvider, reviews: [] };
  }
}

export type ShippingRegion = "RU_MOSCOW" | "RU_CENTRAL" | "RU_NORTHWEST" | "RU_SOUTH" | "RU_VOLGA" | "RU_URAL" | "RU_SIBERIA" | "RU_FAR_EAST";

// Merchant-configurable domestic delivery tariffs in RUB. These are transparent fallback tariffs,
// not live carrier quotes; replace them with a carrier/Shopify rate source when credentials are available.
const defaultShippingRates: Record<ShippingRegion, number> = { RU_MOSCOW: 299, RU_CENTRAL: 399, RU_NORTHWEST: 499, RU_SOUTH: 499, RU_VOLGA: 499, RU_URAL: 699, RU_SIBERIA: 799, RU_FAR_EAST: 999 };
const shippingRegionLabels: Record<ShippingRegion, string> = { RU_MOSCOW: "Москва и область", RU_CENTRAL: "Центральный округ", RU_NORTHWEST: "Северо-Запад", RU_SOUTH: "Юг России", RU_VOLGA: "Поволжье", RU_URAL: "Урал", RU_SIBERIA: "Сибирь", RU_FAR_EAST: "Дальний Восток" };
const configuredShippingRates: Partial<Record<ShippingRegion, number>> = (() => { try { const parsed = JSON.parse(process.env.SHIPPING_RATES_RUB ?? "{}"); return Object.fromEntries(Object.entries(parsed).filter(([key, value]) => key in defaultShippingRates && typeof value === "number" && Number.isFinite(value) && value >= 0)) as Partial<Record<ShippingRegion, number>>; } catch { return {}; } })();
const shippingRates = { ...defaultShippingRates, ...configuredShippingRates };

export function calculateShipping(region: ShippingRegion, subtotal: number) {
  const threshold = ENV.freeShippingThreshold;
  const rate = shippingRates[region] ?? shippingRates.RU_CENTRAL;
  const free = subtotal >= threshold;
  return { region, label: shippingRegionLabels[region] ?? shippingRegionLabels.RU_CENTRAL, subtotal, shipping: free ? 0 : rate, freeShipping: free, threshold, remaining: Math.max(0, threshold - subtotal), currency: "RUB" as const };
}

export type PaymentIntentRequest = { amount: number; currency: "RUB"; description: string };
export type PaymentIntentResponse = { status: "demo" | "connected" | "error"; provider: string | null; checkoutUrl: string | null; message: string };

// Payment seam: production checkout providers can be connected here without exposing credentials to the client.
export async function createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResponse> {
  if (!Number.isFinite(request.amount) || request.amount <= 0 || request.currency !== "RUB") return { status: "error", provider: null, checkoutUrl: null, message: "Некорректная сумма или валюта заказа." };
  return { status: "demo", provider: null, checkoutUrl: null, message: "Платёжный провайдер не подключён. Заказ не создан и средства не списаны." };
}
