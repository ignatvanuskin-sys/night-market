import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, Check, ChevronDown, Filter, Heart, Menu, Minus, Plus, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

type Product = {
  id: string; title: string; slug: string; category: string; price: number; oldPrice?: number;
  shortDescription: string; description: string; tags: string[]; image: string; colors: string[];
  stock: number; featured: boolean; badge?: string;
};
type CartLine = { product: Product; quantity: number };

const ASSETS = {
  hero: "/manus-storage/night-market-hero_485b5b3c.jpg",
  category: "/manus-storage/night-market-category_8cf4445d.jpg",
  raven: "/manus-storage/night-market-product-raven-hour_a1841730.jpg",
  nocturne: "/manus-storage/night-market-product-nocturne_5122c3a8.jpg",
  mark: "/manus-storage/night-market-mark_021c3289.png",
};

const products: Product[] = [
  { id: "raven-hour", title: "Raven Hour", slug: "raven-hour", category: "Wearables", price: 88, oldPrice: 112, shortDescription: "A cloak for leaving the ordinary behind.", description: "Heavy matte cotton, hidden satin lining, and an architectural hood. Cut in a single limited run for nights that need a different silhouette.", tags: ["limited", "black", "cloak"], image: ASSETS.raven, colors: ["#17151b", "#30243b"], stock: 4, featured: true, badge: "limited" },
  { id: "ember-ritual", title: "Ember Ritual", slug: "ember-ritual", category: "Objects", price: 42, shortDescription: "Three hand-poured candles for a slow evening.", description: "A trio of black soy candles with cedar, smoke and bitter orange notes. Burn them together or keep one for the nightstand.", tags: ["new", "orange", "candle"], image: ASSETS.category, colors: ["#c35b28", "#24202b"], stock: 12, featured: true, badge: "new" },
  { id: "night-herbarium", title: "Night Herbarium", slug: "night-herbarium", category: "Objects", price: 31, shortDescription: "Pressed flora from the edge of the map.", description: "A museum-ready composition of preserved nocturnal leaves and stems, mounted on archival paper and sealed in a smoked acrylic frame.", tags: ["herbarium", "limited", "green"], image: ASSETS.category, colors: ["#202a22", "#7e8b57"], stock: 7, featured: false, badge: "limited" },
  { id: "black-fig", title: "Black Fig", slug: "black-fig", category: "Scent", price: 24, shortDescription: "A low flame with a fruit-dark finish.", description: "Vegetable wax, black fig, clove leaf and a trace of wet stone. Poured by hand in a reusable smoked glass vessel.", tags: ["new", "scent", "candle"], image: ASSETS.category, colors: ["#201723", "#51334c"], stock: 18, featured: true, badge: "new" },
  { id: "nocturne", title: "Nocturne", slug: "nocturne", category: "Wearables", price: 56, shortDescription: "A ceramic mask with a quiet point of view.", description: "Hand-finished black ceramic with a soft cotton tie. Wear it as a ritual object, or keep it on the shelf where it can watch the room.", tags: ["mask", "black", "ceramic"], image: ASSETS.nocturne, colors: ["#0e0d10", "#4b3a57"], stock: 5, featured: true, badge: "limited" },
  { id: "last-seance", title: "The Last Séance", slug: "the-last-seance", category: "Prints", price: 29, shortDescription: "A poster for the room between rooms.", description: "Pigment print on warm archival stock. A quiet graphic study in smoke, line and the shape of an unanswered question.", tags: ["print", "violet", "paper"], image: ASSETS.category, colors: ["#261d32", "#c9b7a7"], stock: 21, featured: false },
  { id: "acid-moon", title: "Acid Moon", slug: "acid-moon", category: "Objects", price: 38, shortDescription: "A small signal for a long night.", description: "Cast resin amulet with a luminous lime inlay and blackened metal chain. It catches just enough light to remain a secret.", tags: ["limited", "lime", "amulet"], image: ASSETS.category, colors: ["#d8ff54", "#17151b"], stock: 3, featured: false, badge: "limited" },
  { id: "haunted-textures", title: "Haunted Textures", slug: "haunted-textures", category: "Digital", price: 18, shortDescription: "Thirty-six textures for the beautifully unfinished.", description: "A digital pack of scanned paper, smoke, tarnished foil and nocturnal shadows. For posters, screens, stories and whatever comes after midnight.", tags: ["digital", "pack", "texture"], image: ASSETS.hero, colors: ["#4e3a61", "#af5632"], stock: 999, featured: false, badge: "digital" },
];

