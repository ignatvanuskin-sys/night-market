# NIGHT MARKET — Production Readiness Audit

**Audit date:** 16 August 2026  
**Published release audited:** `7ad36e27`  
**Public domain:** `https://occultshop-tqvscu7k.manus.space`

## Executive conclusion

NIGHT MARKET is suitable for a controlled public storefront release and visual merchandising launch. The release has a coherent editorial identity, a robust client-side discovery and cart experience, typed full-stack seams, route-aware SEO metadata, and verified operational fallbacks. The final audit found one material performance issue: the original CDN URLs accepted unsupported `format` and `width` query parameters and still returned a 4.1 MB JPEG. That issue was corrected before this report by generating and publishing real width-aware WebP and AVIF variants, wiring them through `ProgressiveImage`, and adding regression tests.

The storefront is **not yet a complete transactional production commerce system**, but it now has a deliberate manual-order path. The site does not collect online payment: it prepares the cart summary and opens Telegram at `@eloquncy`. Delivery prices are configured Russian fallback tariffs rather than live carrier quotes, and reviews remain empty until a trusted provider is connected. These boundaries are intentionally visible in the UI and policies.

## 10-point scorecard

| Area | Score | Evidence | Remaining limitation |
|---|---:|---|---|
| Design system and brand expression | **9.5/10** | Occult Luxury Editorial direction is consistent across Home, Lookbook, Favorites, cart surfaces, typography, contrast, motion, and orange accent hierarchy. | Final merchandising photography and brand copy are still the main variables outside code control. |
| Commerce UX and discovery | **9.2/10** | Catalog filtering by price, size, popularity, style, and theme; natural-language fallback; autocomplete previews; quick view; gallery lightbox; bundle assembly; persistent favorites; cart reconciliation; stock-aware quantities; encoded Telegram order handoff. | Product-detail URLs, order persistence, and automated checkout completion remain future commerce work. |
| Performance and media delivery | **8.8/10** | Route-level Lookbook splitting, lazy media, eager hero handling, vendor chunking, progressive loading, and published WebP/AVIF variants at 480/768/1200 widths. The live AVIF and WebP probes returned 7,373 and 20,452 bytes respectively. | The main JavaScript entry remains sizeable, and further Lighthouse measurement on a representative mobile network is recommended. |
| Accessibility and interaction quality | **9.1/10** | Keyboard audit covered Home, Lookbook, Favorites, and Policies; skip links, landmarks, labelled controls, focus restoration, Escape handling, touch targets, reduced-motion rules, and live feedback are implemented. | A formal automated axe/Lighthouse CI gate is not yet part of deployment. |
| SEO and crawlability | **9.2/10** | Server-injected route metadata, canonical URLs, Open Graph/Twitter tags, Russian locale, JSON-LD, sitemap, robots, manifest, and successful direct HTML route checks for public pages. | Product-level canonical URLs and structured product offers can be added when detail routes are introduced. |
| Russian localization and delivery logic | **9.0/10** | RUB formatting, Russia-only zones, eight regions, localized windows and tariff labels, 10,000 ₽ free-shipping threshold, validated region persistence, and clear policy copy. | Tariffs are configured fallback values; carrier API credentials and live delivery calculation are not connected. |
| Security and privacy boundaries | **9.0/10** | Server-side provider seams, bounded external calls, validated inputs, protected local persistence parsing, no server secret names in the public bundle, configured OAuth boundary, no payment data collection, and privacy-safe analytics guidance. | A production security review should still cover the eventual carrier, review, account, and manual-order operations. |
| Reliability and operational readiness | **8.8/10** | `/api/health` returned `status: ok`; Render-compatible build/start configuration exists; typecheck, 18 Vitest tests, and production build pass; error and empty states are explicit; Telegram handoff has an empty-cart guard. | External deployment monitoring, alerting, and CI release gates should be formalized outside the app repository. |
| Code quality and test confidence | **9.0/10** | React 19/Tailwind 4/tRPC architecture is typed; catalog, cart, favorites, integration, auth, and responsive media behavior have unit coverage; build and typecheck are clean. | Browser-level regression tests are documented and manually verified, but not yet automated in CI. |
| Trust, policy transparency, and provider honesty | **9.5/10** | No fabricated reviews, ratings, or customer photos; empty review state is explicit; Telegram ordering, manual confirmation, regional tariff boundary, privacy, delivery, returns, and support terms are disclosed. | Verified reviews and live carrier operations are still required for a mature fulfillment workflow. |

### Overall score

**90.2/100 — 9.02/10.** Rounded to the requested 10-point scale, NIGHT MARKET is a **9.0/10 production-ready storefront foundation** for manual Telegram-assisted ordering. The score is intentionally below 10 because a production-ready storefront foundation is not equivalent to a fully operational payment-and-fulfillment business.

## Verification record

The final local release validation completed with `pnpm check`, `pnpm test`, and `pnpm run build`. The final test run passed **18 tests across 7 files**, including empty-cart and multi-line Telegram payload coverage. The published release returned HTTP 200 for `/`, `/lookbook`, `/favorites`, and `/policies`; `/api/health` returned `{"status":"ok","service":"night-market"}`; direct AVIF and WebP variant probes returned the correct image MIME types; and the public bundle scan found no `BUILT_IN_FORGE_API_KEY`, `JWT_SECRET`, or `DATABASE_URL` names.

The final hardening checkpoint is already published as version `7ad36e27`. The deployed preview shows the intended dark editorial composition, responsive navigation, orange CTA hierarchy, and hero object treatment.

## Release limitations and next actions

The current intended ordering model is manual: the customer starts in the site, then confirms availability, address, final delivery, and payment method with `@eloquncy` in Telegram. Next, connect a live carrier or tariff service and keep the configured Russian fallback only as an explicit outage path. Finally, connect a trusted review provider and maintain the current empty-state behavior until verified customer data is available.

For ongoing operations, add Lighthouse or Playwright checks to CI, configure uptime and error-rate alerts for `/api/health`, and measure the published site on a representative Russian mobile network. These are operational maturity improvements rather than blockers to the current controlled storefront release.
