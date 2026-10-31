export const sources = {
  news: "https://g1.globo.com/rss/g1/sp/campinas-regiao/",
  ptax: "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/",
} as const;
export const policies = {
  wordpress: { ttl: 300, maxAge: 3600 },
  news: { ttl: 900, maxAge: 86400 },
  rates: { ttl: 1800, maxAge: 604800 },
} as const;
