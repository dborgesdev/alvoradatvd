import { test } from "node:test";
import assert from "node:assert/strict";
import { adaptPrograms, adaptTeam, adaptAlbums, adaptSlots, wpText, safePublicUrl, eventDate } from "../src/lib/content/wordpress.ts";
import { buildSchedule } from "../src/lib/content/collections.ts";
import { fetchWpCollection } from "../worker/wordpress.ts";
import { EditorialCache } from "../worker/index.ts";
import { policies } from "../worker/sources.ts";

const member = { id: 30, slug: "autodj", status: "publish", title: { rendered: "Auto DJ" }, acf: { cargo: "DJ", exibir_site: true } };
const program = { id: 32, slug: "24h-de-musica", status: "publish", title: { rendered: "24h de Música" }, content: { rendered: "<p>Primeiro parágrafo.</p><p>Outro parágrafo.</p>" }, acf: { subtitulo: "Música", apresentadores: [30], url_video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", url_playlist: "https://www.youtube.com/playlist?list=PL1234567890" }, "categorias-programa": [2], grade_horarios: [{ dias: [1, 2, 3, 4, 5, 6, 7], inicio: "00:00", fim: "23:59", tipo: "ao_vivo", observacao: "" }] };
const terms = [{ id: 2, name: "Música" }];
const album = { id: 27, slug: "album", status: "publish", title: { rendered: "Álbum" }, acf: { data_evento: "2026-10-30", local_evento: "Brasil" }, fotografias_resolvidas: [{ id: 37, url: "https://painel.alvoradatvd.com/photo37.webp", width: 1080, height: 608, alt: "Foto 1" }, { id: 36, url: "https://painel.alvoradatvd.com/photo36.webp", width: 1000, height: 667, alt: "Foto 2" }] };
const response = (data, total = data.length, pages = 1) => Response.json(data, { headers: { "X-WP-Total": String(total), "X-WP-TotalPages": String(pages) } });

test("WordPress: programa resolve apresentadores, categoria, vídeo, playlist e sete dias", () => {
  const [result] = adaptPrograms([program], terms, adaptTeam([member]));
  assert.equal(result.title, "24h de Música");
  assert.deepEqual(result.presenters, [{ id: "30", name: "Auto DJ" }]);
  assert.equal(result.category, "Música");
  assert.equal(result.youtubeVideoId, "dQw4w9WgXcQ");
  assert.equal(result.youtubePlaylistId, "PL1234567890");
  assert.ok(result.description.includes("\n"));
  assert.equal(buildSchedule([result]).length, 7);
  assert.deepEqual(buildSchedule([result]).map(row => row.dayOfWeek), [0, 1, 2, 3, 4, 5, 6]);
});
test("WordPress: exibir_site exige true booleano e ocultos não vazam pela apresentação", () => {
  for (const flag of [false, "true", 1, "1", null, undefined]) {
    const team = adaptTeam([{ ...member, acf: { exibir_site: flag } }]);
    assert.deepEqual(team, []);
    assert.deepEqual(adaptPrograms([program], terms, team)[0].presenters, []);
  }
  assert.equal(adaptTeam([member]).length, 1);
  assert.deepEqual(adaptTeam([{ ...member, status: "draft" }]), []);
});
test("WordPress: capa independente da lista ordenada de fotografias; dimensões, alt, data e local", () => {
  const [result] = adaptAlbums([album], []);
  assert.equal(result.cover, "");
  assert.deepEqual(result.photos.map(photo => photo.id), ["37", "36"]);
  assert.equal(result.photos[0].width, 1080);
  assert.equal(result.photos[0].alt, "Foto 1");
  assert.equal(result.date, "2026-10-30");
  assert.equal(result.location, "Brasil");
  assert.equal(eventDate("20261030"), "2026-10-30");
  assert.equal(eventDate("2026-02-30"), null);
  assert.deepEqual(adaptAlbums([{ ...album, fotografias_resolvidas: [] }], [])[0].photos, []);
});
test("WordPress: imagem embutida usa tamanho adequado e srcset sem recorte quadrado", () => {
  const imagePost = { ...program, featured_media: 50, _embedded: { "wp:featuredmedia": [{ id: 50, source_url: "https://cdn.example/full.jpg", alt_text: "Descrição", media_details: { width: 1200, height: 800, sizes: { thumbnail: { source_url: "https://cdn.example/150.jpg", width: 150, height: 150 }, medium: { source_url: "https://cdn.example/300.jpg", width: 300, height: 200 }, medium_large: { source_url: "https://cdn.example/768.jpg", width: 768, height: 512 } } } }] } };
  const image = adaptPrograms([imagePost], [], [])[0].image;
  assert.equal(image.src, "https://cdn.example/768.jpg");
  assert.equal(image.width, 768);
  assert.equal(image.alt, "Descrição");
  assert.ok(image.srcSet.includes("300w"));
  assert.ok(!image.srcSet.includes("150w"));
});
test("WordPress: segurança de texto, URLs, conteúdo protegido e campos opcionais", () => {
  assert.equal(wpText('<script>alert(1)</script><p>A &amp; B &#8217;</p>'), "A & B ’");
  for (const url of ["javascript:alert(1)", "data:image/svg+xml,test", "http://example.test", "https://user:secret@example.test", "https://127.0.0.1/a", "https://localhost/a"]) assert.equal(safePublicUrl(url), null);
  assert.equal(safePublicUrl("https://instagram.com.evil.test", ["instagram.com"]), null);
  assert.deepEqual(adaptPrograms([{ ...program, content: { protected: true } }], [], []), []);
  const optional = adaptPrograms([{ ...program, acf: [], grade_horarios: null }], [], [])[0];
  assert.equal(optional.videoUrl, null);
  assert.equal(optional.subtitle, "");
  assert.deepEqual(optional.slots, []);
});
test("WordPress: faixas inválidas não criam horários fictícios", () => {
  for (const slot of [{ dias: [1], inicio: "24:00", fim: "25:00", tipo: "ao_vivo" }, { dias: [], inicio: "08:00", fim: "09:00", tipo: "reprise" }, { dias: [1], inicio: "08:00", fim: "08:00", tipo: "ao_vivo" }]) assert.deepEqual(adaptSlots([slot]), []);
});
test("Grade: múltiplas faixas, ordenação, madrugada de domingo para segunda e fim 00:00", () => {
  const [adapted] = adaptPrograms([program], [], []);
  adapted.slots = [{ days: [7], startsAt: "23:00", endsAt: "01:00", type: "reprise", note: "Noturna" }, { days: [1], startsAt: "08:00", endsAt: "09:00", type: "gravado", note: "" }];
  const schedule = buildSchedule([adapted]);
  assert.deepEqual(schedule.map(row => [row.dayOfWeek, row.startsAt, row.endsAt]), [[0, "00:00", "01:00"], [0, "08:00", "09:00"], [6, "23:00", "24:00"]]);
  assert.equal(schedule[0].continuation, true);
  assert.equal(schedule[2].continuesNextDay, true);
  assert.equal(schedule[0].note, "Noturna");
  adapted.slots[0].endsAt = "00:00";
  assert.equal(buildSchedule([adapted]).length, 2);
});
test("WordPress pagina toda coleção, nunca consulta mídia individual nem segue URLs do visitante", async () => {
  const original = globalThis.fetch; const urls = [];
  try {
    globalThis.fetch = async url => { urls.push(new URL(url)); return new URL(url).searchParams.get("page") === "1" ? response([{ id: 1 }], 2, 2) : response([{ id: 2 }], 2, 2); };
    assert.deepEqual(await fetchWpCollection("programas"), [{ id: 1 }, { id: 2 }]);
    assert.equal(urls.length, 2);
    assert.ok(urls.every(url => url.origin === "https://painel.alvoradatvd.com" && url.pathname.endsWith("/programas") && url.searchParams.get("per_page") === "100" && url.searchParams.get("_embed") === "wp:featuredmedia"));
    globalThis.fetch = async () => response([{ id: 1 }], 2, 2);
    await assert.rejects(() => fetchWpCollection("programas"), /incompleta/);
    globalThis.fetch = async () => Response.json([]);
    await assert.rejects(() => fetchWpCollection("programas"), /Paginação/);
    globalThis.fetch = async () => response([], 0, 0);
    assert.deepEqual(await fetchWpCollection("programas"), []);
  } finally { globalThis.fetch = original; }
});
test("Durable Object: programas compartilham equipe, cache quente evita WordPress, JSON vazio e falhas distintos", async () => {
  const original = globalThis.fetch; const urls = []; const stored = new Map();
  try {
    globalThis.fetch = async url => {
      const path = new URL(url).pathname.split("/").pop(); urls.push(path);
      return response(path === "programas" ? [program] : path === "equipe" ? [member] : path === "categorias-programa" ? terms : []);
    };
    const cache = new EditorialCache({ storage: { get: async key => stored.get(key), put: async (key, value) => { stored.set(key, structuredClone(value)); } } });
    const first = await (await cache.fetch(new Request("https://internal/api/programs"))).json();
    const second = await (await cache.fetch(new Request("https://internal/api/programs"))).json();
    assert.equal(first.data[0].presenters[0].name, "Auto DJ");
    assert.deepEqual(first, second);
    await cache.fetch(new Request("https://internal/api/team"));
    assert.equal(urls.filter(path => path === "equipe").length, 1);
    assert.equal(urls.filter(path => path === "programas").length, 1);
    const empty = await cache.fetch(new Request("https://internal/api/albums"));
    assert.equal(empty.status, 200);
    assert.deepEqual((await empty.json()).data, []);
    globalThis.fetch = async () => { throw new Error("offline"); };
    const cold = new EditorialCache({ storage: { get: async () => undefined, put: async () => {} } });
    const failed = await cold.fetch(new Request("https://internal/api/albums"));
    assert.equal(failed.status, 503);
    assert.equal((await failed.json()).data, null);
    assert.equal(policies.wordpress.ttl, 300);
  } finally { globalThis.fetch = original; }
});
