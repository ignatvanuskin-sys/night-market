import { useEffect } from "react";
import { catalogProductBySlug } from "@/lib/catalog-data";

type RouteMetaProps = { path: string };
const ORIGIN = "https://occultshop-tqvscu7k.manus.space";
const metaByPath: Record<string, { title: string; description: string; type: string }> = {
  "/": { title: "NIGHT MARKET — Объекты после наступления темноты", description: "Редкие объекты и атмосферные вещи для жизни после наступления темноты.", type: "WebSite" },
  "/lookbook": { title: "Лукбук — NIGHT MARKET", description: "Три редакционных образа NIGHT MARKET для пространства после наступления темноты.", type: "CollectionPage" },
  "/favorites": { title: "Избранное — NIGHT MARKET", description: "Сохранённые объекты NIGHT MARKET.", type: "CollectionPage" },
  "/policies": { title: "Доставка и условия — NIGHT MARKET", description: "Доставка по России, возврат, конфиденциальность и условия заказа NIGHT MARKET.", type: "WebPage" },
};

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let node = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!node) { node = document.createElement("meta"); node.setAttribute(attribute, key); document.head.appendChild(node); }
  node.content = content;
}

export default function RouteMeta({ path }: RouteMetaProps) {
  useEffect(() => {
    const productSlug = path.match(/^\/product\/([^/?#]+)/)?.[1];
    const product = productSlug ? catalogProductBySlug(decodeURIComponent(productSlug)) : undefined;
    const meta = product ? { title: `${product.title} — NIGHT MARKET`, description: product.shortDescriptionRu, type: "Product" } : metaByPath[path] || metaByPath["/"];
    const canonicalPath = product ? `/product/${product.slug}` : metaByPath[path] ? path : "/";
    const canonical = `${ORIGIN}${canonicalPath === "/" ? "/" : canonicalPath}`;
    document.title = meta.title;
    setMeta("name", "description", meta.description);
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:locale", "ru_RU");
    setMeta("name", "twitter:title", meta.title);
    setMeta("name", "twitter:description", meta.description);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = canonical;
    let structured = document.head.querySelector<HTMLScriptElement>("#route-structured-data");
    if (!structured) { structured = document.createElement("script"); structured.id = "route-structured-data"; structured.type = "application/ld+json"; document.head.appendChild(structured); }
    structured.textContent = JSON.stringify(product ? { "@context": "https://schema.org", "@type": "Product", name: product.title, description: product.descriptionRu, image: product.gallery ?? [product.image], sku: product.id, offers: { "@type": "Offer", url: canonical, priceCurrency: "RUB", price: product.price, availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } } : { "@context": "https://schema.org", "@type": meta.type, name: meta.title, description: meta.description, url: canonical, inLanguage: "ru-RU" });
  }, [path]);
  return null;
}