const money = (value: number) => `${value.toFixed(2).replace(".00", "")} €`;

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All objects");
  const [sort, setSort] = useState("featured");
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartLine[]>(() => {
    try { return JSON.parse(localStorage.getItem("night-market-cart") || "[]"); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);

  useEffect(() => { localStorage.setItem("night-market-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setSelected(null); setCartOpen(false); setMenuOpen(false); setFiltersOpen(false); } };
    window.addEventListener("keydown", escape); return () => window.removeEventListener("keydown", escape);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    const result = products.filter((p) => {
      const matchesQuery = !normalized || [p.title, p.category, ...p.tags].join(" ").toLowerCase().includes(normalized);
      return matchesQuery && (category === "All objects" || p.category === category);
    });
    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "newest") result.sort((a, b) => Number(Boolean(b.badge === "new")) - Number(Boolean(a.badge === "new")));
    return result;
  }, [query, category, sort]);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  const addToCart = (product: Product) => {
    setCart((current) => { const exists = current.find((line) => line.product.id === product.id); return exists ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { product, quantity: 1 }]; });
    toast.success(`${product.title} добавлен в корзину`, { description: "Можно продолжить выбор или перейти к оформлению." });
    setCartPulse(true); window.setTimeout(() => setCartPulse(false), 520);
    setSelected(null); setCartOpen(true);
  };
  const changeQuantity = (id: string, delta: number) => setCart((current) => current.map((line) => line.product.id === id ? { ...line, quantity: Math.max(0, line.quantity + delta) } : line).filter((line) => line.quantity));
  const scrollToCatalog = () => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="nm-site">
      <div className="nm-noise" aria-hidden="true" />
      <header className="nm-header">
        <a className="nm-brand" href="#top" aria-label="NIGHT MARKET home"><img src={ASSETS.mark} alt="" /><span>NIGHT<br /><em>MARKET</em></span></a>
        <nav className="nm-nav" aria-label="Primary navigation"><a href="#catalog">Catalog</a><Link href="/lookbook">Lookbook</Link><a href="#manifesto">About</a></nav>
        <div className="nm-header-actions"><button className={`nm-text-button ${cartPulse ? "is-pulsing" : ""}`} onClick={() => setCartOpen(true)} aria-label={`Open cart, ${cartCount} items`}><ShoppingBag size={16} /> Bag <b>{String(cartCount).padStart(2, "0")}</b></button><button className="nm-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={20} /></button></div>
      </header>

      <main id="top">
        <section className="nm-hero">
          <div className="nm-hero-copy">
            <p className="nm-kicker"><span className="nm-dot" /> Issue 04 / after dark objects</p>
            <h1>Things that<br /><i>shouldn't</i><br />look ordinary.</h1>
            <p className="nm-hero-lede">A small, carefully chosen collection of strange goods for rooms with a point of view.</p>
            <div className="nm-hero-actions"><button className="nm-cta" onClick={scrollToCatalog}>Shop the collection <ArrowDownRight size={18} /></button><a className="nm-underlink" href="#manifesto">What is this place?</a></div>
            <div className="nm-proof"><span>01 <b>limited drops</b></span><span>02 <b>ships in 24–48h</b></span><span>03 <b>hand selected</b></span></div>
          </div>
          <div className="nm-hero-art"><div className="nm-art-label">NM / 004<br /><span>one of a kind, mostly</span></div><img src={ASSETS.hero} alt="Obsidian talisman sphere surrounded by violet smoke" /><div className="nm-orbit" aria-hidden="true" /></div>
          <div className="nm-scroll-note">scroll to wander <ArrowDownRight size={15} /></div>
        </section>

        <section className="nm-featured nm-section" aria-labelledby="featured-title">
          <div className="nm-section-head"><div><p className="nm-eyebrow">01 / the edit</p><h2 id="featured-title">A few things<br /><i>worth finding.</i></h2></div><button className="nm-underlink" onClick={scrollToCatalog}>View all objects <ArrowDownRight size={15} /></button></div>
          <div className="nm-product-grid nm-featured-grid">{products.filter((p) => p.featured).map((product, index) => <ProductCard key={product.id} product={product} index={index} onSelect={setSelected} onAdd={addToCart} />)}</div>
        </section>

        <section id="collections" className="nm-collections nm-section"><div className="nm-section-head"><div><p className="nm-eyebrow">02 / the rooms</p><h2>Find your<br /><i>frequency.</i></h2></div><p className="nm-side-note">Four corners of the market.<br />No two nights are the same.</p></div><div className="nm-bento"><button className="nm-bento-card nm-bento-tall" onClick={() => { setCategory("Wearables"); scrollToCatalog(); }}><span>01 / wearables</span><strong>For leaving<br />the room.</strong><ArrowDownRight size={19} /></button><button className="nm-bento-card nm-bento-image" onClick={() => { setCategory("Objects"); scrollToCatalog(); }}><img src={ASSETS.category} alt="Nocturnal apothecary objects" /><span>02 / objects</span><strong>Keep close.</strong><ArrowDownRight size={19} /></button><button className="nm-bento-card nm-bento-small" onClick={() => { setCategory("Scent"); scrollToCatalog(); }}><span>03 / scent</span><strong>Make the air<br />remember.</strong><ArrowDownRight size={19} /></button><button className="nm-bento-card nm-bento-dark" onClick={() => { setCategory("Digital"); scrollToCatalog(); }}><span>04 / digital</span><strong>For the<br />in-between.</strong><ArrowDownRight size={19} /></button></div></section>

        <section id="catalog" className="nm-catalog nm-section"><div className="nm-catalog-top"><div><p className="nm-eyebrow">03 / all objects</p><h2>The night<br /><i>market.</i></h2></div><p className="nm-catalog-count">{String(filtered.length).padStart(2, "0")} objects<br /><span>curated locally</span></p></div><div className="nm-filter-bar"><div className="nm-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the market" aria-label="Search products" /></div><button className="nm-filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}><Filter size={15} /> Filters <span>{category !== "All objects" ? "1" : "0"}</span></button><div className={`nm-filters ${filtersOpen ? "is-open" : ""}`}><label>Category <select value={category} onChange={(e) => setCategory(e.target.value)}><option>All objects</option><option>Wearables</option><option>Objects</option><option>Scent</option><option>Prints</option><option>Digital</option></select><ChevronDown size={14} /></label><label>Sort by <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-low">Price: low</option><option value="price-high">Price: high</option></select><ChevronDown size={14} /></label></div></div><div className="nm-product-grid">{filtered.map((product, index) => <ProductCard key={product.id} product={product} index={index} onSelect={setSelected} onAdd={addToCart} />)}</div>{filtered.length === 0 && <div className="nm-empty"><Sparkles size={20} /><h3>Nothing found in this corner.</h3><p>Try a different word or return to all objects.</p><button className="nm-underlink" onClick={() => { setQuery(""); setCategory("All objects"); }}>Clear filters</button></div>}</section>

        <section id="manifesto" className="nm-manifesto nm-section"><div className="nm-manifesto-mark"><img src={ASSETS.mark} alt="" /></div><div><p className="nm-eyebrow">04 / a short manifesto</p><h2>Not everything<br />needs to be <i>explained.</i></h2><p className="nm-manifesto-copy">NIGHT MARKET is a growing index of objects with a little more charge than they strictly need. We look for the useful, the beautiful and the almost-forbidden — then put them in a room together.</p><a href="#catalog" className="nm-underlink">Enter the archive <ArrowDownRight size={15} /></a></div></section>
        <section className="nm-newsletter nm-section"><div><p className="nm-eyebrow">05 / after hours</p><h2>Get the next<br /><i>drop quietly.</i></h2></div><form onSubmit={(e) => { e.preventDefault(); toast.success("You're on the list.", { description: "The next drop will find you after dark." }); }}><label htmlFor="email">One note when something strange arrives.</label><div className="nm-email-row"><input id="email" type="email" required placeholder="your@email.com" /><button type="submit" aria-label="Subscribe"><ArrowDownRight size={18} /></button></div><small>No noise. Unsubscribe whenever.</small></form></section>
      </main>
      <footer className="nm-footer"><a className="nm-brand" href="#top"><img src={ASSETS.mark} alt="" /><span>NIGHT<br /><em>MARKET</em></span></a><p>Objects for after dark.</p><div><a href="#catalog">Catalog</a><a href="#manifesto">About</a><a href="mailto:hello@nightmarket.example">Contact</a></div><small>© 2026 NIGHT MARKET. Demo storefront.</small></footer>

      <AnimatePresence>{selected && <ProductDrawer product={selected} onClose={() => setSelected(null)} onAdd={addToCart} />}</AnimatePresence>
      <AnimatePresence>{cartOpen && <CartDrawer cart={cart} subtotal={subtotal} onClose={() => setCartOpen(false)} onChange={changeQuantity} onCheckout={() => toast.info("Demo checkout", { description: "Connect a commerce backend to enable live payments." })} />}</AnimatePresence>
      <AnimatePresence>{menuOpen && <motion.div className="nm-mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button className="nm-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button><img src={ASSETS.mark} alt="" /><nav><a href="#catalog" onClick={() => setMenuOpen(false)}>Catalog</a><a href="#collections" onClick={() => setMenuOpen(false)}>Collections</a><a href="#manifesto" onClick={() => setMenuOpen(false)}>About</a></nav><p>Objects for after dark.</p></motion.div>}</AnimatePresence>
    </div>
  );
}

