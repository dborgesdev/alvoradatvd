import { readFileSync, writeFileSync } from "node:fs";
const policy = JSON.parse(
  readFileSync(
    new URL("../src/data/content/route-policy.json", import.meta.url),
    "utf8",
  ),
);
const raw = process.env.VITE_PUBLIC_SITE_URL;
const origin = raw ? new URL(raw).origin : null;
if (origin && !origin.startsWith("https://"))
  throw new Error("O domínio público precisa usar HTTPS.");
writeFileSync(
  "public/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${origin ? policy.indexable.map((route) => `<url><loc>${origin}${route}</loc></url>`).join("") : ""}</urlset>\n`,
);
writeFileSync(
  "public/robots.txt",
  origin
    ? `User-agent: *\nAllow: /\n${policy.noindex.map((route) => `Disallow: ${route}`).join("\n")}\nSitemap: ${origin}/sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n",
);
