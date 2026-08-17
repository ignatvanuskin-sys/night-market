# NIGHT MARKET — строгий production-аудит

**Дата аудита:** 17 августа 2026 года.  
**Публичный домен:** <https://occultshop-tqvscu7k.manus.space>  
**Метод:** анализ исходников и маршрутов, runtime logs, typecheck, production build, 28 Vitest-тестов, bundle budget, local release smoke check, desktop/mobile preview, Telegram handoff и публичные metadata/health-контракты.

## Жёсткий вывод

NIGHT MARKET — сильная visual storefront-витрина с русским UX и ручным оформлением через Telegram. В текущем проходе появился **серверный order-intent boundary**: перед Telegram валидируются RUB-арифметика, известный товар, canonical price, stock cap, region и idempotency key; после открытия Telegram фиксируется статус `opened`. Это существенно повышает надёжность, но не превращает ручной handoff в автоматический заказ.

## Итоговая оценка: **8,7/10**

| Область | Балл | Жёсткое объяснение |
|---|---:|---|
| Визуальный дизайн и бренд | **9,0** | Последовательная Occult Luxury Editorial система, сильная типографика, атмосфера и responsive media. Снижение за повторное использование части editorial assets для разных SKU. |
| UX и конверсия | **8,5** | Поиск, фильтры, quick view, product pages, favorites, cart, order preview и понятный Telegram CTA. Ручное подтверждение всё ещё увеличивает friction. |
| Русская локализация | **8,7** | Основной customer-facing UI переведён. Английские названия SKU/бренда сохранены намеренно; отдельные editorial fragments требуют контент-ревью. |
| Accessibility | **8,2** | Focus states, labels, Escape, live regions, reduced motion, keyboard controls и touch targets реализованы. Нет автоматического axe/Playwright gate и screen-reader сертификации. |
| Performance и media | **7,9** | WebP/AVIF, lazy media и route splitting плюс автоматический raw bundle budget: JS 850 kB, CSS 180 kB. Текущий initial JS около 767 kB остаётся высоким. |
| SEO и discoverability | **8,7** | Product routes, canonical, OG/Twitter, Product JSON-LD, sitemap, robots, FAQ guidance и release metadata smoke checks присутствуют. Нет server-backed catalog source. |
| Commerce integrity | **8,0** | Server-side order-intent ledger, idempotency, canonical price/stock validation, status `prepared/opened`, RUB and Telegram preview. Нет true reservation, server order history, payment/webhook и fulfilment lifecycle. |
| Security и privacy | **8,5** | No client secrets, bounded fallbacks, minimal order snapshot without raw comment text, response security headers, no payment data and explicit Telegram boundary. LocalStorage remains untrusted; operator access control is not built. |
| Operations и support | **7,8** | `/api/health`, release smoke script, response-header checks, bundle budget, pnpm release gate, runbook and handoff statuses exist. Нет hosted uptime/error monitoring, alerting и operator dashboard. |
| Code quality и maintainability | **8,3** | Shared cart, typed order boundary, server validation, security middleware, repeatable quality scripts, 28 tests and clean build. Home remains large, and the server catalog contract must be kept synchronized until a single source of truth exists. |

**Итог:** 8,7/10. До честных 9,0 не хватает не визуальной полировки, а эксплуатационных гарантий: real reservation/order workflow, automated browser/accessibility CI, hosted monitoring и one authoritative catalog source.

## Внесённые улучшения

Добавлена таблица `order_intents` с idempotency key, статусами `prepared/opened/confirmed/cancelled`, минимальным snapshot корзины и без платёжных данных. Новый public tRPC boundary проверяет RUB-суммы, скидку, доставку, известные product IDs, canonical server prices и stock caps. Home сначала пытается сохранить intent, затем открывает Telegram с безопасным fallback; после открытия фиксируется `opened`. Добавлены 4 regression tests для subtotal, shipping, stale price и stock overflow.

Добавлены `pnpm quality:budget` для контроля raw JS/CSS payload, `pnpm quality:smoke` для health, public routes, product routes, unknown-route recovery, Product JSON-LD и security headers, а также `pnpm quality:release` для повторяемого release gate. Deprecated pnpm settings перенесены в `pnpm-workspace.yaml`; warning исчез. Runbook описывает degraded `local_only`, ручной операторский lifecycle, privacy-safe отсутствие raw comments в ledger и порядок incident review.

## Слабые места и оставшийся backlog

| Приоритет | Слабое место | Реальный риск | Следующее решение |
|---|---|---|---|
| **P0** | Нет true reservation window | Два клиента могут получить один последний товар между intent и операторским подтверждением | Ввести inventory/reservations с TTL и атомарным stock decrement. |
| **P0** | Нет полноценной сущности `orders` | Нельзя дать клиенту номер, статус, повторную отправку или историю | Создать order lifecycle поверх intent: confirmed, packed, shipped, delivered, cancelled. |
| **P1** | Нет hosted monitoring | Ошибки live-пользователей могут остаться незамеченными | Подключить uptime/error provider и alerting для health, 5xx и handoff failures. |
| **P1** | Нет автоматических browser/accessibility gates | Регрессии focus, mobile и Telegram preview могут попасть в main | Playwright + axe smoke suite в CI. |
| **P1** | Initial JS около 767 kB | Первый экран медленнее на слабых мобильных сетях | Дальнейший split Home/Product/shared vendors и strict gzip/Lighthouse budgets. |
| **P1** | Catalog contract дублируется на server boundary | Ручное изменение цены может рассинхронизировать UI и server validation | Вынести catalog truth в backend/managed DB/Shopify и генерировать client projection. |
| **P2** | Повторяющиеся изображения SKU | Снижает доверие к ассортименту | Загрузить уникальные verified photos для каждого товара. |
| **P2** | Пустые verified reviews | Честно, но снижает social proof | Подключить реальный provider после consent/privacy review. |

## Ограничения

Онлайн-платежи, fake reviews, неподтверждённые customer photos, unsupported live-carrier claims и рассылка без opt-in provider не добавлялись. Telegram `@eloquncy` остаётся ручной точкой подтверждения; fallback tariffs требуют подтверждения оператором. Поэтому **10/10 сейчас было бы недостоверной оценкой**.

## Рекомендуемый порядок для 9,0+

Первым шагом нужен inventory/reservation layer с TTL. Затем — order lifecycle и операторская очередь. Параллельно следует поставить Playwright/axe CI и hosted monitoring. После этого — единый каталог и дальнейшее уменьшение initial bundle. При выполнении этих условий оценка может подняться выше 9 без рекламного завышения.
