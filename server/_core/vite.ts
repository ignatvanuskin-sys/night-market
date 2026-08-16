import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

const PUBLIC_ORIGIN = "https://occultshop-tqvscu7k.manus.space";
const ROUTE_META: Record<string, { title: string; description: string; type: string }> = {
  "/": { title: "NIGHT MARKET — Объекты после наступления темноты", description: "Редкие объекты и атмосферные вещи для жизни после наступления темноты.", type: "WebSite" },
  "/lookbook": { title: "Лукбук — NIGHT MARKET", description: "Три редакционных образа NIGHT MARKET для пространства после наступления темноты.", type: "CollectionPage" },
  "/favorites": { title: "Избранное — NIGHT MARKET", description: "Сохранённые объекты NIGHT MARKET.", type: "CollectionPage" },
  "/policies": { title: "Доставка и условия — NIGHT MARKET", description: "Доставка по России, возврат, конфиденциальность и условия заказа NIGHT MARKET.", type: "WebPage" },
};
const PRODUCT_META: Record<string, { title: string; description: string; price: number; image: string; stock: number }> = {
  "raven-hour": { title: "Raven Hour", description: "Плащ для тех, кто выходит за пределы обычного.", price: 8800, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/RCOUOqqGlNukXVjv.jpg", stock: 4 },
  "ember-ritual": { title: "Ember Ritual", description: "Три свечи ручной работы для медленного вечера.", price: 4200, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/lCrSqnLAXFKXmWXd.jpg", stock: 12 },
  "night-herbarium": { title: "Night Herbarium", description: "Гербарий с растениями с края карты.", price: 3100, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/lCrSqnLAXFKXmWXd.jpg", stock: 7 },
  "black-fig": { title: "Black Fig", description: "Низкое пламя с тёмным фруктовым звучанием.", price: 2400, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/lCrSqnLAXFKXmWXd.jpg", stock: 18 },
  "nocturne": { title: "Nocturne", description: "Керамическая маска с тихим характером.", price: 5600, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/lJJsOdgSMDOjJmdQ.jpg", stock: 5 },
  "last-seance": { title: "The Last Séance", description: "Постер для комнаты между комнатами.", price: 2900, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/lCrSqnLAXFKXmWXd.jpg", stock: 21 },
  "acid-moon": { title: "Acid Moon", description: "Маленький сигнал для долгой ночи.", price: 3800, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/lCrSqnLAXFKXmWXd.jpg", stock: 3 },
  "haunted-textures": { title: "Haunted Textures", description: "Тридцать шесть текстур для прекрасной незавершённости.", price: 1800, image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/XgTNBfpPRvrnTFPr.jpg", stock: 999 },
};

function replaceElementContent(html: string, start: string, end: string, content: string) {
  const startIndex = html.indexOf(start);
  if (startIndex < 0) return html;
  const endIndex = html.indexOf(end, startIndex + start.length);
  if (endIndex < 0) return html;
  return `${html.slice(0, startIndex)}${start}${content}${html.slice(endIndex)}`;
}

function replaceAttributeContent(html: string, start: string, content: string) {
  return replaceElementContent(html, start, '" />', content);
}

function injectRouteMetadata(template: string, requestUrl: string) {
  const pathname = new URL(requestUrl, PUBLIC_ORIGIN).pathname;
  const productSlug = pathname.match(/^\/product\/([^/]+)$/)?.[1];
  const product = productSlug ? PRODUCT_META[decodeURIComponent(productSlug)] : undefined;
  const meta = product ? { title: `${product.title} — NIGHT MARKET`, description: product.description, type: "Product" } : ROUTE_META[pathname] || ROUTE_META["/"];
  const canonical = `${PUBLIC_ORIGIN}${product ? `/product/${productSlug}` : ROUTE_META[pathname] ? pathname : "/"}`;
  let html = replaceElementContent(template, "<title>", "</title>", meta.title);
  html = replaceAttributeContent(html, '<meta name="description" content="', meta.description);
  html = replaceAttributeContent(html, '<meta property="og:title" content="', meta.title);
  html = replaceAttributeContent(html, '<meta property="og:description" content="', meta.description);
  html = replaceAttributeContent(html, '<meta property="og:url" content="', canonical);
  html = replaceAttributeContent(html, '<meta name="twitter:title" content="', meta.title);
  html = replaceAttributeContent(html, '<meta name="twitter:description" content="', meta.description);
  html = replaceAttributeContent(html, '<link rel="canonical" href="', canonical);
  const routeJson = JSON.stringify(product ? { "@context": "https://schema.org", "@type": "Product", name: product.title, description: product.description, image: product.image, sku: productSlug, offers: { "@type": "Offer", url: canonical, priceCurrency: "RUB", price: product.price, availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } } : { "@context": "https://schema.org", "@type": meta.type, name: meta.title, description: meta.description, url: canonical, inLanguage: "ru-RU" });
  html = replaceElementContent(html, '<script type="application/ld+json">', "</script>", routeJson);
  return html;
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = injectRouteMetadata(template, url);
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(`Could not find the build directory: ${distPath}, make sure to build the client first`);
  }

  app.use(express.static(distPath));

  app.use("*", async (req, res) => {
    try {
      const indexPath = path.resolve(distPath, "index.html");
      const template = await fs.promises.readFile(indexPath, "utf-8");
      res.status(200).set({ "Content-Type": "text/html" }).send(injectRouteMetadata(template, req.originalUrl));
    } catch {
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
