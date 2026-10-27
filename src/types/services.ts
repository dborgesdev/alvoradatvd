export type FeedArticle = {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  image: string | null;
  source: "G1 Campinas e Região";
  sponsored: boolean;
};
export type Rates = {
  source: "Banco Central do Brasil — PTAX";
  quotes: { currency: "USD" | "EUR"; sell: number; referenceAt: string }[];
};
export type Weather = {
  temperature: number;
  code: number;
  referenceAt: string;
  location: "Campinas, SP";
  source: "Open-Meteo";
};
export type ServiceResult<T> = {
  data: T | null;
  updatedAt: string | null;
  stale: boolean;
  unavailable?: boolean;
};
