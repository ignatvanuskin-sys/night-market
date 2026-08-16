# NIGHT MARKET integrations

The storefront exposes three public tRPC procedures under `discovery`: `naturalLanguageSearch`, `reviews`, and `shippingQuote`. Provider credentials and delivery configuration remain server-only environment variables.

| Variable | Purpose | Empty-state behavior |
| --- | --- | --- |
| `NLP_API_BASE_URL` | Optional NLP provider base URL; the adapter calls `/search` | Deterministic intent expansion and catalog ranking |
| `NLP_API_KEY` | Server-side NLP bearer token | Provider is skipped when absent |
| `REVIEWS_PROVIDER` | Provider identifier such as `judge_me` or `yotpo` | Review panel remains empty and says archive pending |
| `REVIEWS_API_BASE_URL` | Review API base URL | No provider request when absent |
| `REVIEWS_API_TOKEN` | Server-side review token | No ratings or photos are rendered when absent |
| `REVIEWS_STORE_DOMAIN` | Provider store identifier | Used only by a configured adapter |
| `FREE_SHIPPING_THRESHOLD` | Free-shipping subtotal in RUB | Defaults to `10000` |
| `SHIPPING_RATES_RUB` | Optional JSON object overriding domestic tariffs by region code | Built-in transparent RUB tariff table is used when absent or invalid |

Delivery is currently Russia-only. Supported codes are `RU_MOSCOW`, `RU_CENTRAL`, `RU_NORTHWEST`, `RU_SOUTH`, `RU_VOLGA`, `RU_URAL`, `RU_SIBERIA`, and `RU_FAR_EAST`. The built-in domestic tariff table is 299 ₽ for Moscow and region, 399 ₽ for the Central district, 499 ₽ for the Northwest, South, and Volga regions, 699 ₽ for the Urals, 799 ₽ for Siberia, and 999 ₽ for the Far East. Each `shippingQuote` response includes the region code, a human-readable `label`, the RUB tariff, the configured threshold, and free-shipping progress.

The tariff table is a deterministic merchant fallback, not a live carrier quote. A live CDEK, Boxberry, Russian Post, Shopify, or other carrier adapter can replace it later without changing the public procedure contract. Until carrier credentials and a validated rate source are configured, the storefront intentionally labels the result as a regional estimate rather than claiming real-time carrier pricing.

The review adapter is intentionally provider-agnostic. It validates returned IDs, ratings from 1–5, text bodies, verification flags, and HTTPS photo URLs before returning records. It never creates review data. Configure credentials only through Render Environment Variables or the managed project secrets flow, never in the frontend or repository.
