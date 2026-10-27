import { XMLParser, XMLValidator } from "fast-xml-parser";
import type { FeedArticle } from "../src/types/services.ts";

type XmlNode = Record<string, unknown>;
const record = (v: unknown): XmlNode =>
  v !== null && typeof v === "object" ? (v as XmlNode) : {};
const array = (v: unknown): unknown[] =>
  Array.isArray(v) ? v : v === undefined ? [] : [v];
const scalar = (v: unknown): string =>
  typeof v === "string" || typeof v === "number"
    ? String(v)
    : scalarText(record(v)["#text"]);
const scalarText = (v: unknown): string =>
  typeof v === "string" || typeof v === "number" ? String(v) : "";

export function plainText(value: unknown, max: number): string {
  const text = scalar(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:nbsp|amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);/gi, (entity) => {
      const basic: Record<string, string> = {
        "&nbsp;": " ",
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&apos;": "'",
      };
      if (basic[entity.toLowerCase()]) return basic[entity.toLowerCase()];
      const code = entity.toLowerCase().startsWith("&#x")
        ? parseInt(entity.slice(3, -1), 16)
        : parseInt(entity.slice(2, -1), 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : " ";
    })
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}
export function safeSourceUrl(value: unknown, image = false): string | null {
  try {
    const url = new URL(scalar(value));
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      (url.port && url.port !== "443")
    )
      return null;
    const host = url.hostname.toLowerCase();
    const allowed = image
      ? host === "glbimg.com" ||
        host.endsWith(".glbimg.com") ||
        host === "s2.glbimg.com"
      : host === "g1.globo.com";
    if (!allowed) return null;
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}
export function parseRss(xml: string, now = Date.now()): FeedArticle[] {
  if (
    xml.length > 2_000_000 ||
    /<!\s*(?:DOCTYPE|ENTITY)/i.test(xml) ||
    XMLValidator.validate(xml) !== true
  )
    throw new Error("RSS inválido");
  const parsed = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: false,
    trimValues: true,
  }).parse(xml);
  const items = array(record(record(record(parsed).rss).channel).item);
  const urls = new Set<string>();
  const guids = new Set<string>();
  const candidates = items
    .slice(0, 300)
    .flatMap((value): FeedArticle[] => {
      const item = record(value);
      const url = safeSourceUrl(item.link);
      const title = plainText(item.title, 220);
      const published = Date.parse(scalar(item.pubDate));
      if (
        !url ||
        !title ||
        !Number.isFinite(published) ||
        published > now + 300000
      )
        return [];
      const image =
        array(item["media:content"])
          .map((v) => safeSourceUrl(record(v)["@_url"], true))
          .find(Boolean) || null;
      return [
        {
          id: scalar(item.guid).slice(0, 500) || url,
          title,
          summary: plainText(item["atom:subtitle"] || item.description, 240),
          url,
          publishedAt: new Date(published).toISOString(),
          image,
          source: "G1 Campinas e Região",
          sponsored: url.includes("/especial-publicitario/"),
        },
      ];
    })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const news = candidates
    .filter((item) => {
      if (urls.has(item.url) || guids.has(item.id)) return false;
      urls.add(item.url);
      guids.add(item.id);
      return true;
    })
    .slice(0, 10);
  if (!news.length) throw new Error("RSS sem itens válidos");
  return news;
}
