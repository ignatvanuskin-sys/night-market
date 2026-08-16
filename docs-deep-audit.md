# NIGHT MARKET — Deep Production and Product Audit

**Audit date:** 17 August 2026  
**Baseline release:** `8521d94c`  
**Public domain:** <https://occultshop-tqvscu7k.manus.space>  
**Audit basis:** repository inspection, local preview interaction, browser DOM checks, production build, typecheck, 21 unit tests, and the existing live-surface scorecard.

## Executive assessment

NIGHT MARKET is a strong, visually differentiated storefront foundation for manual Telegram-assisted ordering. The central purchase path is coherent: a visitor discovers products, filters the catalog, opens quick view, adds stock-capped lines to a persistent cart, adds a comment, and receives a prepared Telegram message for `@eloquncy`. The current release is honest about its boundaries: the site does not collect payment, does not fabricate reviews, and does not claim live carrier fulfillment.

The deep audit found no reason to replace the visual direction or Telegram ordering model. The most important remaining work is consistency and resilience around the edges of the experience. Unknown routes do not currently render the existing branded 404 page; the global error boundary exposes raw JavaScript stack traces and uses an unrelated light template; Lookbook writes a legacy unversioned cart payload that bypasses Home’s safer cart helper; and the newsletter form confirms a subscription without storing or transmitting the address. These are concrete issues that can affect trust, cross-route behavior, and user expectations.

## Scorecard before this improvement pass

| Area | Score | Evidence | Main gap |
|---|---:|---|---|
| Brand and visual system | 9.5/10 | Consistent Occult Luxury Editorial direction, image-led composition, controlled orange accent, editorial Lookbook, responsive layouts. | Product imagery is reused across several catalog items, weakening merchandising distinctiveness. |
| Discovery and conversion | 9.2/10 | Search suggestions, natural-language fallback, filters, sorting, quick view, gallery, bundle building, favorites, cart, Telegram payload. | No product-level routes; some controls remain English in a Russian-market storefront. |
| Performance and media | 8.8/10 | Published WebP/AVIF variants, lazy media, route splitting, progressive loading, vendor chunks. | Main entry remains large; no automated Lighthouse budget. |
| Accessibility and interaction | 9.1/10 | Skip links, labels, focus restoration, Escape handling, touch-target work, reduced-motion coverage, live feedback. | Dialog/menu focus trapping and browser-level regression checks are not automated. |
| SEO and crawlability | 9.2/10 | Server-injected route metadata, canonical/OG/Twitter tags, JSON-LD, sitemap, robots, manifest. | No product detail URLs or product-level offer schema. |
| Russia localization and delivery | 9.0/10 | RUB, eight Russia-only zones, delivery windows, 10,000 ₽ threshold, transparent fallback tariffs. | Live carrier calculation is intentionally not connected. |
| Security and privacy | 9.0/10 | No client secrets, bounded adapters, no payment data collection, safe local persistence, privacy notes. | Error boundary can expose stack traces; future Telegram operations need an operator process. |
| Reliability and operations | 8.8/10 | Health endpoint, build/start configuration, explicit fallbacks, typed integrations. | No formal CI browser gate or uptime/error alerting. |
| Code quality and test confidence | 9.0/10 | TypeScript, tRPC seams, 21 unit tests, clean build/typecheck. | Duplicate catalog/cart models across routes increase drift risk. |
| Trust and policy honesty | 9.5/10 | No fake reviews, manual confirmation wording, Telegram destination, delivery/privacy disclosures. | Newsletter currently implies subscription without a real persistence or delivery system. |

**Baseline overall:** approximately **9.0/10** as a high-quality manual-order storefront foundation, not as a fully automated commerce system.

## Prioritized improvement backlog

