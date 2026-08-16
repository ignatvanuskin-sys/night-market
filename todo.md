# NIGHT MARKET integration expansion

- [x] Update the reusable skill with connector inspection, secret handling, provider contracts, server validation, and fallback rules.
- [x] Choose and document the NLP API, review provider, and regional delivery model; avoid credentials in frontend code.
- [x] Upgrade the project with a backend proxy and configure required secrets only through the managed integration path.
- [x] Add natural-language search API endpoint with deterministic local fallback, loading state, timeout, and error handling.
- [x] Add real review-provider adapter with verified review/rating/photo mapping, privacy-safe rendering, and empty/error fallback.
- [x] Add region selector and server-backed shipping quote calculation in the cart with clear loading/error states.
- [x] Run typecheck/build, integration smoke tests, responsive checks, validate the reusable skill, and save a release checkpoint.

- [x] Fix Render deployment failure caused by `corepack enable` attempting to modify read-only `/usr/bin/pnpm`.
- [x] Pin a compatible Node.js runtime for Render and verify the corrected build/start commands.

- [x] Add a checked-in `render.yaml` with Corepack-free build/start settings for reproducible deployment.
- [x] Run `pnpm run start` against the production build and verify the service boots on Render-compatible PORT handling.
- [x] Apply the corrected settings in Render and confirm one successful redeploy from the latest GitHub commit.

- [x] Verify the production server with an explicit non-default `PORT=10000`.
- [x] Trigger a Render redeploy from commit `adc598a` and confirm the deployment succeeds.

- [x] Add the correct OAuth server configuration for the deployed Render origin, or explicitly disable auth initialization when auth is not part of the public storefront deployment.
- [x] Remove or configure the Umami analytics script so production builds contain no undefined VITE analytics placeholders.
- [x] Rebuild and verify the live Render runtime after the configuration cleanup.

- [x] Diagnose why all production image URLs fail on Render and identify the exact missing asset paths.
- [x] Move image assets to deploy-safe storage or a committed public asset strategy and update all product/Lookbook references.
- [x] Verify image HTTP responses and live Render home route after redeploy; CDN image endpoints return HTTP 200 with image content.

- [x] Deploy GitHub commit `8250249` to Render and verify build/runtime health.
- [x] Confirm supported shipping regions and currency; configured the RUB regional tariff source used by the storefront.
- [x] Replace international fallback regions with a documented Russian tariff table and preserve typed fallback/error handling; live carrier credentials are not configured.

- [x] Replace international region options with Russia-only delivery zones and RUB pricing.
- [x] Add configurable Russian shipping zones, free-shipping threshold, and explicit tariff labels to the server quote model.
- [x] Update cart UI, persistence, tests, and documentation for Russian delivery calculation.
- [x] Run checks, visual verification, and sync GitHub; Render redeploy and live quote verification require the user to trigger the deployment from the updated main branch.

- [x] Replace international region options with Russia-only delivery zones and RUB pricing.
- [x] Add configurable Russian shipping zones, 10,000 ₽ free-shipping threshold, and explicit tariff labels to the server quote model.
- [x] Update cart UI, persistence, and shipping integration tests for Russian delivery calculation.
- [x] Run final responsive visual verification, sync GitHub, and save the final checkpoint.

- [x] Add an atmospheric loading animation for initial and route loading states.
- [x] Add smooth accessible transitions between Home and Lookbook routes.
- [x] Verify reduced-motion behavior, responsive layout, tests, and production build for the motion update.

- [x] Capture responsive screenshots for the Lookbook route after the motion update.
- [x] Verify the Home-to-Lookbook route path and document the reduced-motion fallback in the motion shell; direct Home → Lookbook navigation and desktop/mobile Lookbook previews pass.

- [x] Add a reusable accessible image loader with progress, shimmer, and error states.
- [x] Apply progressive image loading to Home, Lookbook, product drawers, cart previews, and review photos.
- [x] Verify slow-image behavior, reduced motion, responsive layout, tests, and production build.

- [x] Replace remaining Home brand, mobile-menu, and cart-drawer images with ProgressiveImage.
- [x] Verify delayed/loading, broken-image, and loaded states on the temporary diagnostics route; the broken URL showed `Image unavailable`, the delayed case showed the loading bar, and reduced-motion fallback is encoded in the CSS contract.
- [x] Capture post-change Home and Lookbook screenshots at desktop and mobile breakpoints after the aspect-ratio fix.

- [x] Add reusable click-to-zoom lightbox behavior for product and Lookbook imagery.
- [x] Add modern AVIF/WebP picture sources and responsive srcset/sizes while preserving progressive loading and fallbacks.
- [x] Add persistent product favorites with accessible controls and a header counter.
- [x] Verify keyboard focus/Escape behavior, responsive layouts, image delivery markup, tests, and production build.

# Production Improvement Roadmap

