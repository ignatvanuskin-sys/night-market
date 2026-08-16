import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, Heart, Plus, ShoppingBag, X } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import ProgressiveImage from "@/components/ProgressiveImage";
import { readFavoriteIds, writeFavoriteIds } from "@/lib/favorites";
import { readCart, writeCart } from "@/lib/cart";

type FavoriteProduct = { id: string; title: string; category: string; price: number; description: string; image: string; stock: number };
type CartLine = { product: FavoriteProduct; quantity: number };
const ASSET_BASE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/";
const favoriteCatalog: FavoriteProduct[] = [
  { id: "raven-hour", title: "Raven Hour", category: "Wearables", price: 8800, description: "A cloak for leaving the ordinary behind.", image: `${ASSET_BASE}RCOUOqqGlNukXVjv.jpg`, stock: 4 },
  { id: "ember-ritual", title: "Ember Ritual", category: "Objects", price: 4200, description: "Three hand-poured candles for a slow evening.", image: `${ASSET_BASE}lCrSqnLAXFKXmWXd.jpg`, stock: 12 },
  { id: "night-herbarium", title: "Night Herbarium", category: "Objects", price: 3100, description: "Pressed flora from the edge of the map.", image: `${ASSET_BASE}lCrSqnLAXFKXmWXd.jpg`, stock: 7 },
  { id: "black-fig", title: "Black Fig", category: "Scent", price: 2400, description: "A low flame with a fruit-dark finish.", image: `${ASSET_BASE}lCrSqnLAXFKXmWXd.jpg`, stock: 18 },
  { id: "nocturne", title: "Nocturne", category: "Wearables", price: 5600, description: "A ceramic mask with a quiet point of view.", image: `${ASSET_BASE}lJJsOdgSMDOjJmdQ.jpg`, stock: 5 },
  { id: "the-last-seance", title: "The Last Séance", category: "Prints", price: 2900, description: "A poster for the room between rooms.", image: `${ASSET_BASE}lCrSqnLAXFKXmWXd.jpg`, stock: 21 },
  { id: "acid-moon", title: "Acid Moon", category: "Objects", price: 3800, description: "A small signal for a long night.", image: `${ASSET_BASE}lCrSqnLAXFKXmWXd.jpg`, stock: 3 },
  { id: "haunted-textures", title: "Haunted Textures", category: "Digital", price: 1800, description: "Thirty-six textures for the beautifully unfinished.", image: `${ASSET_BASE}XgTNBfpPRvrnTFPr.jpg`, stock: 999 },
];
const money = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

export default function Favorites() {
  const [ids, setIds] = useState<string[]>(() => readFavoriteIds());
  const [cart, setCart] = useState<CartLine[]>(() => readCart<FavoriteProduct>(new Set(favoriteCatalog.map((product) => product.id))));
  useEffect(() => { writeFavoriteIds(ids); }, [ids]);
  useEffect(() => { writeCart(cart); }, [cart]);
  const items = useMemo(() => favoriteCatalog.filter((product) => ids.includes(product.id)), [ids]);
  const remove = (id: string) => { setIds((current) => current.filter((item) => item !== id)); toast.success("Товар удалён из избранного"); };
  const addToCart = (product: FavoriteProduct) => { setCart((current) => { const exists = current.find((line) => line.product.id === product.id); if (exists && exists.quantity >= product.stock) return current; return exists ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { product, quantity: 1 }]; }); toast.success(`${product.title} добавлен в корзину`); };
  return <div className="nm-site"><div className="nm-noise" aria-hidden="true" /><header className="nm-header"><Link className="nm-brand" href="/" aria-label="NIGHT MARKET home"><ProgressiveImage src={`${ASSET_BASE}FcXuAAsdOxmisWCl.png`} alt="" /><span>NIGHT<br /><em>MARKET</em></span></Link><nav className="nm-nav" aria-label="Primary navigation"><Link href="/">Catalog</Link><Link href="/lookbook">Lookbook</Link><a href="/">About</a></nav><Link className="nm-text-button" href="/">← Back to market</Link></header><main id="top" className="nm-favorites-page"><div className="nm-catalog-top"><div><p className="nm-eyebrow">Private list</p><h1>Избранное<br /><i>после dark.</i></h1></div><p className="nm-catalog-count">{String(items.length).padStart(2, "0")} objects<br /><span>saved locally</span></p></div>{items.length === 0 ? <section className="nm-favorites-empty"><Heart size={26} /><h2>Здесь пока тихо.</h2><p>Сохраняйте товары сердцем, чтобы вернуться к ним позже.</p><Link className="nm-cta" href="/">В каталог <ArrowDownRight size={17} /></Link></section> : <section className="nm-product-grid">{items.map((product) => <article className="nm-favorite-card" key={product.id}><div className="nm-favorite-card-image"><ProgressiveImage src={product.image} alt={`${product.title} product image`} loading="lazy" /><button className="nm-card-favorite is-active" onClick={() => remove(product.id)} aria-label={`Удалить ${product.title} из избранного`}><Heart size={15} fill="currentColor" /></button></div><div className="nm-card-meta"><div><p className="nm-card-category">{product.category}</p><h2>{product.title}</h2><p>{product.description}</p></div><strong>{money(product.price)}</strong></div><button className="nm-add-link" onClick={() => addToCart(product)}>Добавить в корзину <Plus size={14} /></button></article>)}</section>}</main><footer className="nm-footer"><Link className="nm-underlink" href="/">Return to the market <ArrowDownRight size={15} /></Link><span>© 2026 NIGHT MARKET.</span><span><ShoppingBag size={14} /> {cart.reduce((sum, line) => sum + line.quantity, 0)}</span></footer></div>;
}
