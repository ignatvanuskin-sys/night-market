# NIGHT MARKET — строгий production-аудит

**Дата аудита:** 17 августа 2026 года.  
**Публичный домен:** <https://occultshop-tqvscu7k.manus.space>  
**Метод:** анализ исходников и маршрутов, runtime logs, typecheck, production build, 24 Vitest-теста, desktop/mobile preview, проверка Telegram handoff и публичных metadata/health-контрактов.

## Жёсткий вывод

NIGHT MARKET — сильная визуальная storefront-витрина для ручного оформления через Telegram. Это **не автоматизированная e-commerce платформа**: сайт не создаёт серверный заказ, не резервирует остатки, не хранит order history, не подтверждает оплату и не имеет операторской очереди. Оценка ниже намеренно строгая и не выдаёт ручную модель Telegram за полноценный commerce backend.

## Итоговая оценка: **7,8/10**

| Область | Балл | Жёсткое объяснение |
|---|---:|---|
| Визуальный дизайн и бренд | **9,0** | Последовательная Occult Luxury Editorial система, сильная типографика, атмосфера и качественная responsive media-подача. Снижение за повторное использование части editorial assets для разных SKU. |
| UX и конверсия | **8,2** | Есть поиск, фильтры, quick view, product pages, favorites, cart, order preview и понятный Telegram CTA. Конверсия зависит от ручного ответа оператора и не имеет серверного статуса заказа. |
| Русская локализация | **8,7** | Основные страницы, фильтры, корзина, policies, product pages, feedback и accessibility labels переведены. Английские названия SKU/бренда сохранены намеренно; отдельные editorial fragments требуют контент-ревью. |
| Accessibility | **8,1** | Есть focus states, labels, Escape, live regions, reduced motion, keyboard-friendly controls и touch targets. Нет автоматического axe/Playwright gate и отдельной screen-reader сертификации. |
| Performance и media | **7,4** | Реальные WebP/AVIF-варианты, lazy media и route splitting реализованы. Initial JS около **763 kB**, CSS около **152 kB** до gzip; нет Lighthouse performance budget. |
| SEO и discoverability | **8,5** | Есть product routes, canonical, OG/Twitter, Product JSON-LD, sitemap и robots; добавлена фактическая FAQ-копия. Нет полноценного серверного каталога и автоматической проверки всех HTML metadata в CI. |
| Commerce integrity | **6,2** | RUB, Russia-only delivery, stock caps и Telegram preview честны. Нет серверного заказа, резерва остатков, payment confirmation, webhook, возвратного статуса или автоматической синхронизации каталога. |
| Security и privacy | **7,8** | Секреты не попадают в client bundle, есть bounded fallbacks и no-sensitive-payload policy. LocalStorage не является доверенным источником; Telegram остаётся внешней границей пользовательских данных. |
| Operations и support | **6,5** | Есть `/api/health`, runbook и provider boundaries. Нет uptime/error monitoring, CI browser gate, structured order queue и operator dashboard. |
| Code quality и maintainability | **7,9** | Typed catalog, shared cart helper, tests и clean build присутствуют. Home остаётся крупным компонентом, а route/UI integrity пока покрыта unit-тестами, но не полноценным E2E. |

## Что внесено в текущем improvement pass

Добавлена русская FAQ-секция на товарных страницах с фактическими ответами про оформление заказа, доставку и уточнение размера/цвета. Улучшены breadcrumbs и интерактивные раскрывающиеся блоки. Добавлена отдельная integrity-проверка всех восьми canonical product slugs и unknown-route lookup. Повторно проверены Home, Product, Lookbook и Policies на desktop preview; typecheck, production build и 24 Vitest-теста проходят.

## Слабые места и приоритеты

| Приоритет | Слабое место | Реальный риск | Следующее решение |
|---|---|---|---|
| **P0** | Нет серверной сущности заказа | Нельзя надёжно восстановить заказ, повторить отправку, проверить спор или дать оператору очередь | Ввести `orders`, snapshot линий, статус, idempotency key и защищённый operator workflow. |
| **P0** | Остатки не резервируются сервером | Два клиента могут выбрать один последний товар | Server-side availability check и короткая reservation window перед handoff. |
| **P0** | Telegram — ручной внешний транспорт | Нет гарантии, что оператор увидел сообщение или клиент завершил заказ | Handoff log без платёжных данных, операторское подтверждение и fallback contact path. |
| **P1** | Initial bundle слишком большой | Медленнее первый экран на мобильной сети | Разделить Home/Product/Favorites/shared vendors и ввести gzip/Lighthouse budget. |
| **P1** | Нет CI E2E и accessibility gates | Регрессии маршрутов, фокуса и order preview могут попасть в релиз | Playwright smoke suite для product routes, cart preview, 404, keyboard и mobile viewport. |
| **P1** | Нет production monitoring | Ошибки live-пользователей могут оставаться незамеченными | Uptime probe, error tracking, deploy smoke checks и уведомление оператору. |
| **P1** | Каталог статичен | Цены, stock и media обновляются только через релиз | Единый backend/Shopify/managed DB source с безопасным cache layer. |
| **P2** | Повторяющиеся изображения SKU | Снижает доверие к ассортименту | Загрузить уникальные verified photos для каждого товара. |
| **P2** | Нет account/order history | Пользователь не видит прошлые заказы | Добавить только после появления server order model. |
| **P2** | Отзывы пустые | Это честно, но снижает social proof | Подключить verified provider; не seed-ить отзывы вручную. |

## Ограничения и non-goals

Не добавлялись онлайн-платежи, fake reviews, неподтверждённые customer photos, unsupported live-carrier claims или рассылка без opt-in провайдера. Telegram `@eloquncy` остаётся ручной точкой подтверждения; тарифы доставки являются configured/fallback estimates и должны подтверждаться оператором.

## Рекомендуемый порядок дальнейших работ

Сначала необходимо создать серверную модель заказа и idempotent handoff log, затем добавить server-side stock validation/reservation. После этого следует поставить Playwright/Lighthouse CI и runtime monitoring. Только потом имеет смысл подключать реальные reviews, уникальные фотографии SKU и customer account history.
