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
