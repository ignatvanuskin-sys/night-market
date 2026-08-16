# Telegram order handoff QA

The Telegram handoff was verified after replacing the demo checkout copy. The Home cart CTA is a native button inside the existing cart drawer and remains reachable through the drawer's normal keyboard flow; the empty-cart path returns before opening a URL. `client/src/lib/telegram.test.ts` covers the empty-cart guard, multiple order lines, Russian locale encoding, discount text, region, delivery window, and final total.

Responsive preview checks were captured at 375×812 and 1280×720 for `/` and `/policies`. The storefront retained its editorial layout at both sizes, and the policy page presents the Telegram ordering explanation without introducing a new horizontal navigation pattern. The policy footer link is a normal external anchor with `target="_blank"`, `rel="noreferrer"`, and visible `Telegram @eloquncy` text.

The handoff URL contract is `https://t.me/eloquncy?text=<encoded order summary>`. The site does not collect online payment or place a server-side order; the operator confirms availability, address, final delivery, and payment method manually in Telegram.

## Refinement hardening

The comment state reads from localStorage defensively and writes inside a try/catch, so restricted or unavailable browser storage cannot block checkout. The success notification uses `useReducedMotion()` to switch to opacity-only enter/exit variants; the global reduced-motion CSS fallback remains active for the rest of the interface. The final validation passed with **19 tests**, clean typecheck, and a successful production build.

## Executed browser QA

On the local preview, a product was added to the bag, the cart comment field was populated with `Позвонить после 18:00`, and the cart was reopened after returning from Telegram. The textarea retained the comment and the browser console confirmed `localStorage['night-market-order-comment']` contained the same value. The Telegram CTA was executed with `window.open` temporarily intercepted; the captured destination began with `https://t.me/eloquncy?text=` and its decoded payload contained `Комментарий к заказу: Позвонить после 18:00`. Immediately after the click, the DOM exposed a `role="status"` live region with `ЗАКАЗ ПЕРЕДАН В TELEGRAM`, operator contact `@eloquncy`, and the dismiss control. A second verification exercised the reduced-motion branch through the component’s explicit `useReducedMotion()` motion variants; the branch is opacity-only while the regular branch preserves the editorial slide/scale transition. No message was posted and no payment was initiated.

## Final interaction evidence

With the cart open in the preview, the Telegram CTA was triggered with the external navigation intercepted. The success popup rendered, its close control was found and activated, and after waiting through the exit transition the popup was absent from the DOM (`closed: true`). The captured destination remained the expected `https://t.me/eloquncy?text=...` URL containing the order payload. Reduced-motion behavior is now covered by the explicit `getTelegramSuccessMotion(true)` unit test, which verifies opacity-only variants; normal-motion variants are separately asserted.

## Reduced-motion runtime verification

For deterministic QA only, the local preview was opened with `?nm-reduced-motion=1`. The Telegram handoff rendered the success popup with `transform: none`, a live `role="status"` message, and the same encoded `https://t.me/eloquncy?text=...` destination. The close control was activated and, after the exit transition, the DOM confirmed `closed: true`. The temporary query override was removed from `Home.tsx` before release; production relies on the real `useReducedMotion()` preference plus the unit-tested motion contract.
