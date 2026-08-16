export type CatalogProduct = {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryRu: string;
  price: number;
  oldPrice?: number;
  shortDescription: string;
  shortDescriptionRu: string;
  description: string;
  descriptionRu: string;
  tags: string[];
  image: string;
  gallery?: string[];
  colors: string[];
  stock: number;
  sizes?: string[];
  popularity: number;
  featured: boolean;
  badge?: string;
};

export const CATALOG_ASSETS = {
  hero: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/XgTNBfpPRvrnTFPr.jpg",
  category: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/lCrSqnLAXFKXmWXd.jpg",
  raven: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/RCOUOqqGlNukXVjv.jpg",
  nocturne: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/lJJsOdgSMDOjJmdQ.jpg",
  mark: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/FcXuAAsdOxmisWCl.png",
};

export const catalogProducts: CatalogProduct[] = [
  { id: "raven-hour", title: "Raven Hour", slug: "raven-hour", category: "Wearables", categoryRu: "Одежда", price: 8800, oldPrice: 11200, shortDescription: "A cloak for leaving the ordinary behind.", shortDescriptionRu: "Плащ для тех, кто выходит за пределы обычного.", description: "Heavy matte cotton, hidden satin lining, and an architectural hood. Cut in a single limited run for nights that need a different silhouette.", descriptionRu: "Плотный матовый хлопок, скрытая сатиновая подкладка и архитектурный капюшон. Ограниченный выпуск для вечеров, которым нужен другой силуэт.", tags: ["limited", "black", "cloak"], image: CATALOG_ASSETS.raven, gallery: [CATALOG_ASSETS.raven, CATALOG_ASSETS.hero], colors: ["#17151b", "#30243b"], stock: 4, sizes: ["S", "M", "L"], popularity: 96, featured: true, badge: "limited" },
  { id: "ember-ritual", title: "Ember Ritual", slug: "ember-ritual", category: "Objects", categoryRu: "Объекты", price: 4200, shortDescription: "Three hand-poured candles for a slow evening.", shortDescriptionRu: "Три свечи ручной работы для медленного вечера.", description: "A trio of black soy candles with cedar, smoke and bitter orange notes. Burn them together or keep one for the nightstand.", descriptionRu: "Три чёрные соевые свечи с нотами кедра, дыма и горького апельсина. Зажгите их вместе или оставьте одну у кровати.", tags: ["new", "orange", "candle"], image: CATALOG_ASSETS.category, gallery: [CATALOG_ASSETS.category, CATALOG_ASSETS.nocturne], colors: ["#c35b28", "#24202b"], stock: 12, sizes: ["One size"], popularity: 91, featured: true, badge: "new" },
  { id: "night-herbarium", title: "Night Herbarium", slug: "night-herbarium", category: "Objects", categoryRu: "Объекты", price: 3100, shortDescription: "Pressed flora from the edge of the map.", shortDescriptionRu: "Гербарий с растениями с края карты.", description: "A museum-ready composition of preserved nocturnal leaves and stems, mounted on archival paper and sealed in a smoked acrylic frame.", descriptionRu: "Композиция из сохранённых ночных листьев и стеблей на архивной бумаге, запечатанная в дымчатую акриловую рамку.", tags: ["herbarium", "limited", "green"], image: CATALOG_ASSETS.category, gallery: [CATALOG_ASSETS.category, CATALOG_ASSETS.hero], colors: ["#202a22", "#7e8b57"], stock: 7, sizes: ["One size"], popularity: 78, featured: false, badge: "limited" },
  { id: "black-fig", title: "Black Fig", slug: "black-fig", category: "Scent", categoryRu: "Ароматы", price: 2400, shortDescription: "A low flame with a fruit-dark finish.", shortDescriptionRu: "Низкое пламя с тёмным фруктовым звучанием.", description: "Vegetable wax, black fig, clove leaf and a trace of wet stone. Poured by hand in a reusable smoked glass vessel.", descriptionRu: "Растительный воск, чёрный инжир, лист гвоздики и оттенок мокрого камня в многоразовом дымчатом стекле.", tags: ["new", "scent", "candle"], image: CATALOG_ASSETS.category, gallery: [CATALOG_ASSETS.category, CATALOG_ASSETS.nocturne], colors: ["#201723", "#51334c"], stock: 18, sizes: ["One size"], popularity: 88, featured: true, badge: "new" },
  { id: "nocturne", title: "Nocturne", slug: "nocturne", category: "Wearables", categoryRu: "Одежда", price: 5600, shortDescription: "A ceramic mask with a quiet point of view.", shortDescriptionRu: "Керамическая маска с тихим характером.", description: "Hand-finished black ceramic with a soft cotton tie. Wear it as a ritual object, or keep it on the shelf where it can watch the room.", descriptionRu: "Чёрная керамика ручной отделки с мягкой хлопковой лентой. Носите как ритуальный объект или оставьте наблюдать за комнатой.", tags: ["mask", "black", "ceramic"], image: CATALOG_ASSETS.nocturne, gallery: [CATALOG_ASSETS.nocturne, CATALOG_ASSETS.raven], colors: ["#0e0d10", "#4b3a57"], stock: 5, sizes: ["S", "M"], popularity: 84, featured: true, badge: "limited" },
  { id: "last-seance", title: "The Last Séance", slug: "the-last-seance", category: "Prints", categoryRu: "Принты", price: 2900, shortDescription: "A poster for the room between rooms.", shortDescriptionRu: "Постер для комнаты между комнатами.", description: "Pigment print on warm archival stock. A quiet graphic study in smoke, line and the shape of an unanswered question.", descriptionRu: "Пигментный принт на тёплой архивной бумаге. Графическое исследование дыма, линии и формы вопроса без ответа.", tags: ["print", "violet", "paper"], image: CATALOG_ASSETS.category, gallery: [CATALOG_ASSETS.category, CATALOG_ASSETS.hero], colors: ["#261d32", "#c9b7a7"], stock: 21, sizes: ["One size"], popularity: 72, featured: false },
  { id: "acid-moon", title: "Acid Moon", slug: "acid-moon", category: "Objects", categoryRu: "Объекты", price: 3800, shortDescription: "A small signal for a long night.", shortDescriptionRu: "Маленький сигнал для долгой ночи.", description: "Cast resin amulet with a luminous lime inlay and blackened metal chain. It catches just enough light to remain a secret.", descriptionRu: "Амулет из литой смолы со светлой лаймовой вставкой и чернёной металлической цепью. Он ловит ровно столько света, чтобы остаться тайной.", tags: ["limited", "lime", "amulet"], image: CATALOG_ASSETS.category, gallery: [CATALOG_ASSETS.category, CATALOG_ASSETS.nocturne], colors: ["#d8ff54", "#17151b"], stock: 3, sizes: ["One size"], popularity: 81, featured: false, badge: "limited" },
  { id: "haunted-textures", title: "Haunted Textures", slug: "haunted-textures", category: "Digital", categoryRu: "Цифровые материалы", price: 1800, shortDescription: "Thirty-six textures for the beautifully unfinished.", shortDescriptionRu: "Тридцать шесть текстур для прекрасной незавершённости.", description: "A digital pack of scanned paper, smoke, tarnished foil and nocturnal shadows. For posters, screens, stories and whatever comes after midnight.", descriptionRu: "Цифровой набор сканированной бумаги, дыма, потёртой фольги и ночных теней для постеров, экранов и историй после полуночи.", tags: ["digital", "pack", "texture"], image: CATALOG_ASSETS.hero, gallery: [CATALOG_ASSETS.hero, CATALOG_ASSETS.category], colors: ["#4e3a61", "#af5632"], stock: 999, sizes: ["Digital"], popularity: 69, featured: false, badge: "digital" },
];

export const catalogProductBySlug = (slug: string) => catalogProducts.find((product) => product.slug === slug);
export const catalogProductById = (id: string) => catalogProducts.find((product) => product.id === id);

