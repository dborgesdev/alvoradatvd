import type { FeedArticle, Rates, Weather } from "../src/types/services.ts";
import type { Env } from "./types.ts";
import { sources } from "./sources.ts";
import { fetchLimited } from "./http.ts";
import { parseRss } from "./rss.ts";

export async function loadNews(): Promise<FeedArticle[]> {
  return parseRss(await fetchLimited(sources.news));
}
function ptaxDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(date);
  return parts.replaceAll("/", "-");
}
export function parseQuote(
  input: unknown,
  currency: "USD" | "EUR",
): Rates["quotes"][number] {
  const data = input as {
    value?: {
      cotacaoVenda?: unknown;
      dataHoraCotacao?: unknown;
      tipoBoletim?: unknown;
    }[];
  };
  const latest = data?.value
    ?.filter(
      (v) =>
        v.tipoBoletim === "Fechamento" &&
        typeof v.cotacaoVenda === "number" &&
        Number.isFinite(v.cotacaoVenda) &&
        v.cotacaoVenda > 0 &&
        typeof v.dataHoraCotacao === "string",
    )
    .sort((a, b) =>
      String(b.dataHoraCotacao).localeCompare(String(a.dataHoraCotacao)),
    )[0];
  if (!latest) throw new Error("PTAX sem fechamento");
  const referenceAt =
    String(latest.dataHoraCotacao)
      .replace(" ", "T")
      .replace(/(\.\d{3})\d+$/, "$1") + "-03:00";
  if (!Number.isFinite(Date.parse(referenceAt)))
    throw new Error("Data PTAX inválida");
  return { currency, sell: latest.cotacaoVenda as number, referenceAt };
}
export async function loadRates(): Promise<Rates> {
  const today = new Date();
  const start = new Date(today.getTime() - 14 * 86400000);
  const quotes = await Promise.all(
    (["USD", "EUR"] as const).map(async (currency) => {
      const url = new URL(
        "CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)",
        sources.ptax,
      );
      url.search = new URLSearchParams({
        "@moeda": `'${currency}'`,
        "@dataInicial": `'${ptaxDate(start)}'`,
        "@dataFinalCotacao": `'${ptaxDate(today)}'`,
        $top: "200",
        $format: "json",
      }).toString();
      return parseQuote(
        JSON.parse(await fetchLimited(url.href, 100000)),
        currency,
      );
    }),
  );
  return { source: "Banco Central do Brasil — PTAX", quotes };
}
export function parseWeather(input: unknown): Weather {
  const { current } = input as {
    current?: {
      temperature_2m?: unknown;
      weather_code?: unknown;
      time?: unknown;
    };
  };
  if (
    typeof current?.temperature_2m !== "number" ||
    !Number.isFinite(current.temperature_2m) ||
    current.temperature_2m < -60 ||
    current.temperature_2m > 60 ||
    typeof current.weather_code !== "number" ||
    typeof current.time !== "number"
  )
    throw new Error("Clima inválido");
  const referenceAt = new Date(current.time * 1000).toISOString();
  if (Math.abs(Date.now() - Date.parse(referenceAt)) > 3 * 3600000)
    throw new Error("Clima fora de validade");
  return {
    temperature: current.temperature_2m,
    code: current.weather_code,
    referenceAt,
    location: "Campinas, SP",
    source: "Open-Meteo",
  };
}
export async function loadWeather(env: Env): Promise<Weather> {
  if (!env.OPEN_METEO_API_KEY && env.WEATHER_EVALUATION !== "true")
    throw new Error("Clima requer configuração");
  const url = new URL(
    env.OPEN_METEO_API_KEY
      ? "https://customer-api.open-meteo.com/v1/forecast"
      : "https://api.open-meteo.com/v1/forecast",
  );
  url.search = new URLSearchParams({
    latitude: String(sources.latitude),
    longitude: String(sources.longitude),
    current: "temperature_2m,weather_code",
    timezone: "America/Sao_Paulo",
    timeformat: "unixtime",
  }).toString();
  if (env.OPEN_METEO_API_KEY)
    url.searchParams.set("apikey", env.OPEN_METEO_API_KEY);
  return parseWeather(JSON.parse(await fetchLimited(url.href, 100000)));
}
