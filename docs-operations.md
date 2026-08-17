# NIGHT MARKET operations handoff

## Health and deployment

Render can use `GET /api/health` as a lightweight health check. It returns `{ "status": "ok", "service": "night-market" }` and does not expose credentials, customer data, or provider payloads. The production build is `pnpm run build`; the runtime is `pnpm run start` and reads the platform-provided `PORT`.

## Environment checklist

The public storefront works with the safe fallback paths. Optional integrations must be configured through Render environment variables, never committed to the repository or exposed in client code. `SHIPPING_RATES_RUB` accepts a JSON object keyed by the supported `RU_*` regions. Review and NLP credentials are server-only. The storefront does not collect online payment. Checkout prepares a URL-encoded order summary and opens the operator's Telegram chat at `https://t.me/eloquncy`; availability, address, final delivery, and payment method are confirmed manually in that chat. Carrier providers remain fallback-backed until a verified live tariff contract is supplied.

## Media delivery audit

The CDN is treated as an immutable source URL. `ProgressiveImage` derives AVIF and WebP candidates only when the source URL supports the configured transformation contract; the original CDN URL remains the final fallback. Browsers select the best supported format from `<picture>` and the width-aware `srcset`, while the original source guarantees display if a transformed candidate fails. Above-the-fold Home and Lookbook hero media stay eager; card, cart, review, Favorites, and offscreen editorial media use lazy loading. This avoids duplicate eager downloads and preserves LCP priority for the hero surfaces.

## Accessibility and failure audit

Home, Lookbook, Favorites, and Policies expose a skip link, landmark `header`/`main`/`footer` structure, labelled navigation and controls, visible focus rings, 44px mobile targets, and keyboard-safe lightbox controls. `ErrorBoundary` protects route rendering; discovery falls back to local search with a visible Russian status when the server adapter fails; reviews, shipping, images, and empty catalog states expose honest user-facing fallbacks.

## Authentication boundary

The public storefront initializes OAuth from the configured server base URL but does not require login for catalog browsing. Client bundles contain no OAuth secret, API token, or authorization header. Render should set the public OAuth variables only when account flows are enabled.

## Observability and privacy

Integration failures surface as honest empty or unavailable states. Logs must redact authorization headers, tokens, customer photos, email addresses, and provider payloads. Analytics should use aggregate events such as `favorite_added`, `cart_opened`, `telegram_order_handoff_opened`, and `shipping_region_changed`; do not send product notes, payment details, Telegram message contents, or raw user-entered search text.

## Release verification

Before a release, run `pnpm check`, `pnpm test`, `pnpm run build`, responsive preview checks for `/`, `/lookbook`, `/favorites`, and `/policies`, and direct HTML checks for route-specific title/canonical metadata. The Telegram handoff should be tested for URL encoding and correct totals; live carrier tests require provider credentials and must not be simulated with customer reviews or ratings.


## Deep-audit release runbook

Before publishing a release, check `/api/health` and confirm the response reports `status: ok` and the expected service name. Open the storefront on desktop and mobile, add one catalog item, open the cart, confirm the regional tariff and final RUB total, enter a sample comment, and exercise the Telegram CTA with navigation intercepted in a non-production preview. Verify that the decoded payload contains only products, quantities, totals, region, delivery window, and the optional comment; never send payment credentials or raw analytics payloads.

For the public release, review browser console and server logs for repeated errors, slow tRPC requests, failed image responses, and provider fallback messages. The current site intentionally uses manual Telegram confirmation, configured Russian tariff fallbacks, and an empty verified-review state. Any future live carrier, review, newsletter, or payment provider must be added behind a bounded server adapter, documented in policies, and covered by a rollback path before activation.

The branded 404 route should be checked with a deliberately unknown URL after each routing change. The global error fallback must show only safe recovery copy to visitors; stack traces may be logged in development for diagnosis but must never be rendered into production HTML.

## Runtime and no-JavaScript recovery note

The storefront is an interactive React client and the primary catalog/cart experience requires JavaScript. The server still returns route-aware HTML metadata and a branded shell, while the final error boundary and 404 route provide safe recovery copy when client rendering fails. Release verification must include direct HTTP checks for `/`, `/product/raven-hour`, `/lookbook`, `/favorites`, `/policies`, an unknown route, and `/api/health`; browser verification must confirm the catalog, product details, order preview, and Telegram handoff remain usable after hydration.

## Server order-intent boundary

Before the Telegram handoff, the public `orderIntents.prepare` procedure validates the RUB snapshot, line subtotal, discount arithmetic, supported region, canonical server price, known product ID, and server stock cap. It persists a minimal `prepared` ledger row keyed by an idempotency key; it never stores payment credentials or the full Telegram message. After opening Telegram, the client marks the same key `opened`. `local_only` is an explicit degraded state when the database is unavailable, and the UI still preserves the manual Telegram fallback with a warning. Operators should review prepared/opened rows during incident checks and treat them as intent records, not paid orders.

The current server catalog contract is intentionally small and must be updated atomically with catalog price/stock releases. The next architecture step is moving that contract to one authoritative catalog source so client and server cannot drift.
