import { test } from "node:test";
import assert from "node:assert/strict";
import { adaptPrograms } from "../src/lib/content/wordpress.ts";
import { buildSchedule } from "../src/lib/content/collections.ts";
import worker from "../worker/index.ts";
import { createResource } from "../src/lib/services/client.ts";

const slot = (dias, inicio = "00:00", fim = "23:59") => ({ dias, inicio, fim, tipo: "ao_vivo", observacao: "" });
const post = (rows) => ({ id: 32, slug: "24h-de-musica", status: "publish", title: { rendered: "24h de Música" }, acf: { apresentadores: [30] }, grade_horarios: rows });
const team = [{ id: "30", name: "Auto DJ" }];
test("Programa 32: dias [6,7] geram somente sábado e domingo, preservando Programas e apresentador", () => {
  const programs = adaptPrograms([post([slot([6, 7])])], [], team);
  assert.equal(programs[0].title, "24h de Música");
  assert.equal(programs[0].presenters[0].name, "Auto DJ");
  const schedule = buildSchedule(programs);
  for (let day = 0; day < 5; day++) assert.equal(schedule.filter(row => row.dayOfWeek === day).length, 0);
  assert.deepEqual(schedule.map(row => [row.dayOfWeek, row.startsAt, row.endsAt]), [[5, "00:00", "23:59"], [6, "00:00", "23:59"]]);
});
test("Grade vazia, ausente ou inválida nunca vira todos os dias", () => {
  for (const rows of [[], undefined, null, [slot([])], [slot([0, 8, "6"])], [slot([6], "24:00")]]) {
    const programs = adaptPrograms([post(rows)], [], team);
    assert.equal(programs.length, 1);
    assert.deepEqual(buildSchedule(programs), []);
  }
});
test("Múltiplas faixas e virada de domingo preservam somente dias explícitos e continuação necessária", () => {
  const programs = adaptPrograms([post([slot([6], "10:00", "11:00"), slot([7], "23:00", "01:00")])], [], team);
  assert.deepEqual(buildSchedule(programs).map(row => [row.dayOfWeek, row.startsAt, row.endsAt]), [[0, "00:00", "01:00"], [5, "10:00", "11:00"], [6, "23:00", "24:00"]]);
});
test("WordPress → Worker sem cache → cliente revalida dias e horários sem purge/rebuild", async t => {
  let now = Date.parse("2026-11-03T13:00:00Z");
  t.mock.method(Date, "now", () => now);
  let wpRows = [slot([1, 2, 3, 4, 5, 6, 7])];
  let wpCalls = 0; let clientCalls = 0;
  const wpFetch = async url => {
    const collection = new URL(url).pathname.split("/").pop();
    if (collection === "programas") wpCalls++;
    const body = collection === "programas" ? [post(wpRows)] : collection === "equipe" ? [{ id: 30, slug: "autodj", status: "publish", title: { rendered: "Auto DJ" }, acf: { exibir_site: true } }] : [];
    return Response.json(body, { headers: { "X-WP-Total": String(body.length), "X-WP-TotalPages": body.length ? "1" : "0" } });
  };
  const env = { ASSETS: { fetch: async () => new Response("SPA") },
    get EDITORIAL_CACHE() { throw Error("WordPress não pode acessar o Durable Object"); } };
  t.mock.method(globalThis, "fetch", async (url, init) => {
    if (String(url).startsWith("/api/")) {
      clientCalls++;
      assert.equal(init.cache, "no-store");
      const response = await worker.fetch(new Request("https://portal.test" + url), env);
      assert.equal(response.headers.get("Cache-Control"), "no-store");
      return response;
    }
    assert.equal(init.cache, "no-store");
    return wpFetch(url, init);
  });
  const client = createResource("/api/programs", 60000, 3600000);
  await client.refresh();
  assert.equal(buildSchedule(client.getSnapshot().result.data).length, 7);
  // Change WordPress without touching the app or frontend singleton.
  wpRows = [slot([6, 7])];
  now += 59000; await client.refresh();
  assert.equal(wpCalls, 1); assert.equal(clientCalls, 1);
  now += 1000; await client.refresh();
  const updated = client.getSnapshot().result.data;
  assert.deepEqual(buildSchedule(updated).map(row => row.dayOfWeek), [5, 6]);
  assert.equal(updated[0].presenters[0].name, "Auto DJ");
  assert.equal(wpCalls, 2);
  wpRows = [slot([3], "08:00", "09:30")];
  now += 60000; await client.refresh();
  assert.deepEqual(buildSchedule(client.getSnapshot().result.data).map(row => [row.dayOfWeek, row.startsAt, row.endsAt]), [[2, "08:00", "09:30"]]);
  wpRows = []; now += 60000; await client.refresh();
  assert.deepEqual(buildSchedule(client.getSnapshot().result.data), []);
  assert.equal(client.getSnapshot().result.data.length, 1);
});
