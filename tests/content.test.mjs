import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import ts from "typescript";
const load = async (path) => {
  const source = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext },
  }).outputText;
  return import(
    `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
  );
};
test("Editorial demonstrativo não anuncia datas ou imagens ausentes", async () => {
  const { news } = await load("src/data/content/news.ts");
  for (const article of news) {
    assert.equal(article.isDemo, true);
    assert.equal(article.publishedAt, "");
    assert.ok(existsSync(`public${article.image}`));
    assert.ok(article.body.length);
  }
});
test("Rádio fica sem URL e YouTube não contém IDs inventados", async () => {
  const { streams } = await load("src/data/content/streams.ts");
  const { programs } = await load("src/data/content/programs.ts");
  assert.equal(streams.radio.url, null);
  assert.ok(existsSync(`public${streams.radio.demoUrl}`));
  assert.ok(streams.tv.hlsUrl.startsWith("https://"));
  programs.forEach((program) => assert.equal(program.youtubeVideoId, null));
});

test("Institucional e história preservam integralmente cada seção da fonte", async () => {
  const { institutionalSections, radioHistorySections } = await load(
    "src/data/content/institutional.ts",
  );
  const titles = [
    "História do Rádio",
    "Rádio no Brasil",
    "Proposta",
    "Resumo da Proposta",
    "Resultado da Proposta",
    "Objetivos",
    "Objetivos específicos",
    "Sobre",
    "Quem Somos",
    "Missão",
    "Visão",
    "Valores",
    "Filosofia de trabalho:",
    "Estrutura",
    "Para ouvir",
    "Comercial",
    "Resumo",
  ];
  const lines = readFileSync("docs/institucional-fonte.txt", "utf8").split(
    /\r?\n/,
  );
  const all = [...institutionalSections, ...radioHistorySections];
  assert.equal(all.length, 17);
  for (let i = 0; i < titles.length; i++) {
    const start = lines.findIndex((line) => line.trim() === titles[i]);
    const end =
      i + 1 < titles.length
        ? lines.findIndex(
            (line, index) => index > start && line.trim() === titles[i + 1],
          )
        : lines.length;
    const original = lines
      .slice(start + 1, end)
      .map((line) => line.replace(/\f/g, "").trim())
      .filter(
        (line) =>
          line &&
          !/- Página \d+ de \d+ -/.test(line) &&
          !/^Rua Zacarias/.test(line) &&
          !/^(\\?:)/.test(line),
      )
      .join(" ");
    const section = all.find((section) => section.title === titles[i]);
    assert.ok(section, titles[i]);
    assert.equal(
      section.paragraphs.join(" "),
      original,
      `Texto integral: ${titles[i]}`,
    );
  }
  assert.deepEqual(
    institutionalSections.map((section) => section.title),
    [
      "Quem Somos",
      "Sobre",
      "Proposta",
      "Resumo da Proposta",
      "Resultado da Proposta",
      "Objetivos",
      "Objetivos específicos",
      "Missão",
      "Visão",
      "Valores",
      "Filosofia de trabalho:",
      "Estrutura",
      "Para ouvir",
      "Comercial",
      "Resumo",
    ],
  );
  assert.deepEqual(
    radioHistorySections.map((section) => section.paragraphs.length),
    [9, 5],
  );
  assert.equal(institutionalSections[0].paragraphs.length, 4);
  assert.equal(
    institutionalSections.find((section) => section.title === "Resumo")
      .paragraphs.length,
    4,
  );
});
test("Pessoas e promoções não são inventadas", async () => {
  assert.deepEqual((await load("src/data/content/team.ts")).team, []);
  assert.deepEqual(
    (await load("src/data/content/promotions.ts")).promotions,
    [],
  );
});
