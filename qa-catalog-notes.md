# Catalog feature QA notes

Verified on the managed preview at https://3000-ir21nxzto4olhszofbax2-14bea5cb.us4.manus.computer/.

The Home catalog exposes price options (`Any price`, `Under 3 000 ₽`, `3 000–6 000 ₽`, `Over 6 000 ₽`), size options (`All sizes`, `S`, `M`, `L`, `One size`, `Digital`), and `Most popular` sorting. Product cards visibly expose `Quick view` and `Reviews · archive pending` when no verified review provider data exists.

Direct DOM activation of the first `Quick view Raven Hour` control mounted a `role=dialog` product drawer labelled `Raven Hour` with two `.nm-drawer-gallery-nav` controls. The drawer contains product details, size metadata, popularity, add-to-cart, favorites, lightbox, and the existing verified-review empty/error/loading states.

Desktop and mobile screenshots passed for Home and Lookbook. Typecheck, 13 Vitest tests across 5 files, and production build passed.

Keyboard audit: activating `Quick view Raven Hour` placed focus on `Close product`; the drawer exposed two previous/next gallery controls. Pressing Escape removed `.nm-product-drawer` and restored focus to `Quick view Raven Hour`. The filter selects and quick-view controls are native keyboard-reachable elements.

Filter keyboard audit: the price select received native focus, ArrowDown changed `Any price` to `Under 3 000 ₽`, and the live catalog count updated from the full set to `03 objects`; the select remained focused after the change. This confirms keyboard reachability and state application for a catalog filter.