## Product discovery and commerce UX
- [x] Add a dedicated Favorites page with saved products, remove actions, quick add, empty state, and cross-route persistence.
- [x] Add a reusable full product-gallery lightbox model with previous/next navigation and wire verified gallery arrays into Home and Lookbook records.
- [x] Add cart persistence versioning, live-catalog stale-product reconciliation, quantity validation, and a clear-cart action.
- [x] Add a checkout-ready cart summary with subtotal, bundle discount, regional delivery, free-shipping state, total context, and explicit demo-payment messaging.
- [x] Add Russian tariff labels, region-specific delivery windows, free-shipping threshold copy, and provider-boundary documentation.
- [x] Add truthful stock caps, stock-aware quantity controls, and non-fabricated availability copy.
- [x] Add shareable Lookbook links with canonical restoration and clipboard fallback; product detail URLs remain a follow-up.

## Accessibility and interaction quality
- [x] Audit semantic landmarks, heading hierarchy, labels, focus order, and keyboard reachability across Home, Lookbook, Favorites, and policies in preview.
- [x] Add focus trapping and focus restoration for lightboxes and quick-view drawers, including Escape close and trigger restoration.
- [x] Preserve visible focus styles and reduced-motion coverage across the new gallery, cart, policy, and favorites interactions.
- [x] Ensure mobile navigation, filters, favorite controls, cart controls, and image controls meet 44px touch-target requirements.
- [x] Add accessible toast/live feedback for favorites, cart clearing, shipping celebration, and demo checkout states.

## Performance and media delivery
- [x] Confirm the CDN URL fallback behavior and document AVIF/WebP assumptions in the operations handoff.
- [x] Add width-aware responsive image presets and `sizes` contracts through ProgressiveImage.
- [x] Add explicit aspect-ratio and wrapper sizing contracts for hero, editorial, cart, and card media.
- [x] Audit lazy media, route-level Lookbook splitting, initial hero loading, and motion vendor chunking for LCP/INP.
- [x] Reduce offscreen media work with lazy loading and keep above-the-fold hero media eager.

## SEO, metadata, and trust
- [x] Add canonical, Russian locale, JSON-LD, Open Graph, and Twitter metadata for Home and Lookbook plus all public routes.
- [x] Add sitemap, robots, Russian manifest, canonical metadata, and JSON-LD website coverage for public routes.
- [x] Add truthful Russian delivery, returns, privacy, support, and demo checkout policies at `/policies`.
- [x] Keep reviews and ratings empty until a verified provider responds; no customer content is fabricated.
- [x] Add an explicit support contact and scope disclaimer on `/policies` and public footers.

## Reliability, security, and operations
- [x] Add client error boundaries plus honest fallback states for discovery, reviews, shipping, image, and empty catalog failures.
- [x] Preserve bounded server fetch fallbacks, provider-empty states, and no-secret/no-payload logging policy in operations docs.
- [x] Validate email/search/region inputs and protect favorites/cart localStorage parsing from malformed data.
- [x] Add favorites and cart persistence tests; existing shipping integration tests remain green.
- [x] Add `/api/health`, environment-variable checklist, Render runtime notes, and release verification steps.
- [x] Review public auth initialization and keep the storefront on the configured OAuth base without client credential exposure.
- [x] Document privacy-safe aggregate analytics events and prohibited sensitive payloads.

## Russian-market readiness
- [x] Verify RUB formatting, Russia-only zones, 10,000 ₽ threshold, tariff labels, delivery windows, and override behavior across cart surfaces.
- [x] Align Russia-only delivery and checkout copy across the cart, policies page, and storefront metadata.
- [x] Document the boundary between configured tariff fallback and live carrier rates in integration and policy documentation.
- [x] Preserve typed server seams for payment/carrier integration without adding unverified credentials.

- [x] Reconcile persisted cart lines against the live catalog before hydration and drop unknown or outdated products.
- [x] Add route-aware canonical, social, and structured metadata for Home, Lookbook, Favorites, and policies instead of one shared root canonical.

- [x] Add server-side route metadata injection so crawlers receive route-specific canonical and social tags in initial HTML.
- [x] Verify route metadata from direct HTML responses for Home, Lookbook, Favorites, and policies.

- [x] Wire real gallery arrays into Home products and Lookbook entries; lightbox supports arrow navigation and direct quick-view access.
- [x] Render explicit shipping amount and final payable total lines, including bundle discount and free-shipping state.
- [x] Validate persisted Russian region values against the allowed enum before hydration and default invalid values to Moscow.
- [x] Localize cart delivery loading/error, tariff, free-shipping, clear-cart, and demo-checkout copy for the Russian storefront.
- [x] Add focus-visible outlines, reduced-motion rules, and mobile touch sizing for favorites, cart, policies, and gallery controls.
- [x] Add a typed server-side RUB payment-intent seam with validated input, demo fallback, no credentials, and test coverage.

