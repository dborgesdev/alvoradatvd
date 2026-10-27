import { test } from "node:test";
import assert from "node:assert/strict";
import { parseRss, plainText, safeSourceUrl } from "../worker/rss.ts";
import { SharedCache } from "../worker/cache.ts";
import { parseQuote } from "../worker/providers.ts";
import worker from "../worker/index.ts";
import { fetchLimited } from "../worker/http.ts";
import { policies } from "../worker/sources.ts";
import { formatDate, brazilTimeZone } from "../src/lib/services/format.ts";

const stamp = Date.parse("2026-10-27T15:00:00Z");
test("TTLs e formatação mantêm 15/30 minutos e fuso de Brasília", () => {
  assert.equal(policies.news.ttl, 900);
  assert.equal(policies.rates.ttl, 1800);
  assert.equal(brazilTimeZone, "America/Sao_Paulo");
  assert.match(formatDate("2026-10-27T01:00:00Z"), /26\/10\/2026,? 22:00/);
});
test("HTTP usa redirect manual compatível com Workers e rejeita redirecionamentos/tamanho excessivo", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async (_url, init) => {
      assert.equal(init.redirect, "manual");
      return new Response("redirecionado", { status: 302 });
    };
    await assert.rejects(() => fetchLimited("https://g1.globo.com/rss"));
    globalThis.fetch = async () =>
      new Response("muito grande", { headers: { "Content-Length": "10000" } });
    await assert.rejects(() => fetchLimited("https://g1.globo.com/rss", 100));
    globalThis.fetch = async () => new Response("conteúdo válido");
    assert.equal(
      await fetchLimited("https://g1.globo.com/rss"),
      "conteúdo válido",
    );
  } finally {
    globalThis.fetch = original;
  }
});
function item(i, extra = "", guid = `fixture-${i}`) {
  return `<item><title>Notícia de teste ${i}</title><atom:subtitle><![CDATA[Resumo <b>de teste</b> &amp; detalhes]]></atom:subtitle><link>https://g1.globo.com/sp/campinas-regiao/noticia/teste-${i}.ghtml</link><guid>${guid}</guid><pubDate>${new Date(stamp - i * 60000).toUTCString()}</pubDate>${extra}</item>`;
}
const wrap = (items) =>
  `<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/"><channel>${items}</channel></rss>`;
