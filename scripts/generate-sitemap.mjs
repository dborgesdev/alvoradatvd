import { writeFileSync } from "node:fs";
const raw = process.env.VITE_PUBLIC_SITE_URL;
const routes = ["/", "/tv", "/institucional", "/historia-do-radio", "/contato"];
const origin = raw ? new URL(raw).origin : null;
if (origin && !origin.startsWith("https://"))
  throw new Error("O domínio público precisa usar HTTPS.");
writeFileSync(
  "public/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${origin ? routes.map((route) => `<url><loc>${origin}${route}</loc></url>`).join("") : ""}</urlset>\n`,
);
writeFileSync(
  "public/robots.txt",
  origin
    ? `User-agent: *\nAllow: /\nDisallow: /noticias\nDisallow: /radio\nDisallow: /programas\nDisallow: /equipe\nDisallow: /promocoes\nSitemap: ${origin}/sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n",
);
