import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownRight, ArrowLeft, Check, ChevronLeft, ChevronRight, Heart, ShoppingBag, ZoomIn } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import ProgressiveImage from "@/components/ProgressiveImage";
import Lightbox from "@/components/Lightbox";
import { catalogProductBySlug, catalogProducts } from "@/lib/catalog-data";
import { favoriteProductId, readFavoriteIds, writeFavoriteIds } from "@/lib/favorites";
import { readCart, upsertCartLine, writeCart } from "@/lib/cart";
import NotFound from "./NotFound";

const money = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

export default function Product({ params }: { params: { slug?: string } }) {
  const product = catalogProductBySlug(params.slug || "");
  if (!product) return <NotFound />;
  return <ProductDetail product={product} />;
}

function ProductDetail({ product }: { product: NonNullable<ReturnType<typeof catalogProductBySlug>> }) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => readFavoriteIds());
  const [added, setAdded] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; title: string; images: { src: string; alt: string; title: string }[] } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const gallery = product.gallery ?? [product.image];
  const isFavorite = favoriteIds.includes(favoriteProductId(product.id));
  const related = useMemo(() => catalogProducts.filter((item) => item.id !== product.id && item.tags.some((tag) => product.tags.includes(tag))).slice(0, 3), [product]);

  useEffect(() => { writeFavoriteIds(favoriteIds); }, [favoriteIds]);
  useEffect(() => { closeRef.current?.focus(); }, []);

  const addToCart = () => {
    const current = readCart<typeof product>();
    const result = upsertCartLine(current, product);
    if (result.capped) { toast.error("Достигнут лимит доступного остатка"); return; }
    writeCart(result.lines);
    setAdded(true);
    toast.success(`${product.title} добавлен в корзину`, { description: "Проверьте заказ перед переходом в Telegram." });
  };
  const toggleFavorite = () => setFavoriteIds((current) => { const id = favoriteProductId(product.id); const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]; toast.success(next.includes(id) ? "Товар сохранён в избранное" : "Товар удалён из избранного"); return next; });
  const changeGallery = (delta: number) => setGalleryIndex((value) => (value + delta + gallery.length) % gallery.length);

  return <div className="nm-site nm-product-page"><div className="nm-noise" aria-hidden="true" /><header className="nm-header"><Link className="nm-brand" href="/" aria-label="NIGHT MARKET — на главную"><span>NIGHT<br /><em>MARKET</em></span></Link><nav className="nm-nav" aria-label="Основная навигация"><Link href="/">Каталог</Link><Link href="/lookbook">Лукбук</Link><Link href="/favorites">Избранное</Link></nav><div className="nm-header-actions"><Link className="nm-text-button" href="/?cart=1"><ShoppingBag size={16} /> Корзина</Link><Link className="nm-text-button" href="/">← Вернуться в каталог</Link></div></header><main id="top"><div className="nm-product-breadcrumb"><Link href="/">Каталог</Link><span>/</span><span>{product.categoryRu}</span><span>/</span><strong>{product.title}</strong></div><section className="nm-product-detail"><div className="nm-product-gallery"><div className="nm-product-main-image"><ProgressiveImage src={gallery[galleryIndex]} alt={`${product.title} — изображение товара`} /><button className="nm-product-zoom" onClick={() => setLightbox({ src: gallery[galleryIndex], alt: `${product.title} — изображение товара`, title: product.title, images: gallery.map((src) => ({ src, alt: `${product.title} — изображение товара`, title: product.title })) })} aria-label="Увеличить изображение"><ZoomIn size={17} /> Увеличить</button>{gallery.length > 1 && <><button className="nm-product-gallery-prev" onClick={() => changeGallery(-1)} aria-label="Предыдущее изображение"><ChevronLeft /></button><button className="nm-product-gallery-next" onClick={() => changeGallery(1)} aria-label="Следующее изображение"><ChevronRight /></button><span className="nm-product-gallery-count">{galleryIndex + 1} / {gallery.length}</span></>}</div>{gallery.length > 1 && <div className="nm-product-thumbs">{gallery.map((src, index) => <button key={src} className={index === galleryIndex ? "is-active" : ""} onClick={() => setGalleryIndex(index)} aria-label={`Изображение ${index + 1} из ${gallery.length}`}><ProgressiveImage src={src} alt="" /></button>)}</div>}</div><article className="nm-product-copy"><p className="nm-eyebrow">{product.categoryRu} / {product.badge === "limited" ? "ограниченный выпуск" : "из архива"}</p><h1>{product.title}</h1><p className="nm-product-lede">{product.shortDescriptionRu}</p><div className="nm-product-price-row"><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</div><p className="nm-product-description">{product.descriptionRu}</p><div className="nm-product-facts"><span><b>Остаток</b>{product.stock > 20 ? "в наличии" : `${product.stock} шт.`}</span><span><b>Отправка</b>24–48 часов</span><span><b>Доставка</b>по России</span></div><div className="nm-product-options"><div><b>Размер</b><div>{(product.sizes ?? ["One size"]).map((size) => <span key={size}>{size === "One size" ? "Единый" : size === "Digital" ? "Цифровой" : size}</span>)}</div></div><div><b>Цвет</b><div className="nm-product-colors">{product.colors.map((color) => <i key={color} style={{ backgroundColor: color }} aria-label="Вариант цвета" />)}</div></div></div><div className="nm-product-actions"><button className="nm-cta" onClick={addToCart}><ShoppingBag size={17} /> {added ? "Добавлено в корзину" : "Добавить в корзину"} <ArrowDownRight size={17} /></button><button className={`nm-product-favorite ${isFavorite ? "is-active" : ""}`} onClick={toggleFavorite} aria-pressed={isFavorite}><Heart size={16} fill={isFavorite ? "currentColor" : "none"} /> {isFavorite ? "В избранном" : "Сохранить"}</button></div>{added && <Link className="nm-underlink" href="/?cart=1">Перейти в корзину и проверить заказ <ArrowRightSafe /></Link>}<p className="nm-product-note"><Check size={15} /> Финальная доставка, наличие и способ оплаты подтверждаются оператором в Telegram перед оформлением.</p><section className="nm-product-reviews" aria-labelledby="product-reviews-title"><p className="nm-eyebrow">Отзывы покупателей</p><h2 id="product-reviews-title">Пока без <i>отзывов.</i></h2><p>Проверенные оценки и фотографии появятся здесь после подключения реального провайдера. Мы не публикуем выдуманные отзывы.</p></section></article></section><section className="nm-related-products"><div><p className="nm-eyebrow">В том же настроении</p><h2>Похожие<br /><i>объекты.</i></h2></div><div className="nm-related-product-grid">{related.map((item) => <Link key={item.id} className="nm-related-product" href={`/product/${item.slug}`}><ProgressiveImage src={item.image} alt={`${item.title} — изображение товара`} loading="lazy" /><span><b>{item.title}</b><small>{money(item.price)}</small></span></Link>)}</div></section></main><footer className="nm-footer"><Link className="nm-underlink" href="/">← В каталог</Link><a href="https://t.me/eloquncy" target="_blank" rel="noreferrer">Связаться с @eloquncy</a><small>© 2026 NIGHT MARKET. Заказ подтверждается в Telegram.</small></footer>{lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} title={lightbox.title} images={lightbox.images} onClose={() => setLightbox(null)} />}</div>;
}

function ArrowRightSafe() { return <ArrowDownRight size={15} />; }

