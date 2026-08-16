# Telegram order handoff QA

The Telegram handoff was verified after replacing the demo checkout copy. The Home cart CTA is a native button inside the existing cart drawer and remains reachable through the drawer's normal keyboard flow; the empty-cart path returns before opening a URL. `client/src/lib/telegram.test.ts` covers the empty-cart guard, multiple order lines, Russian locale encoding, discount text, region, delivery window, and final total.

Responsive preview checks were captured at 375×812 and 1280×720 for `/` and `/policies`. The storefront retained its editorial layout at both sizes, and the policy page presents the Telegram ordering explanation without introducing a new horizontal navigation pattern. The policy footer link is a normal external anchor with `target="_blank"`, `rel="noreferrer"`, and visible `Telegram @eloquncy` text.

The handoff URL contract is `https://t.me/eloquncy?text=<encoded order summary>`. The site does not collect online payment or place a server-side order; the operator confirms availability, address, final delivery, and payment method manually in Telegram.
