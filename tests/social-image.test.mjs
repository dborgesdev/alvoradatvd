import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("Metadados sociais declaram as dimensões reais do WebP fornecido", () => {
  const settings=JSON.parse(readFileSync("src/data/content/social-image.json","utf8"));
  const bytes=readFileSync(`public${settings.path}`);
  assert.equal(bytes.toString("ascii",0,4),"RIFF");
  assert.equal(bytes.toString("ascii",8,12),"WEBP");
  const format=bytes.toString("ascii",12,16);
  let width,height;
  if(format === "VP8 ") { width=bytes.readUInt16LE(26)&16383; height=bytes.readUInt16LE(28)&16383; }
  else if(format === "VP8X") { width=1+bytes.readUIntLE(24,3); height=1+bytes.readUIntLE(27,3); }
  else if(format === "VP8L") { const bits=bytes.readUInt32LE(21); width=(bits&16383)+1; height=((bits>>>14)&16383)+1; }
  else assert.fail(`Formato WebP não reconhecido: ${format}`);
  assert.equal(settings.width,width);assert.equal(settings.height,height);
  assert.equal(settings.mimeType,"image/webp");
  assert.equal(new URL(settings.path,settings.previewOrigin).href,"https://alvoradatvd.smartlocal.workers.dev/og-image.webp");
});
