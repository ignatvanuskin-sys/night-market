import { useEffect } from "react";

type RouteMetaProps = { path: string };
const ORIGIN = "https://occultshop-tqvscu7k.manus.space";
const metaByPath: Record<string, { title: string; description: string; type: string }> = {
  "/": { title: "NIGHT MARKET — Objects for after dark", description: "Редкие объекты и атмосферные вещи для жизни после наступления темноты.", type: "WebSite" },
  "/lookbook": { title: "Lookbook — NIGHT MARKET", description: "Три редакционных образа NIGHT MARKET для пространства после наступления темноты.", type: "CollectionPage" },
  "/favorites": { title: "Избранное — NIGHT MARKET", description: "Сохранённые объекты NIGHT MARKET.", type: "CollectionPage" },
  "/policies": { title: "Доставка и условия — NIGHT MARKET", description: "Доставка по России, возврат, конфиденциальность и ограничения демо-витрины NIGHT MARKET.", type: "WebPage" },
};

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let node = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!node) { node = document.createElement("meta"); node.setAttribute(attribute, key); document.head.appendChild(node); }
  node.content = content;
}

export default function RouteMeta({ path }: RouteMetaProps) {
  useEffect(() => {
    const meta = metaByPath[path] || metaByPath["/"];
    const canonicalPath = metaByPath[path] ? path : "/";
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
    structured.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": meta.type, name: meta.title, description: meta.description, url: canonical, inLanguage: "ru-RU" });
  }, [path]);
  return null;
}
