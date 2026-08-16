# NIGHT MARKET — Production Improvement Roadmap

## Implemented in this release

The storefront now includes a dedicated Favorites archive at `/favorites`, persistent product favorites shared between Home and Lookbook, quick add-to-cart actions, empty and removal states, a branded header counter, AVIF/WebP picture sources with responsive `srcset`/`sizes`, click-to-zoom lightboxes with Escape and backdrop close, focus restoration and Tab trapping, defensive versioned cart persistence with live-catalog stale-line reconciliation, Russian-language document metadata, route-aware canonical/social metadata for every public route, corrected CDN social assets, JSON-LD website data, a Russian web manifest, a public sitemap, and crawler rules that keep API and internal paths out of indexing.

## Backlog for the next production iteration

| Area | Improvement | Acceptance criterion |
|---|---|---|
| Commerce | Move the product catalog into a shared typed data module | Home, Lookbook, Favorites, and server contracts consume one catalog source |
| Commerce | Add a multi-image product gallery | Lightbox supports previous/next navigation and thumbnails |
| Commerce | Version and reconcile persisted cart data | Old or malformed cart lines are safely removed with a user-facing notice |
| Commerce | Add a checkout-ready order summary | Delivery, discount, total, and demo/payment-provider states are explicit |
| Delivery | Add Russian tariff detail and delivery windows | Every zone exposes human-readable tariff and ETA copy |
| Trust | Add real policies and support pages | Delivery, returns, privacy, contact, and demo limitations are reachable from footer |
| Reviews | Connect only a verified provider | Empty state remains until trusted review data is available |
| Accessibility | Extend focus trapping to drawers and quick views | Focus is restored after every modal-like surface closes |
| Accessibility | Audit headings, landmarks, touch targets, and live regions | Keyboard and mobile interaction passes a repeatable checklist |
| Performance | Validate CDN transformation contract | AVIF/WebP responses are confirmed, not assumed, and LCP is measured |
| Performance | Add width-specific presets and route preloads | No oversized offscreen media requests appear in network logs |
| SEO | Add route-specific metadata and product JSON-LD | Home, Lookbook, Favorites, and product states have correct canonical data |
| Reliability | Add server timeout and redaction documentation | Integration failures are bounded and logs contain no credentials or personal data |
| Testing | Expand unit and integration coverage | Cart, shipping, favorites, image-source generation, and route contracts are tested |
| Operations | Maintain Render and environment checklists | Deploy, health, secrets, and rollback steps are documented |
| Analytics | Document privacy-safe event names | Favorites, lightbox, cart, and checkout events exclude sensitive data |

## Product constraints

Customer reviews, ratings, testimonials, and customer photos remain empty until connected to a verified provider. Russian delivery currently uses a transparent merchant tariff fallback; live carrier quotes require configured credentials and a validated provider contract.
