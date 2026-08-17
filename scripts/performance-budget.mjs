import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const assetDir = path.resolve("dist/public/assets");
const files = await readdir(assetDir);
const assets = await Promise.all(files.map(async (name) => ({ name, bytes: (await stat(path.join(assetDir, name))).size })));
const js = assets.filter((asset) => asset.name.endsWith(".js")).sort((a, b) => b.bytes - a.bytes)[0];
const css = assets.filter((asset) => asset.name.endsWith(".css")).sort((a, b) => b.bytes - a.bytes)[0];
const limits = { js: 850_000, css: 180_000 };
const failures = [];
if (!js || js.bytes > limits.js) failures.push(`JS ${js?.name ?? "missing"}: ${js?.bytes ?? 0} bytes (limit ${limits.js})`);
if (!css || css.bytes > limits.css) failures.push(`CSS ${css?.name ?? "missing"}: ${css?.bytes ?? 0} bytes (limit ${limits.css})`);
console.log(JSON.stringify({ js, css, limits }, null, 2));
if (failures.length) {
  console.error(`Performance budget exceeded: ${failures.join("; ")}`);
  process.exit(1);
}
