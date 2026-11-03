import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaStatus } from "../types/content";
import { createRadioPlayer } from "../lib/radio-player";
export function useRadioPlayer(url: string | null) {
  const ref = useRef<HTMLAudioElement>(null);
  const controller = useRef<ReturnType<typeof createRadioPlayer> | null>(null);
  const [status, setStatus] = useState<MediaStatus>(
    url ? "idle" : "unavailable",
  );
  const [volume, updateVolume] = useState(0.65);
  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    controller.current = createRadioPlayer(audio, setStatus, updateVolume);
    return () => {
      controller.current?.dispose();
      controller.current = null;
    };
  }, [url]);
  const toggle = useCallback(() => {
    if (url) controller.current?.toggle();
  }, [url]);
  const setVolume = useCallback((value: number) => {
    controller.current?.setVolume(value);
  }, []);
  return { ref, status, toggle, volume, setVolume, available: Boolean(url) };
}