const memory = () => {
  const map = new Map();
  return {
    get: async (key) => map.get(key),
    put: async (key, value) => {
      map.set(key, structuredClone(value));
    },
  };
};
test("RSS ordena por data, limita dez e prioriza imagem media:content sem republicar HTML", () => {
  const xml = wrap(
    Array.from({ length: 12 }, (_, i) =>
      item(
        11 - i,
        '<media:content url="https://s2-g1.glbimg.com/exemplo.jpg" medium="image"/><description><![CDATA[<img src="https://example.com/falsa.jpg"/>Texto integral descartado]]></description>',
      ),
    ).join(""),
  );
  const news = parseRss(xml, stamp);
  assert.equal(news.length, 10);
  assert.equal(news[0].title, "Notícia de teste 0");
  assert.equal(news[0].summary, "Resumo de teste & detalhes");
  assert.equal(news[0].image, "https://s2-g1.glbimg.com/exemplo.jpg");
  assert.ok(
    news.every(
      (n) =>
        n.source === "G1 Campinas e Região" && !n.summary.includes("integral"),
    ),
  );
});
test("RSS remove URLs/GUIDs repetidos, datas inválidas e links maliciosos", () => {
  const xml = wrap(
    item(0) +
      item(0) +
      item(1, "", "fixture-0") +
      item(2) +
      item(3).replace(
        "https://g1.globo.com/sp/campinas-regiao/noticia/teste-3.ghtml",
        "javascript:alert(1)",
      ) +
      item(4).replace(new Date(stamp - 4 * 60000).toUTCString(), "inválida"),
  );
  assert.equal(parseRss(xml, stamp).length, 2);
  assert.equal(
    safeSourceUrl("https://g1.globo.com.evil.example/noticia"),
    null,
  );
  assert.equal(safeSourceUrl("https://user:password@g1.globo.com/a"), null);
  assert.equal(safeSourceUrl("http://g1.globo.com/a"), null);
  assert.equal(safeSourceUrl("https://127.0.0.1/image", true), null);
});
test("Imagem ausente permanece nula; texto limitado, XML malformado e entidades externas rejeitados", () => {
  assert.equal(parseRss(wrap(item(0)), stamp)[0].image, null);
  assert.ok(plainText("x".repeat(500), 240).length <= 240);
  assert.equal(
    plainText("<script>alert(1)</script><p>Seguro</p>", 240),
    "Seguro",
  );
  assert.throws(() =>
    parseRss('<!DOCTYPE rss [<!ENTITY x SYSTEM "file:///etc/passwd">]><rss/>'),
  );
  assert.throws(() => parseRss("<rss><channel></rss>"));
  assert.throws(() => parseRss("<rss><channel/></rss>"));
});
test("Cache compartilhado: frio, quente, 900s e persistência entre instâncias", async () => {
  const storage = memory();
  let now = stamp;
  let calls = 0;
  const load = async () => ({ value: ++calls });
  const policy = { ttl: 900, maxAge: 86400 };
  const cache = new SharedCache(storage, () => now);
  const first = await cache.get("news", policy, load);
  now += 899000;
  const second = await new SharedCache(storage, () => now).get(
    "news",
    policy,
    load,
  );
  assert.equal(calls, 1);
  assert.deepEqual(second, first);
  now += 1000;
  const third = await cache.get("news", policy, load);
  assert.equal(calls, 2);
  assert.equal(third.data.value, 2);
});
test("Cache reúne requisições concorrentes, preserva última válida e limita falhas", async () => {
  let now = stamp;
  const storage = memory();
  const cache = new SharedCache(storage, () => now);
  let calls = 0;
  const policy = { ttl: 900, maxAge: 86400 };
  await Promise.all(
    Array.from({ length: 8 }, () =>
      cache.get("n", policy, async () => {
        calls++;
        return ["real"];
      }),
    ),
  );
  assert.equal(calls, 1);
  now += 900000;
  const fail = async () => {
    calls++;
    throw new Error("offline");
  };
  const stale = await cache.get("n", policy, fail);
  assert.deepEqual(stale.data, ["real"]);
  assert.equal(stale.stale, true);
  assert.equal(stale.updatedAt, new Date(stamp).toISOString());
  await cache.get("n", policy, fail);
  assert.equal(calls, 2);
  now += 60000;
  await cache.get("n", policy, fail);
  assert.equal(calls, 3);
  now += 86400000;
  assert.equal((await cache.get("n", policy, fail)).data, null);
});
test("Cache frio em falha não inventa dados e respeita backoff global", async () => {
  const storage = memory();
  let calls = 0;
  const load = async () => {
    calls++;
    throw Error();
  };
  const cache = new SharedCache(storage, () => stamp);
  const result = await cache.get("n", { ttl: 900, maxAge: 86400 }, load);
  await new SharedCache(storage, () => stamp).get(
    "n",
    { ttl: 900, maxAge: 86400 },
    load,
  );
  assert.equal(result.data, null);
  assert.equal(result.unavailable, true);
  assert.equal(calls, 1);
});
test("PTAX usa venda de fechamento e converte fuso explicitamente", () => {
  const quote = parseQuote(
    {
      value: [
        {
          cotacaoVenda: 5.1234,
          dataHoraCotacao: "2026-10-26 13:00:00.000",
          tipoBoletim: "Fechamento",
        },
        {
          cotacaoVenda: 8,
          dataHoraCotacao: "2026-10-27 10:00:00.000",
          tipoBoletim: "Abertura",
        },
      ],
    },
    "USD",
  );
  assert.equal(quote.sell, 5.1234);
  assert.equal(quote.referenceAt, "2026-10-26T13:00:00.000-03:00");
  assert.throws(() => parseQuote({ value: [] }, "EUR"));
});
test("Worker preserva assets, rejeita API desconhecida e não aceita URL de origem do visitante", async () => {
  let internal = "";
  const env = {
    ASSETS: { fetch: async () => new Response("SPA") },
    EDITORIAL_CACHE: {
      idFromName: () => "one",
      get: () => ({
        fetch: async (request) => {
          internal = request.url;
          return Response.json({ data: [] });
        },
      }),
    },
  };
  assert.equal(
    await (
      await worker.fetch(new Request("https://portal.test/tv"), env)
    ).text(),
    "SPA",
  );
  assert.equal(
    (await worker.fetch(new Request("https://portal.test/api/weather"), env))
      .status,
    404,
  );
  assert.equal(
    (await worker.fetch(new Request("https://portal.test/api/unknown"), env))
      .status,
    404,
  );
  assert.equal(
    (
      await worker.fetch(
        new Request("https://portal.test/api/news", { method: "POST" }),
        env,
      )
    ).status,
    405,
  );
  await worker.fetch(
    new Request("https://portal.test/api/news?url=http://private"),
    env,
  );
  assert.equal(internal, "https://services.internal/api/news");
});

