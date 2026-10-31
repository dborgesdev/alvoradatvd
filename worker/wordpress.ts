import { fetchLimitedResponse } from "./http.ts";
import type { WpPost, WpProgram, WpAlbum, WpTerm } from "../src/types/wordpress.ts";
import { adaptAlbums, adaptPrograms, adaptTeam } from "../src/lib/content/wordpress.ts";
import type { TeamProfile } from "../src/types/editorial.ts";

export const wordpressApi = "https://painel.alvoradatvd.com/wp-json/wp/v2/";
type Collection = "programas" | "equipe" | "albuns" | "categorias-programa" | "categorias-albuns";
export async function fetchWpCollection<T extends { id: number }>(collection: Collection): Promise<T[]> {
  const posts: T[] = [];
  let pages = 1;
  let total = 0;
  for (let page = 1; page <= pages; page++) {
    const url = new URL(collection, wordpressApi);
    url.search = new URLSearchParams({ acf_format: "standard", _embed: "wp:featuredmedia", per_page: "100", page: String(page), orderby: "id", order: "asc", context: "view", ...(collection.startsWith("categorias-") ? {} : { status: "publish" }) }).toString();
    const response = await fetchLimitedResponse(url.href, 10_000_000);
    const data: unknown = JSON.parse(response.text);
    const pageCount = Number(response.headers.get("X-WP-TotalPages"));
    const count = Number(response.headers.get("X-WP-Total"));
    if (!Array.isArray(data) || !response.headers.has("X-WP-TotalPages") || !response.headers.has("X-WP-Total") || !Number.isInteger(pageCount) || pageCount < 0 || pageCount > 100 || !Number.isInteger(count) || count < 0) throw new Error("Paginação WordPress inválida ou excedeu o limite de segurança");
    if (page === 1) { pages = pageCount; total = count; }
    if (pages !== pageCount || total !== count || data.some(item => !item || !Number.isInteger(item.id) || item.id < 1)) throw new Error("Coleção WordPress mudou durante a leitura");
    posts.push(...data as T[]);
  }
  if (posts.length !== total || new Set(posts.map(post => post.id)).size !== total) throw new Error("Coleção WordPress incompleta");
  return posts;
}
export async function loadTeam() {
  return adaptTeam(await fetchWpCollection<WpPost>("equipe"));
}
export async function loadPrograms(team: () => Promise<TeamProfile[]>) {
  const [posts, terms, presenters] = await Promise.all([fetchWpCollection<WpProgram>("programas"), fetchWpCollection<WpTerm>("categorias-programa"), team()]);
  return adaptPrograms(posts, terms, presenters);
}
export async function loadAlbums() {
  const [posts, terms] = await Promise.all([fetchWpCollection<WpAlbum>("albuns"), fetchWpCollection<WpTerm>("categorias-albuns")]);
  return adaptAlbums(posts, terms);
}
