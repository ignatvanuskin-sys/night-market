# NIGHT MARKET integration expansion

- [ ] Update the reusable skill with connector inspection, secret handling, provider contracts, server validation, and fallback rules.
- [ ] Choose and document the NLP API, review provider, and regional delivery model; avoid credentials in frontend code.
- [ ] Upgrade the project with a backend proxy and configure required secrets only through the managed integration path.
- [ ] Add natural-language search API endpoint with deterministic local fallback, loading state, timeout, and error handling.
- [ ] Add real review-provider adapter with verified review/rating/photo mapping, privacy-safe rendering, and empty/error fallback.
- [ ] Add region selector and server-backed shipping quote calculation in the cart with clear loading/error states.
- [ ] Run typecheck/build, integration smoke tests, responsive checks, validate the reusable skill, and save a release checkpoint.

- [x] Fix Render deployment failure caused by `corepack enable` attempting to modify read-only `/usr/bin/pnpm`.
- [x] Pin a compatible Node.js runtime for Render and verify the corrected build/start commands.

- [x] Add a checked-in `render.yaml` with Corepack-free build/start settings for reproducible deployment.
- [x] Run `pnpm run start` against the production build and verify the service boots on Render-compatible PORT handling.
- [ ] Apply the corrected settings in Render and confirm one successful redeploy from the latest GitHub commit.

- [x] Verify the production server with an explicit non-default `PORT=10000`.
- [ ] Trigger a Render redeploy from commit `adc598a` and confirm the deployment succeeds.