- [x] Record a keyboard-oriented accessibility audit across Home, Lookbook, Favorites, and Policies: all four routes expose skip links, landmarks, labelled controls, structured headings, zero unlabeled empty buttons, and 80/27/9/8 reachable controls respectively.
- [x] Document CDN transformation behavior and AVIF/WebP/srcset fallback assumptions explicitly in `docs-operations.md`.
- [x] Record the eager-versus-lazy media audit and duplicate-request reduction decisions in `docs-operations.md`.
- [x] Add and verify the user-visible discovery fallback that preserves local search, and document route error-boundary coverage in `docs-operations.md`.
- [x] Add the auth deployment note verifying configured public OAuth behavior and no client credential exposure.

- [x] Exercise the natural-language search failure path in the live preview; the rendered status became `Серверный подбор недоступен — локальный поиск продолжает работать.` while the query remained active.
- [x] Verify the public OAuth boundary uses only `VITE_OAUTH_PORTAL_URL`, `/api/health` returns `status: ok`, and the production client bundle contains none of the server secret names.

- [x] Add catalog filters for price range and available size, plus popularity sorting.
- [x] Enhance catalog quick view with accessible product details, gallery, size metadata, add-to-cart, and close/focus behavior.
- [x] Add a per-product review/rating block using verified-provider data or an explicit empty state without fabricated customer content.
- [x] Add tests and verify keyboard, responsive, loading/error, and production-build behavior for the catalog update.

- [x] Add focus management and restoration for the product quick-view drawer; focus enters `Close product` and returns to the triggering control.
- [x] Add visible previous/next gallery navigation inside the quick-view drawer with keyboard arrow support and an image count.
- [x] Add focused catalog tests for size defaults, explicit size metadata, price filtering, size filtering, popularity ordering, and truthful review empty state.
- [x] Run and record a keyboard-oriented audit: quick view focuses Close product, exposes gallery controls, closes with Escape, and restores trigger focus; native filter selects remain keyboard reachable.

- [x] Extract and test the actual catalog price, size, and popularity filtering/sorting logic in `client/src/lib/catalog.ts` with direct unit coverage.
- [x] Run a real keyboard audit of catalog filter selects: price select received focus, ArrowDown changed it to `Under 3 000 ₽`, and the live catalog count updated to 03 objects; evidence is in `qa-catalog-notes.md`.

# Final Production Audit

- [x] Verify deployed domain, health endpoint, route status, asset loading, and public metadata.
- [x] Run final typecheck, full tests, production build, and inspect runtime logs.
- [x] Audit accessibility, responsive behavior, performance boundaries, security, SEO, and Russian-market copy.
- [x] Verify provider boundaries: payment, carrier rates, verified reviews, OAuth, and analytics.
- [x] Fix any critical production blockers found by the audit.
- [x] Write the final 10-point scorecard with evidence and explicit limitations.

# Telegram Order Handoff

- [x] Replace demo checkout CTA and messaging with a polished Telegram order handoff to @eloquncy.
- [x] Build a safe prefilled order message from cart items, Russian totals, region, and delivery window.
- [x] Add Telegram handoff tests and verify empty-cart, encoding, accessibility, and responsive behavior.
- [x] Update policy and operations copy to explain that ordering is completed manually in Telegram, with no online payment collected by the site.

# Telegram Handoff QA Follow-up

- [x] Add an explicit empty-cart guard test and multi-line Telegram payload coverage.
- [x] Run focused desktop/mobile QA for the cart CTA, keyboard access, drawer behavior, and policy Telegram link.

# Telegram Order Refinement

- [x] Add a cart comment field with safe local state and clear Russian guidance.
- [x] Include the order comment in the encoded Telegram handoff and add regression coverage.
- [x] Show a polished success notification after opening Telegram, with accessible live status and reduced-motion support.
- [x] Replace the footer email contact with direct Telegram links to @eloquncy across public surfaces.

# Telegram Refinement Hardening

- [x] Guard order-comment localStorage writes against restricted-storage failures.
- [x] Add explicit reduced-motion variants for the Telegram success notification and verify the behavior.
- [x] Record focused QA coverage for comment persistence and success notification behavior.

# Telegram Focused QA

- [x] Execute and document manual open/close verification for the Telegram success popup.
- [x] Execute and document reduced-motion verification for the Telegram success popup.
- [x] Execute and document comment persistence verification across cart reopen/reload behavior.

# Telegram Interaction Verification

- [x] Exercise and document the success-popup dismiss button after opening the Telegram handoff.
- [x] Emulate prefers-reduced-motion in the browser and document the success-popup opacity-only behavior.

# Telegram Motion Contract

- [x] Extract and unit-test the Telegram success popup motion variants for normal and reduced-motion modes.
- [x] Verify the dismissal transition after its exit duration completes.

# Telegram Reduced-Motion QA Seam

- [x] Add a development-only reduced-motion override query for deterministic browser verification, then remove it before the production checkpoint.
