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