| ID | Priority | Improvement | Why it matters | Effort | Planned action |
|---|---|---|---|---:|---|
| P0-01 | P0 | Add a branded fallback route for unknown URLs. | Crawlers, shared links, and mistyped routes currently do not receive a clear NIGHT MARKET recovery path even though a generic 404 component exists. | S | Add an explicit final route with dark editorial styling, catalog and Telegram recovery actions, and route metadata. |
| P0-02 | P0 | Remove raw stack traces from the production error boundary. | Error internals are not customer-facing content and can expose implementation details. The current fallback also breaks the site’s visual language. | S | Replace with a branded, Russian-aware failure screen, safe reference copy, reload action, home action, and optional development-only console logging. |
| P0-03 | P0 | Bring Lookbook cart writes onto the versioned cart contract. | Lookbook currently writes an unversioned array directly, bypasses restricted-storage handling, and increments without stock caps. This can create cross-route cart drift. | M | Use `readCart`/`writeCart`, canonical stock caps, and a typed minimal cart line model. |
| P1-01 | P1 | Make newsletter behavior truthful. | The current form says the visitor is subscribed although no address is stored or sent. This conflicts with the project’s otherwise strong trust policy. | S | Use a transparent “request received / Telegram for updates” state until a real opt-in provider exists; do not claim delivery. |
| P1-02 | P1 | Localize high-frequency commerce controls. | English labels such as `Bag`, `Filters`, `Quick view`, `Add to bag`, and `Open cart` remain visible in a Russia-localized storefront. | M | Localize key cart, search, filter, quick-view, and status strings while retaining editorial product names. |
| P1-03 | P1 | Add a visible operator handoff preview before Telegram. | Users currently jump directly to Telegram after clicking the CTA. A concise “what will be sent” preview can reduce surprises and improve trust. | M | Add a compact confirmation state using the existing prepared payload, with edit/back and continue actions. |
| P1-04 | P1 | Improve catalog media distinctiveness. | Several products reuse the category image, which reduces product clarity and makes quick-view galleries less credible. | M/L | Replace reused images with product-specific assets when available; keep truthful fallback labels until assets exist. |
| P2-01 | P2 | Add product detail routes. | Product-level URLs would improve sharing, crawlability, deep linking, and future product schema. | L | Introduce `/product/:slug` from the canonical catalog model and add route metadata. |
| P2-02 | P2 | Add automated browser and Lighthouse gates. | Manual browser QA is strong but cannot prevent regressions in CI. | M | Add a small Playwright smoke suite and performance budgets for home, cart, lookbook, policies, and 404. |
| P2-03 | P2 | Add operational monitoring guidance and release checks. | Health exists, but uptime/error alerting is external and undocumented as an actionable runbook. | S | Add an operator checklist with health polling, Telegram handoff smoke test, and error-rate review. |
| P2-04 | P2 | De-duplicate catalog models across Home, Favorites, and Lookbook. | Multiple local product shapes can drift in price, stock, media, and labels. | L | Extract a shared catalog module before adding more commerce surfaces. |

## Implementation order for this pass

This pass implements **P0-01, P0-02, P0-03, P1-01, and P2-03**. These are high-impact, bounded changes that improve trust and cross-route reliability without inventing payment, review, carrier, or customer data. P1-02 and P1-03 are documented as the next conversion-focused pass because they touch many user-facing strings and the Telegram handoff state. P1-04, P2-01, P2-02, and P2-04 remain intentionally staged so they can be completed with real assets, a shared catalog model, and an automated browser environment rather than rushed into the current release.

## Explicit non-goals

This audit does not recommend adding online payment, fabricated reviews, fake customer photos, unsupported live carrier claims, or a newsletter provider without credentials and consent handling. The manual Telegram order path remains the correct boundary for the current business model.

## Verification plan

The improvement release must pass typecheck, all unit tests, production build, a direct unknown-route check, an error-boundary render check, Lookbook-to-Home cart reconciliation, newsletter copy inspection, and a public health check. The final report will update the scorecard and list any staged work that remains outside this release.


## Implementation pass status

P0-01 is implemented with a final Wouter fallback route and a responsive Russian 404 recovery surface. P0-02 is implemented with a branded error boundary that renders safe copy and logs details only in development. P0-03 is implemented through the shared versioned cart helper and a stock-capped upsert path used by Lookbook. P1-01 is implemented by replacing the unbacked email subscription claim with a direct Telegram update contact and an explicit no-email-storage statement. P2-03 is documented in `docs-operations.md` as a repeatable health, handoff, logging, and rollback review procedure.

The implementation validation passed with `pnpm check`, `pnpm test`, and `pnpm run build`: **22 tests across 8 files** passed. Desktop and mobile screenshots verified the main storefront and the unknown-route recovery surface. Remaining P1/P2 items are intentionally staged: localized high-frequency strings and an order preview are conversion work; product-specific media, product routes, automated browser/Lighthouse gates, and catalog de-duplication require a broader asset or architecture pass.