function ProductCard({ product, index, onSelect, onAdd }: { product: Product; index: number; onSelect: (p: Product) => void; onAdd: (p: Product) => void }) {
  return <motion.article className={`nm-card nm-card-${index}`} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: index * 0.04, duration: 0.45 }}><button className="nm-card-image" onClick={() => onSelect(product)} aria-label={`View ${product.title}`}><img src={product.image} alt={`${product.title} product image`} />{product.badge && <span className={`nm-badge ${product.badge === "limited" ? "lime" : ""}`}>{product.badge}</span>}<span className="nm-card-arrow"><ArrowDownRight size={17} /></span></button><div className="nm-card-meta"><div><p className="nm-card-category">{product.category} / {product.tags[0]}</p><h3>{product.title}</h3><p>{product.shortDescription}</p></div><strong>{money(product.price)}</strong></div><button className="nm-add-link" onClick={() => onAdd(product)}>Add to bag <Plus size={14} /></button></motion.article>;
}

function ProductDrawer({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (p: Product) => void }) {
  const [buildLook, setBuildLook] = useState(false);
  const related = products.filter((item) => item.id !== product.id && (item.category === product.category || item.tags.some((tag) => product.tags.includes(tag)))).slice(0, 3);
  const addLook = () => { related.forEach(onAdd); toast.success("Образ собран", { description: `${product.title} и ${related.length} подходящих объекта добавлены в корзину.` }); };
  return <motion.div className="nm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}><motion.aside className="nm-drawer nm-product-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 260 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={product.title}><button className="nm-close" onClick={onClose} aria-label="Close product"><X /></button><div className="nm-drawer-image"><img src={product.image} alt={`${product.title} large product image`} /><span className="nm-badge">{product.category}</span></div><div className="nm-drawer-copy"><p className="nm-eyebrow">{product.slug} / 0{product.stock < 10 ? product.stock : 8}</p><div className="nm-drawer-title"><h2>{product.title}</h2><strong>{money(product.price)}</strong></div><p className="nm-drawer-lede">{product.shortDescription}</p><p>{product.description}</p><div className="nm-specs"><span><b>stock</b>{product.stock > 20 ? "in archive" : `${product.stock} left`}</span><span><b>dispatch</b>24–48h</span><span><b>finish</b>{product.colors.map((c) => <i key={c} style={{ backgroundColor: c }} />)}</span></div><div className="nm-drawer-actions"><button className="nm-cta" onClick={() => onAdd(product)}>Add to bag <ArrowDownRight size={18} /></button><button className="nm-save" onClick={() => toast.success("Saved to your private list") }><Heart size={16} /> Save</button></div><p className="nm-shipping"><Check size={14} /> Free shipping over 90 €. Returns within 14 days.</p><div className={`nm-build-look ${buildLook ? "is-open" : ""}`}><button className="nm-build-toggle" onClick={() => setBuildLook(!buildLook)}><span><Sparkles size={15} /> Собери образ</span><ChevronDown size={15} /></button>{buildLook && <div className="nm-build-content"><p>Собрали рядом то, что держит ту же частоту.</p><div>{related.map((item) => <button className="nm-related-mini" key={item.id} onClick={() => onAdd(item)}><img src={item.image} alt="" /><span><b>{item.title}</b><small>{money(item.price)}</small></span><Plus size={14} /></button>)}</div><button className="nm-cta nm-build-add" onClick={addLook}>Добавить весь образ <ArrowDownRight size={17} /></button></div>}</div></div></motion.aside></motion.div>;
}

