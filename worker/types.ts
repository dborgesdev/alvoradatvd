export interface Storage {
  get<T>(key: string): Promise<T | undefined>;
  put<T>(key: string, value: T): Promise<void>;
}
export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  EDITORIAL_CACHE: {
    idFromName(name: string): unknown;
    get(id: unknown): { fetch(request: Request): Promise<Response> };
  };
  OPEN_METEO_API_KEY?: string;
  WEATHER_EVALUATION?: string;
  FRONTEND_ORIGIN?: string;
}
