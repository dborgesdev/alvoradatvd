import type { ReactNode } from "react";
import { content } from "../../lib/content";
import { RadioContext } from "../../lib/radio-context";
import { useRadioPlayer } from "../../hooks/useRadioPlayer";
export function RadioProvider({ children }: { children: ReactNode }) {
  const config = content.streams.radio;
  const url = config.url || config.demoUrl;
  const { ref, ...player } = useRadioPlayer(url);
  return (
    <RadioContext.Provider value={{ ...player, isDemo: !config.url }}>
      <audio
        ref={ref}
        src={url || undefined}
        preload="none"
        aria-label="Áudio da Rádio Alvorada"
      />
      {children}
    </RadioContext.Provider>
  );
}