function CartDrawer({ cart, subtotal, onClose, onChange, onCheckout }: { cart: CartLine[]; subtotal: number; onClose: () => void; onChange: (id: string, delta: number) => void; onCheckout: () => void }) {
  return <motion.div className="nm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}><motion.aside className="nm-drawer nm-cart-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 260 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Shopping bag"><div className="nm-drawer-head"><div><p className="nm-eyebrow">Your selection</p><h2>Bag <span>{String(cart.reduce((s, l) => s + l.quantity, 0)).padStart(2, "0")}</span></h2></div><button className="nm-close" onClick={onClose} aria-label="Close cart"><X /></button></div>{cart.length === 0 ? <div className="nm-cart-empty"><ShoppingBag size={26} /><h3>Nothing is in here yet.</h3><p>The good things take their time.</p><button className="nm-cta" onClick={onClose}>Keep wandering <ArrowDownRight size={17} /></button></div> : <><div className="nm-cart-lines">{cart.map((line) => <div className="nm-cart-line" key={line.product.id}><img src={line.product.image} alt="" /><div><p>{line.product.category}</p><h3>{line.product.title}</h3><span>{money(line.product.price)}</span><div className="nm-quantity"><button onClick={() => onChange(line.product.id, -1)} aria-label="Decrease quantity"><Minus size={13} /></button><b>{line.quantity}</b><button onClick={() => onChange(line.product.id, 1)} aria-label="Increase quantity"><Plus size={13} /></button></div></div></div>)}</div><div className="nm-cart-total"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><small>Shipping calculated at demo checkout.</small><button className="nm-cta" onClick={onCheckout}>Continue to demo checkout <ArrowDownRight size={18} /></button></div></>}</motion.aside></motion.div>;
}
