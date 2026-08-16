# NIGHT MARKET integrations

The storefront exposes three public tRPC procedures under `discovery`: `naturalLanguageSearch`, `reviews`, and `shippingQuote`. Provider credentials are server-only environment variables.

| Variable | Purpose | Empty-state behavior |
| --- | --- | --- |
| `NLP_API_BASE_URL` | Optional NLP provider base URL; the adapter calls `/search` | Deterministic intent expansion and catalog ranking |
| `NLP_API_KEY` | Server-side NLP bearer token | Provider is skipped when absent |
| `REVIEWS_PROVIDER` | Provider identifier such as `judge_me` or `yotpo` | Review panel remains empty and says archive pending |
| `REVIEWS_API_BASE_URL` | Review API base URL | No provider request when absent |
| `REVIEWS_API_TOKEN` | Server-side review token | No ratings or photos are rendered when absent |
| `REVIEWS_STORE_DOMAIN` | Provider store identifier | Used only by a configured adapter |
| `FREE_SHIPPING_THRESHOLD` | Server-controlled threshold in EUR | Defaults to `120` |

The current review adapter is intentionally provider-agnostic. It validates returned IDs, ratings from 1–5, text bodies, verification flags, and HTTPS photo URLs before returning records. It never creates review data. The regional shipping adapter currently supports `EU`, `UK`, `US`, and `OTHER` with server-side fallback rates; replace these rates with a carrier or commerce-provider quote before live checkout.

The Render deployment remains functional with all optional integration variables absent. Configure credentials only through Render Environment Variables or the managed project secrets flow, never in the frontend or repository.
