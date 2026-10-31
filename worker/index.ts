import type { Env, Storage } from "./types.ts";
import { SharedCache } from "./cache.ts";
import { policies } from "./sources.ts";
import { loadNews, loadRates } from "./providers.ts";
import { loadTeam, loadPrograms, loadAlbums } from "./wordpress.ts";
import type { ServiceResult } from "../src/types/services.ts";

const paths = new Set(["/api/news", "/api/rates", "/api/programs", "/api/team", "/api/albums"]);
export class EditorialCache {
  private cache: SharedCache;
  constructor(state: { storage: Storage }) {
    this.cache = new SharedCache(state.storage);
  }
  async fetch(request: Request): Promise<Response> {
    const path = new URL(request.url).pathname;
    const result: ServiceResult<unknown> | null =
      path === "/api/news"
        ? await this.cache.get("news-v1", policies.news, loadNews)
        : path === "/api/rates"
          ? await this.cache.get("rates-v1", policies.rates, loadRates)
          : path === "/api/team"
            ? await this.cache.get("wp-team-v1", policies.wordpress, loadTeam)
            : path === "/api/programs"
              ? await this.cache.get("wp-programs-v1", policies.wordpress, () => loadPrograms(async () => {
                  const team = await this.cache.get("wp-team-v1", policies.wordpress, loadTeam);
                  if (!team.data || team.stale) throw new Error("Equipe temporariamente indisponível");
                  return team.data;
                }))
              : path === "/api/albums"
                ? await this.cache.get("wp-albums-v1", policies.wordpress, loadAlbums)
                : null;
    return result
      ? Response.json(result, {
          status: result.data ? 200 : 503,
          headers: {
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
          },
        })
      : new Response(null, { status: 404 });
  }
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      if (!paths.has(url.pathname))
        return Response.json(
          { error: "Endpoint não encontrado" },
          { status: 404 },
        );
      if (request.method !== "GET")
        return new Response(null, { status: 405, headers: { Allow: "GET" } });
      try {
        const id = env.EDITORIAL_CACHE.idFromName("public-services-v1");
        // URL canônica impede fragmentar o cache com querystrings fornecidas pelo visitante.
        const response = await env.EDITORIAL_CACHE.get(id).fetch(
          new Request("https://services.internal" + url.pathname),
        );
        const origin = request.headers.get("Origin");
        if (
          origin &&
          origin === env.FRONTEND_ORIGIN &&
          new URL(origin).protocol === "https:"
        ) {
          const headers = new Headers(response.headers);
          headers.set("Access-Control-Allow-Origin", origin);
          headers.set("Vary", "Origin");
          return new Response(response.body, {
            status: response.status,
            headers,
          });
        }
        return response;
      } catch (error) {
        console.warn(
          "Cache binding failed",
          error instanceof Error
            ? error.message.replace(/https?:\/\/\S+/g, "[url]")
            : "Unknown error",
        );
        return Response.json(
          { data: null, updatedAt: null, stale: false, unavailable: true },
          { status: 503, headers: { "Cache-Control": "no-store" } },
        );
      }
    }
    return env.ASSETS.fetch(request);
  },
};
