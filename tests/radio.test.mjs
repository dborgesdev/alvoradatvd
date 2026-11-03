import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRadioPlayer } from "../src/lib/radio-player.ts";

class AudioDouble extends EventTarget {
  volume = 0.65; paused = true; error = null; loads = 0; plays = 0;
  play() { this.plays++; this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; this.dispatchEvent(new Event("pause")); }
  load() { this.loads++; this.error = null; }
  emit(name) { this.dispatchEvent(new Event(name)); }
}
test("Rádio: sem autoplay, conexão só é playing após evento real; pause e volume", () => {
  const audio = new AudioDouble(); const states = []; const volumes = [];
  const player = createRadioPlayer(audio, state => states.push(state), volume => volumes.push(volume));
  assert.equal(audio.plays, 0);
  player.toggle(); assert.equal(states.at(-1), "loading");
  assert.ok(!states.includes("playing"));
  audio.emit("playing"); assert.equal(states.at(-1), "playing");
  player.setVolume(0); audio.emit("volumechange"); assert.equal(volumes.at(-1), 0);
  player.setVolume(2); assert.equal(audio.volume, 1);
  player.toggle(); assert.equal(states.at(-1), "paused");
  player.dispose();
});
test("Rádio: falha permanece visível e retry recarrega sem reproduzir arquivo alternativo", () => {
  const audio = new AudioDouble(); const states = [];
  const player = createRadioPlayer(audio, state => states.push(state), () => {});
  player.toggle(); audio.error = { code: 2 }; audio.emit("error");
  assert.equal(states.at(-1), "error"); assert.equal(audio.paused, true);
  player.toggle(); assert.equal(audio.loads, 1); assert.equal(audio.plays, 2);
  assert.equal(states.at(-1), "loading");
  audio.emit("playing"); assert.equal(states.at(-1), "playing");
  player.dispose();
});
test("Rádio: timeout cancela conexão e pausa durante carregamento cancela timeout", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const audio = new AudioDouble(); const states = [];
  const player = createRadioPlayer(audio, state => states.push(state), () => {});
  player.toggle(); t.mock.timers.tick(20000);
  assert.equal(states.at(-1), "error");
  player.toggle(); player.toggle(); t.mock.timers.tick(20000);
  assert.equal(states.at(-1), "paused");
  player.dispose(); t.mock.timers.reset();
});
test("Rádio: play rejeitado não deixa loading infinito; dispose ignora eventos atrasados", async () => {
  const audio = new AudioDouble(); const states = [];
  audio.play = () => Promise.reject(new DOMException("blocked", "NotAllowedError"));
  const player = createRadioPlayer(audio, state => states.push(state), () => {});
  player.toggle(); await Promise.resolve(); assert.equal(states.at(-1), "error");
  player.dispose(); const count = states.length;
  audio.emit("playing"); audio.emit("error");
  assert.equal(states.length, count);
});
test("Privacidade: conteúdo e metadados sem rótulos de minuta; pendências continuam explícitas", () => {
  const files = ["src/data/content/privacy.ts", "src/pages/PrivacyPage.tsx", "src/components/sections/PrivacySection.tsx"];
  files.forEach(file => assert.doesNotMatch(readFileSync(file, "utf8"), /minuta|rascunho|provisóri|demonstrativ/i));
  assert.match(readFileSync(files[0], "utf8"), /identificação jurídica do controlador/);
  assert.match(readFileSync(files[0], "utf8"), /data de vigência ainda não foi definida/);
});
