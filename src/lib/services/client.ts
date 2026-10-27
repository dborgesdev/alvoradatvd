import type { FeedArticle, Rates, ServiceResult } from "../../types/services";

type Snapshot<T> = { result: ServiceResult<T> | null; loading: boolean };
function createResource<T>(path: string, ttl: number, maxAge: number) {
  let snapshot: Snapshot<T> = { result: null, loading: true };
  let nextAt = 0;
  let pending: Promise<void> | null = null;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((listener) => listener());
  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => snapshot,
    async refresh() {
      if (pending) return pending;
      if (Date.now() < nextAt) return;
      pending = (async () => {
        try {
          const base = import.meta.env.VITE_API_BASE_URL || "";
          const response = await fetch(`${base}${path}`, {
            signal: AbortSignal.timeout(15000),
            headers: { Accept: "application/json" },
          });
          const result = (await response.json()) as ServiceResult<T>;
          if (
            typeof result !== "object" ||
            result === null ||
            !("data" in result) ||
            typeof result.stale !== "boolean"
          )
            throw new Error("Resposta inválida");
          snapshot = { result, loading: false };
          nextAt = Date.now() + (response.ok && !result.stale ? ttl : 60000);
        } catch {
          snapshot = {
            result:
              snapshot.result?.data &&
              snapshot.result.updatedAt &&
              Date.now() - Date.parse(snapshot.result.updatedAt) < maxAge
                ? { ...snapshot.result, stale: true }
                : {
                    data: null,
                    updatedAt: null,
                    stale: false,
                    unavailable: true,
                  },
            loading: false,
          };
          nextAt = Date.now() + 60000;
        } finally {
          pending = null;
          emit();
        }
      })();
      return pending;
    },
  };
}
export const newsResource = createResource<FeedArticle[]>(
  "/api/news",
  900000,
  86400000,
);
export const ratesResource = createResource<Rates>(
  "/api/rates",
  1800000,
  604800000,
);
