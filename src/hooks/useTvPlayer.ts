import { useCallback, useEffect, useRef, useState } from "react";
import { connectHls } from "../lib/media";
import type { MediaStatus } from "../types/content";
import type { TvConnection, TvFailure } from "../types/media";

export function useTvPlayer(url: string, autoPlay = false) {
  const ref = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<MediaStatus>(
    autoPlay ? "loading" : "idle",
  );
  const [failure, setFailure] = useState<TvFailure | null>(null);
  const [request, setRequest] = useState({ active: autoPlay, id: 0 });
  const manualPlay = useRef<(() => void) | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !request.active) return;
    let disposed = false;
    let failed = false;
    let recovering = false;
    let wanted = true;
    let pendingPlay = false;
    let playToken = 0;
    let currentStatus: MediaStatus = "loading";
    let watchdog: ReturnType<typeof setTimeout> | undefined;
    // onError pode ocorrer antes de connectHls retornar na inicialização nativa.
    let connection: TvConnection | undefined = undefined;
    const update = (next: MediaStatus) => {
      if (disposed || failed) return;
      currentStatus = next;
      setStatus(next);
    };
    const fail = (error: TvFailure) => {
      if (disposed || failed) return;
      failed = true;
      clearTimeout(watchdog);
      watchdog = undefined;
      setFailure(error);
      setStatus("error");
      manualPlay.current = null;
      connection?.destroy();
    };
    const armWatchdog = () => {
      if (watchdog !== undefined) return;
      watchdog = setTimeout(
        () =>
          fail({
            kind: "timeout",
            message:
              "O sinal demorou a responder. Você pode tentar carregar a transmissão novamente.",
          }),
        45000,
      );
    };
    const play = () => {
      if (disposed || failed || pendingPlay) return;
      wanted = true;
      pendingPlay = true;
      const token = ++playToken;
      update("loading");
      armWatchdog();
      void video
        .play()
        .catch((error: unknown) => {
          if (disposed || failed || token !== playToken) return;
          const name = error instanceof Error ? error.name : "";
          if (name === "NotAllowedError" || name === "AbortError") {
            if (recovering || currentStatus === "paused") return;
            wanted = false;
            clearTimeout(watchdog);
            watchdog = undefined;
            update("ready");
          } else if (!recovering) {
            fail({
              kind: "media",
              message:
                "Não foi possível iniciar o vídeo. Tente carregar a transmissão novamente.",
            });
          }
        })
        .finally(() => {
          if (token === playToken) pendingPlay = false;
        });
    };
    const onPlaying = () => {
      recovering = false;
      clearTimeout(watchdog);
      watchdog = undefined;
      update("playing");
    };
    const onPause = () => {
      if (recovering || (currentStatus === "loading" && video.readyState < 2))
        return;
      wanted = false;
      clearTimeout(watchdog);
      watchdog = undefined;
      update("paused");
    };
    const onWaiting = () => {
      if (wanted && !video.paused) {
        update("loading");
        armWatchdog();
      }
    };
    const onCanPlay = () => {
      if (wanted && video.paused) play();
    };
    const onEnded = () =>
      fail({
        kind: "network",
        message:
          "A transmissão foi encerrada. Tente novamente para verificar o sinal.",
      });
    const listeners = {
      playing: onPlaying,
      pause: onPause,
      waiting: onWaiting,
      canplay: onCanPlay,
      ended: onEnded,
    };
    Object.entries(listeners).forEach(([event, handler]) =>
      video.addEventListener(event, handler),
    );
    video.playsInline = true;
    if (autoPlay) video.muted = true;
    armWatchdog();
    connection = connectHls(video, url, {
      onAttached: () => {
        recovering = false;
        if (wanted) play();
      },
      onRecovering: () => {
        recovering = true;
        playToken++;
        pendingPlay = false;
        update("loading");
        armWatchdog();
      },
      onError: fail,
    });
    if (failed) connection.destroy();
    manualPlay.current = failed
      ? null
      : () => {
          setFailure(null);
          play();
        };
    return () => {
      disposed = true;
      playToken++;
      clearTimeout(watchdog);
      watchdog = undefined;
      manualPlay.current = null;
      Object.entries(listeners).forEach(([event, handler]) =>
        video.removeEventListener(event, handler),
      );
      connection?.destroy();
    };
  }, [url, request, autoPlay]);

  const start = useCallback(() => {
    if (manualPlay.current) {
      manualPlay.current();
      return;
    }
    setFailure(null);
    setStatus("loading");
    setRequest((previous) => ({ active: true, id: previous.id + 1 }));
  }, []);
  return { ref, status, failure, start };
}
