import { cp, mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist/public");
const routes = [
  "product/raven-hour",
  "product/ember-ritual",
  "product/night-herbarium",
  "product/black-fig",
  "product/nocturne",
  "product/the-last-seance",
  "product/acid-moon",
  "product/haunted-textures",
  "lookbook",
  "favorites",
  "policies",
];
for (const route of routes) {
  const target = path.join(root, route, "index.html");
  await mkdir(path.dirname(target), { recursive: true });
  await cp(path.join(root, "index.html"), target);
}
console.log(`Prepared ${routes.length} Vercel SPA route entries.`);
