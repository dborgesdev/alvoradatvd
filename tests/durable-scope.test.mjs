import { test } from "node:test";
import assert from "node:assert/strict";
import worker, { EditorialCache } from "../worker/index.ts";

test("Durable Object rejeita todos os recursos WordPress sem ler ou escrever cache", async () => {
  let accesses = 0;
  const object = new EditorialCache({ storage: { get: async () => { accesses++; }, put: async () => { accesses++; } } });
  for (const resource of ["programs", "team", "albums"]) {
    const response = await object.fetch(new Request("https://internal/api/" + resource));
    assert.equal(response.status, 404);
  }
  assert.equal(accesses, 0);
});
test("Notícias e cotações continuam roteadas exclusivamente ao Durable Object", async () => {
  const forwarded = [];
  const env = {
    ASSETS: { fetch: async () => new Response("SPA") },
    EDITORIAL_CACHE: {
      idFromName: name => { assert.equal(name, "public-services-v1"); return "id"; },
      get: () => ({ fetch: async request => { forwarded.push(request.url); return Response.json({ data: [], stale: false }); } }),
    },
  };
  for (const resource of ["news", "rates"]) {
    const response = await worker.fetch(new Request("https://portal.test/api/" + resource + "?url=http://private"), env);
    assert.equal(response.status, 200);
  }
  assert.deepEqual(forwarded, ["https://services.internal/api/news", "https://services.internal/api/rates"]);
});
test("Cache do Durable Object continua com TTL de notícias e só grava sua chave", async t => {
  const values = new Map(); let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    calls++;
    return new Response('<rss><channel><item><title>Teste</title><link>https://g1.globo.com/sp/campinas-regiao/noticia/teste.ghtml</link><guid>teste</guid><pubDate>Tue, 03 Nov 2026 13:00:00 GMT</pubDate></item></channel></rss>');
  });
  const object = new EditorialCache({ storage: { get: async key => values.get(key), put: async (key, value) => values.set(key, value) } });
  const first = await object.fetch(new Request("https://internal/api/news"));
  assert.equal(first.status, 200);
  await object.fetch(new Request("https://internal/api/news"));
  assert.equal(calls, 1);
  assert.deepEqual([...values.keys()], ["news-v1"]);
});
