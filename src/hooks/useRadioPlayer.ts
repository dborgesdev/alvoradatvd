import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaStatus } from "../types/content";
export function useRadioPlayer(url: string | null) {
  const ref = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<MediaStatus>(
    url ? "idle" : "unavailable",
  );
  const [volume, updateVolume] = useState(0.65);
  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    const playing = () => setStatus("playing");
    const paused = () => setStatus("paused");
    const ended = () => setStatus("idle");
    const loading = () => setStatus("loading");
    const error = () => setStatus("error");
    const volumeChanged = () => updateVolume(audio.volume);
    const events = {
      playing,
      pause: paused,
      ended,
      waiting: loading,
      error,
      volumechange: volumeChanged,
    };
    Object.entries(events).forEach(([name, listener]) =>
      audio.addEventListener(name, listener),
    );
    audio.volume = 0.65;
    return () => {
      Object.entries(events).forEach(([name, listener]) =>
        audio.removeEventListener(name, listener),
      );
      audio.pause();
    };
  }, [url]);
  const toggle = useCallback(() => {
    const audio = ref.current;
    if (!audio || !url) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    if (audio.error) audio.load();
    setStatus("loading");
    void audio.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("error");
    });
  }, [url]);
  const setVolume = useCallback((value: number) => {
    if (ref.current) ref.current.volume = Math.max(0, Math.min(1, value));
  }, []);
  return { ref, status, toggle, volume, setVolume, available: Boolean(url) };
}
