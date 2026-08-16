import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

const PUBLIC_ORIGIN = "https://occultshop-tqvscu7k.manus.space";
const ROUTE_META: Record<string, { title: string; description: string; type: string }> = {
  "/": { title: "NIGHT MARKET — Objects for after dark", description: "Редкие объекты и атмосферные вещи для жизни после наступления темноты.", type: "WebSite" },
  "/lookbook": { title: "Lookbook — NIGHT MARKET", description: "Три редакционных образа NIGHT MARKET для пространства после наступления темноты.", type: "CollectionPage" },
  "/favorites": { title: "Избранное — NIGHT MARKET", description: "Сохранённые объекты NIGHT MARKET.", type: "CollectionPage" },
  "/policies": { title: "Доставка и условия — NIGHT MARKET", description: "Доставка по России, возврат, конфиденциальность и ограничения демо-витрины NIGHT MARKET.", type: "WebPage" },
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
  const meta = ROUTE_META[pathname] || ROUTE_META["/"];
  const canonical = `${PUBLIC_ORIGIN}${ROUTE_META[pathname] ? pathname : "/"}`;
  let html = replaceElementContent(template, "<title>", "</title>", meta.title);
  html = replaceAttributeContent(html, '<meta name="description" content="', meta.description);
  html = replaceAttributeContent(html, '<meta property="og:title" content="', meta.title);
  html = replaceAttributeContent(html, '<meta property="og:description" content="', meta.description);
  html = replaceAttributeContent(html, '<meta property="og:url" content="', canonical);
  html = replaceAttributeContent(html, '<meta name="twitter:title" content="', meta.title);
  html = replaceAttributeContent(html, '<meta name="twitter:description" content="', meta.description);
  html = replaceAttributeContent(html, '<link rel="canonical" href="', canonical);
  const routeJson = JSON.stringify({ "@context": "https://schema.org", "@type": meta.type, name: meta.title, description: meta.description, url: canonical, inLanguage: "ru-RU" });
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
