import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const source = ts.transpileModule(readFileSync("src/lib/media.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText;
const { connectHls } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);

class Video extends EventTarget {
  src = "";
  preload = "none";
  loads = 0;
  native = true;
  error = null;
  canPlayType() {
    return this.native ? "maybe" : "";
  }
  load() {
    this.loads++;
  }
  removeAttribute() {
    this.src = "";
  }
  querySelectorAll() {
    return [];
  }
}
function recorder() {
  const errors = [];
  const recovering = [];
  let attached = 0;
  return {
    errors,
    recovering,
    get attached() {
      return attached;
    },
    events: {
      onAttached: () => attached++,
      onRecovering: (kind) => recovering.push(kind),
      onError: (error) => errors.push(error),
    },
  };
}
function engineFactory() {
  const instances = [];
  class Engine {
    static Events = { MEDIA_ATTACHED: "attached", ERROR: "error" };
    static ErrorTypes = {
      NETWORK_ERROR: "networkError",
      MEDIA_ERROR: "mediaError",
    };
    static ErrorDetails = {
      MANIFEST_LOAD_ERROR: "manifestLoadError",
      MANIFEST_LOAD_TIMEOUT: "manifestLoadTimeOut",
    };
    static isSupported() {
      return true;
    }
    handlers = {};
    starts = 0;
    mediaRecoveries = 0;
    destroyed = 0;
    stops = 0;
    urls = [];
    constructor(config) {
      this.config = config;
      instances.push(this);
    }
    on(name, handler) {
      this.handlers[name] = handler;
    }
    emit(name, data) {
      this.handlers[name]?.(name, data);
    }
    attachMedia() {
      this.emit("attached");
    }
    loadSource(url) {
      this.urls.push(url);
    }
    startLoad() {
      this.starts++;
    }
    recoverMediaError() {
      this.mediaRecoveries++;
    }
    stopLoad() {
      this.stops++;
    }
    destroy() {
      this.destroyed++;
    }
  }
  return { instances, importer: async () => ({ default: Engine }) };
}
const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

test("Limpeza nativa é síncrona/idempotente e não remove uma conexão posterior (StrictMode)", async () => {
  const video = new Video();
  const log = recorder();
  const first = connectHls(video, "https://stream.test/first.m3u8", log.events);
  first.destroy();
  const second = connectHls(
    video,
    "https://stream.test/second.m3u8",
    log.events,
  );
  await flush();
  first.destroy();
  assert.equal(video.src, "https://stream.test/second.m3u8");
  assert.equal(video.preload, "auto");
  assert.equal(video.loads, 3);
  assert.equal(log.attached, 2);
  second.destroy();
});
test("Importação HLS cancelada não cria engine nem remove a nova fonte", async () => {
  const video = new Video();
  video.native = false;
  const log = recorder();
  const factory = engineFactory();
  let resolve;
  const old = connectHls(
    video,
    "old",
    log.events,
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  old.destroy();
  video.native = true;
  const current = connectHls(video, "new", log.events);
  resolve(await factory.importer());
  await flush();
  assert.equal(factory.instances.length, 0);
  assert.equal(video.src, "new");
  current.destroy();
});
test("Rede e mídia têm uma recuperação cada, reutilizando uma única instância HLS", async (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const video = new Video();
  video.native = false;
  const log = recorder();
  const factory = engineFactory();
  const connection = connectHls(video, "source", log.events, factory.importer);
  await flush();
  const hls = factory.instances[0];
  hls.emit("error", {
    type: "networkError",
    details: "fragLoadError",
    fatal: false,
  });
  assert.equal(log.errors.length, 0);
  assert.equal(log.recovering.length, 0);
  hls.emit("error", {
    type: "networkError",
    details: "fragLoadError",
    fatal: true,
    response: { code: 503 },
  });
  context.mock.timers.tick(1500);
  assert.equal(hls.starts, 1);
  hls.emit("error", {
    type: "mediaError",
    details: "bufferAppendError",
    fatal: true,
  });
  context.mock.timers.tick(1500);
  assert.equal(hls.mediaRecoveries, 1);
  hls.emit("error", {
    type: "networkError",
    details: "fragLoadError",
    fatal: true,
    response: { code: 503 },
  });
  context.mock.timers.tick(30000);
  assert.equal(hls.starts, 1);
  assert.equal(log.errors.length, 1);
  assert.equal(factory.instances.length, 1);
  assert.equal(hls.config.fragLoadPolicy.default.errorRetry.maxNumRetry, 1);
  connection.destroy();
  connection.destroy();
  assert.equal(hls.destroyed, 1);
});
test("Playlist ausente/expirada termina sem recarregamento automático", async (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  for (const code of [401, 403, 404, 410]) {
    const video = new Video();
    video.native = false;
    const log = recorder();
    const factory = engineFactory();
    const connection = connectHls(
      video,
      "source",
      log.events,
      factory.importer,
    );
    await flush();
    const hls = factory.instances[0];
    hls.emit("error", {
      type: "networkError",
      details: "manifestLoadError",
      fatal: true,
      response: { code },
    });
    context.mock.timers.tick(30000);
    assert.equal(hls.starts, 0);
    assert.equal(log.errors[0].httpStatus, code);
    connection.destroy();
  }
});
test("Retry nativo é limitado e cancelado ao desmontar", (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const video = new Video();
  const log = recorder();
  const connection = connectHls(video, "source", log.events);
  video.error = { code: 2 };
  video.dispatchEvent(new Event("error"));
  context.mock.timers.tick(1500);
  assert.equal(log.attached, 2);
  video.dispatchEvent(new Event("error"));
  context.mock.timers.tick(30000);
  assert.equal(log.errors.length, 1);
  assert.equal(log.attached, 2);
  connection.destroy();
  const nextLog = recorder();
  video.error = null;
  const next = connectHls(video, "new", nextLog.events);
  video.error = { code: 2 };
  video.dispatchEvent(new Event("error"));
  next.destroy();
  context.mock.timers.tick(30000);
  assert.equal(nextLog.attached, 1);
});
