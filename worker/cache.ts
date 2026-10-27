import type { Storage } from "./types.ts";
import type { ServiceResult } from "../src/types/services.ts";
type Entry<T> = { data: T; updated: number; retryAfter?: number };
type Policy = { ttl: number; maxAge: number };
export class SharedCache {
  private inFlight = new Map<string, Promise<ServiceResult<unknown>>>();
  private storage: Storage;
  private now: () => number;
  constructor(storage: Storage, now: () => number = Date.now) {
    this.storage = storage;
    this.now = now;
  }
  async get<T>(
    key: string,
    policy: Policy,
    load: () => Promise<T>,
  ): Promise<ServiceResult<T>> {
    const pending = this.inFlight.get(key);
    if (pending) return pending as Promise<ServiceResult<T>>;
    const job = this.resolve(key, policy, load);
    this.inFlight.set(key, job);
    try {
      return await job;
    } finally {
      this.inFlight.delete(key);
    }
  }
  private async resolve<T>(
    key: string,
    policy: Policy,
    load: () => Promise<T>,
  ): Promise<ServiceResult<T>> {
    const entry = await this.storage.get<Entry<T>>(key);
    const now = this.now();
    const age = entry ? now - entry.updated : Infinity;
    if (entry && age < policy.ttl * 1000)
      return {
        data: entry.data,
        updatedAt: new Date(entry.updated).toISOString(),
        stale: false,
      };
    const blocked = (await this.storage.get<number>(key + ":retry")) || 0;
    if (blocked <= now) {
      try {
        const data = await load();
        const updated = this.now();
        await this.storage.put(key, { data, updated });
        return {
          data,
          updatedAt: new Date(updated).toISOString(),
          stale: false,
        };
      } catch (error) {
        console.warn(
          "Service refresh failed",
          key,
          error instanceof Error
            ? `${error.name}: ${error.message.replace(/https?:\/\/\S+/g, "[url]")}`
            : "UnknownError",
        );
        // Backoff compartilhado também em cache frio, sem expor erro/credenciais do provedor.
        await this.storage.put(key + ":retry", now + 60000);
      }
    }
    if (entry && age < policy.maxAge * 1000)
      return {
        data: entry.data,
        updatedAt: new Date(entry.updated).toISOString(),
        stale: true,
      };
    return { data: null, updatedAt: null, stale: false, unavailable: true };
  }
}
