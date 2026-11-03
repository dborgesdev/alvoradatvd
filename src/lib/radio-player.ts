import type { MediaStatus } from "../types/content.ts";

export function createRadioPlayer(
  audio: HTMLAudioElement,
  onStatus: (status: MediaStatus) => void,
  onVolume: (volume: number) => void,
) {
  let requested = false;
  let failed = false;
  let disposed = false;
  let attempt = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const clearTimer = () => { clearTimeout(timer); timer = undefined; };
  const fail = () => {
    if (disposed) return;
    failed = true;
    requested = false;
    attempt++;
    clearTimer();
    audio.pause();
    onStatus("error");
  };
  const loading = () => {
    if (!requested || failed) return;
    onStatus("loading");
    if (!timer) timer = setTimeout(fail, 20000);
  };
  const events = {
    playing: () => { if (requested && !failed) { clearTimer(); onStatus("playing"); } },
    pause: () => { clearTimer(); if (!failed && !disposed) { requested = false; onStatus("paused"); } },
    ended: () => { clearTimer(); requested = false; if (!failed) onStatus("idle"); },
    waiting: loading,
    stalled: loading,
    error: fail,
    volumechange: () => onVolume(audio.volume),
  };
  Object.entries(events).forEach(([name, listener]) => audio.addEventListener(name, listener));
  audio.volume = 0.65;
  return {
    toggle() {
      if (disposed) return;
      if (requested) {
        requested = false;
        attempt++;
        clearTimer();
        audio.pause();
        onStatus("paused");
        return;
      }
      // Retry reloads only the same official source. Route changes never call this.
      if (failed || audio.error) audio.load();
      failed = false;
      requested = true;
      const current = ++attempt;
      loading();
      void audio.play().catch(() => {
        if (!disposed && requested && current === attempt) fail();
      });
    },
    setVolume(value: number) {
      if (Number.isFinite(value)) audio.volume = Math.max(0, Math.min(1, value));
    },
    dispose() {
      disposed = true;
      requested = false;
      attempt++;
      clearTimer();
      Object.entries(events).forEach(([name, listener]) => audio.removeEventListener(name, listener));
      audio.pause();
    },
  };
}
