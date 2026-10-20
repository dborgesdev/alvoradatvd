import type Hls from "hls.js";
import type { ErrorData, HlsConfig } from "hls.js";
import type {
  TvConnection,
  TvConnectionEvents,
  TvFailure,
} from "../types/media";

type HlsModule = typeof import("hls.js");
const loadHls = () => import("hls.js");
const retryPolicy = {
  default: {
    maxTimeToFirstByteMs: 10000,
    maxLoadTimeMs: 20000,
    timeoutRetry: { maxNumRetry: 1, retryDelayMs: 1000, maxRetryDelayMs: 2000 },
    errorRetry: { maxNumRetry: 1, retryDelayMs: 1000, maxRetryDelayMs: 2000 },
  },
};

// O handle é síncrono: a limpeza nunca chega por uma Promise após a conexão seguinte.
export function connectHls(
  video: HTMLVideoElement,
  url: string,
  events: TvConnectionEvents,
  importHls: () => Promise<HlsModule> = loadHls,
): TvConnection {
  let disposed = false;
  let terminal = false;
  let hls: Hls | undefined;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  const used = { network: 0, media: 0 };
  const native = Boolean(video.canPlayType("application/vnd.apple.mpegurl"));
  const clearRetry = () => {
    clearTimeout(retryTimer);
    retryTimer = undefined;
  };
  const fail = (failure: TvFailure) => {
    if (disposed || terminal) return;
    terminal = true;
    clearRetry();
    hls?.stopLoad();
    events.onError(failure);
  };
  const recover = (
    kind: "network" | "media",
    action: () => void,
    failure: TvFailure,
  ) => {
    if (disposed || terminal) return;
    if (retryTimer !== undefined) return;
    if (used[kind] >= 1) {
      fail(failure);
      return;
    }
    used[kind]++;
    events.onRecovering(kind);
    retryTimer = setTimeout(() => {
      retryTimer = undefined;
      if (disposed || terminal) return;
      try {
        action();
      } catch {
        fail(failure);
      }
    }, 1500);
  };
  const attachNative = () => {
    video.src = url;
    video.load();
    events.onAttached();
  };
  const onNativeError = () => {
    if (disposed || terminal) return;
    const code = video.error?.code;
    if (code === 1) return; // Aborto de load()/troca de fonte não é indisponibilidade.
    if (code === 2 || code === 3) {
      const kind = code === 2 ? "network" : "media";
      recover(kind, attachNative, {
        kind,
        message: "Não foi possível restabelecer a transmissão.",
        detail: video.error?.message,
      });
    } else {
      fail({
        kind: "unsupported",
        message:
          "A transmissão está indisponível ou não é compatível com este navegador.",
        detail: video.error?.message,
      });
    }
  };
  const destroy = () => {
    if (disposed) return;
    disposed = true;
    clearRetry();
    video.removeEventListener("error", onNativeError);
    hls?.destroy();
    video.removeAttribute("src");
    video.querySelectorAll("source").forEach((source) => source.remove());
    video.load();
  };
  // preload="none" não deve impedir o carregamento após o usuário solicitar o sinal.
  video.preload = "auto";
  if (native) {
    video.addEventListener("error", onNativeError);
    try {
      attachNative();
    } catch {
      fail({
        kind: "network",
        message: "Não foi possível carregar a transmissão.",
      });
    }
  } else {
    void importHls()
      .then(({ default: Engine }) => {
        if (disposed) return;
        if (!Engine.isSupported()) {
          fail({
            kind: "unsupported",
            message:
              "Este navegador não oferece suporte à transmissão. Acesse o canal oficial como alternativa.",
          });
          return;
        }
        const config: Partial<HlsConfig> = {
          maxLoadingDelay: 12,
          manifestLoadPolicy: retryPolicy,
          playlistLoadPolicy: retryPolicy,
          fragLoadPolicy: retryPolicy,
        };
        hls = new Engine(config);
        hls.on(Engine.Events.MEDIA_ATTACHED, () => {
          if (disposed || terminal) return;
          hls!.loadSource(url);
          events.onAttached();
        });
        hls.on(Engine.Events.ERROR, (_event, data: ErrorData) => {
          if (disposed || terminal || !data.fatal) return;
          const httpStatus = data.response?.code;
          const failure: TvFailure = {
            kind:
              data.type === Engine.ErrorTypes.NETWORK_ERROR
                ? "network"
                : "media",
            message:
              "A transmissão não está disponível no momento. Tente novamente mais tarde.",
            detail: data.details,
            httpStatus,
          };
          if (httpStatus && [401, 403, 404, 410].includes(httpStatus)) {
            fail(failure);
            return;
          }
          if (data.type === Engine.ErrorTypes.NETWORK_ERROR) {
            recover(
              "network",
              () => {
                if (
                  data.details === Engine.ErrorDetails.MANIFEST_LOAD_ERROR ||
                  data.details === Engine.ErrorDetails.MANIFEST_LOAD_TIMEOUT
                )
                  hls!.loadSource(url);
                hls!.startLoad(-1);
              },
              failure,
            );
          } else if (data.type === Engine.ErrorTypes.MEDIA_ERROR) {
            recover("media", () => hls!.recoverMediaError(), failure);
          } else {
            fail(failure);
          }
        });
        hls.attachMedia(video);
      })
      .catch(() =>
        fail({
          kind: "unsupported",
          message:
            "Não foi possível inicializar o player. Tente carregar a transmissão novamente.",
        }),
      );
  }
  return { destroy };
}
