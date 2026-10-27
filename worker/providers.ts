import type { FeedArticle, Rates } from "../src/types/services.ts";
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
