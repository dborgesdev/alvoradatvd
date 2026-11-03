import { test } from "node:test";
import assert from "node:assert/strict";
import { createResource } from "../src/lib/services/client.ts";

test("Cliente editorial compartilha consulta pendente, respeita TTL e distingue falha de coleção vazia", async t => {
  let now = Date.parse("2026-10-30T20:00:00Z");
  t.mock.method(Date, "now", () => now);
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => { calls++; return Response.json({ data: [], stale: false, updatedAt: new Date(now).toISOString() }); });
  const resource = createResource("/api/programs", 60000, 3600000);
  assert.equal(resource.getSnapshot().loading, true);
  await Promise.all([resource.refresh(), resource.refresh(), resource.refresh()]);
  assert.equal(calls, 1);
  assert.equal(resource.getSnapshot().loading, false);
  assert.deepEqual(resource.getSnapshot().result.data, []);
  await resource.refresh(); assert.equal(calls, 1);
  now += 60000;
  await resource.refresh(); assert.equal(calls, 2);
  t.mock.method(globalThis, "fetch", async () => { throw Error("offline"); });
  const cold = createResource("/api/programs", 60000, 3600000);
  await cold.refresh();
  assert.equal(cold.getSnapshot().result.unavailable, true);
  assert.equal(cold.getSnapshot().result.data, null);
});
test("Cache em memória não mantém dados antigos indefinidamente em falha de rede", async t => {
  let now = Date.parse("2026-11-03T13:00:00Z");
  t.mock.method(Date, "now", () => now);
  t.mock.method(globalThis, "fetch", async () => Response.json({ data: ["real"], stale: false, updatedAt: new Date(now).toISOString() }));
  const resource = createResource("/api/programs", 60000, 3600000);
  await resource.refresh();
  t.mock.method(globalThis, "fetch", async () => { throw Error("offline"); });
  now += 60000; await resource.refresh();
  assert.equal(resource.getSnapshot().result.stale, true);
  now += 3600000; await resource.refresh();
  assert.equal(resource.getSnapshot().result.data, null);
});

test("Recarregar o frontend cria cache vazio e consulta imediatamente a versão atual", async t => {
  let version = 1; let calls = 0;
  t.mock.method(globalThis, "fetch", async (_url, init) => {
    assert.equal(init.cache, "no-store");
    calls++;
    return Response.json({ data: [version], stale: false, updatedAt: new Date().toISOString() });
  });
  const opened = createResource("/api/programs", 60000, 3600000);
  await opened.refresh();
  version = 2;
  await opened.refresh();
  assert.deepEqual(opened.getSnapshot().result.data, [1]);
  const reloaded = createResource("/api/programs", 60000, 3600000);
  await reloaded.refresh();
  assert.deepEqual(reloaded.getSnapshot().result.data, [2]);
  assert.equal(calls, 2);
});