test("CORS libera somente a origem HTTPS explicitamente configurada", async () => {
  const env = {
    FRONTEND_ORIGIN: "https://portal.example",
    ASSETS: { fetch: async () => new Response("SPA") },
    EDITORIAL_CACHE: {
      idFromName: () => "one",
      get: () => ({ fetch: async () => Response.json({ data: [] }) }),
    },
  };
  const allowed = await worker.fetch(
    new Request("https://backend.example/api/news", {
      headers: { Origin: "https://portal.example" },
    }),
    env,
  );
  assert.equal(
    allowed.headers.get("Access-Control-Allow-Origin"),
    "https://portal.example",
  );
  const denied = await worker.fetch(
    new Request("https://backend.example/api/news", {
      headers: { Origin: "https://outro.example" },
    }),
    env,
  );
  assert.equal(denied.headers.get("Access-Control-Allow-Origin"), null);
});

test("Timeout interrompe a consulta do provedor sem aguardar indefinidamente", async (t) => {
  const original = globalThis.fetch;
  t.mock.timers.enable({ apis: ["setTimeout"] });
  try {
    globalThis.fetch = async (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener(
          "abort",
          () => reject(new DOMException("timeout", "AbortError")),
          { once: true },
        );
      });
    const request = fetchLimited("https://g1.globo.com/rss");
    const rejected = assert.rejects(request, { name: "AbortError" });
    t.mock.timers.tick(10000);
    await rejected;
  } finally {
    globalThis.fetch = original;
    t.mock.timers.reset();
  }
});

test("Relógio mantém dia, data e hora em uma linha no fuso de Brasília", async () => {
  const { formatClock } = await import("../src/lib/services/format.ts");
  assert.equal(
    formatClock(new Date("2026-10-27T15:39:59Z")),
    "terça-feira, 27/10/2026 · 12:39:59",
  );
  assert.equal(
    formatClock(new Date("2026-10-28T01:05:06Z")),
    "terça-feira, 27/10/2026 · 22:05:06",
  );
});

test("Layout editorial respeita a largura útil dos cards e as duas transições", async () => {
  const { newsLayoutForWidth } = await import("../src/hooks/useNewsLayout.ts");
  for (const width of [0, 320, 639])
    assert.equal(newsLayoutForWidth(width), "compact");
  for (const width of [640, 768, 1119])
    assert.equal(newsLayoutForWidth(width), "grid");
  for (const width of [1120, 1280, 1600])
    assert.equal(newsLayoutForWidth(width), "wide");
});
