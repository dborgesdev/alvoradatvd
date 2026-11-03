import type { Env, Storage } from "./types.ts";
import { SharedCache } from "./cache.ts";
import { policies } from "./sources.ts";
import { loadNews, loadRates } from "./providers.ts";
import { loadTeam, loadPrograms, loadAlbums } from "./wordpress.ts";
import type { ServiceResult } from "../src/types/services.ts";

const cachedPaths = new Set(["/api/news", "/api/rates"]);
const wordpressPaths = new Set(["/api/programs", "/api/team", "/api/albums"]);

function serviceResponse(result: ServiceResult<unknown>): Response {
  return Response.json(result, {
    status: result.data ? 200 : 503,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

// This Durable Object serves only RSS news and exchange rates.
export class EditorialCache {
  private cache: SharedCache;
  constructor(state: { storage: Storage }) {
    this.cache = new SharedCache(state.storage);
  }
  async fetch(request: Request): Promise<Response> {
    const path = new URL(request.url).pathname;
    const result = path === "/api/news"
      ? await this.cache.get("news-v1", policies.news, loadNews)
      : path === "/api/rates"
        ? await this.cache.get("rates-v1", policies.rates, loadRates)
        : null;
    return result ? serviceResponse(result) : new Response(null, { status: 404 });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      if (!cachedPaths.has(url.pathname) && !wordpressPaths.has(url.pathname))
        return Response.json({ error: "Endpoint não encontrado" }, { status: 404 });
      if (request.method !== "GET")
        return new Response(null, { status: 405, headers: { Allow: "GET" } });
      try {
        let response: Response;
        if (wordpressPaths.has(url.pathname)) {
          // No Worker/CDN cache or Durable Object for WordPress content.
          const data = url.pathname === "/api/programs"
            ? await loadPrograms(loadTeam)
            : url.pathname === "/api/team" ? await loadTeam() : await loadAlbums();
          response = serviceResponse({ data, updatedAt: new Date().toISOString(), stale: false });
        } else {
          const id = env.EDITORIAL_CACHE.idFromName("public-services-v1");
          // Canonical path prevents visitor queries from selecting origins or cache keys.
          response = await env.EDITORIAL_CACHE.get(id).fetch(
            new Request("https://services.internal" + url.pathname),
          );
        }
        const origin = request.headers.get("Origin");
        if (origin && origin === env.FRONTEND_ORIGIN && new URL(origin).protocol === "https:") {
          const headers = new Headers(response.headers);
          headers.set("Access-Control-Allow-Origin", origin);
          headers.set("Vary", "Origin");
          return new Response(response.body, { status: response.status, headers });
        }
        return response;
      } catch (error) {
        console.warn("Editorial service failed", error instanceof Error
          ? error.message.replace(/https?:\/\/\S+/g, "[url]") : "Unknown error");
        return serviceResponse({ data: null, updatedAt: null, stale: false, unavailable: true });
      }
    }
    return env.ASSETS.fetch(request);
  },
};
