const base = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const routes = ["/", "/product/raven-hour", "/product/ember-ritual", "/lookbook", "/favorites", "/policies", "/route-that-does-not-exist"];
const checks = [];
for (const route of routes) {
  const response = await fetch(`${base}${route}`);
  const body = await response.text();
  checks.push({ route, status: response.status, hasTitle: /<title>[^<]+<\/title>/i.test(body), hasNightMarket: body.includes("NIGHT MARKET"), nosniff: response.headers.get("x-content-type-options") === "nosniff", frameDeny: response.headers.get("x-frame-options") === "DENY" });
}
const healthResponse = await fetch(`${base}/api/health`);
const health = await healthResponse.json();
const productResponse = await fetch(`${base}/product/raven-hour`);
const productHtml = await productResponse.text();
const result = { base, health, routes: checks, productHasJsonLd: /application\/ld\+json/i.test(productHtml) };
console.log(JSON.stringify(result, null, 2));
const routeFailures = checks.filter((check) => check.status >= 500 || !check.hasTitle || !check.hasNightMarket || !check.nosniff || !check.frameDeny);
if (health.status !== "ok" || healthResponse.status >= 400 || routeFailures.length || !result.productHasJsonLd) {
  console.error("Release smoke check failed", { routeFailures, health, productHasJsonLd: result.productHasJsonLd });
  process.exit(1);
}
