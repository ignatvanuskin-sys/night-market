export default function handler(_request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.status(200).json({
    status: "ok",
    service: "night-market",
    runtime: "vercel",
    timestamp: new Date().toISOString(),
  });
}
