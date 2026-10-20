import { useRef, useState } from "react";
import {
  Play,
  RefreshCw,
  CircleAlert,
  LoaderCircle,
  Tv,
  Volume2,
  VolumeX,
  Maximize,
} from "lucide-react";
import { content } from "../../lib/content";
import { useTvPlayer } from "../../hooks/useTvPlayer";
import "./tv.css";
export function TvPlayer({ autoPlay = false }: { autoPlay?: boolean }) {
  const { ref, status, failure, start } = useTvPlayer(
    content.streams.tv.hlsUrl,
    autoPlay,
  );
  const [muted, setMuted] = useState(true);
  const [fullscreenError, setFullscreenError] = useState("");
  const screenRef = useRef<HTMLDivElement>(null);
  const labels = {
    idle: "Pronto para conectar",
    loading: "Conectando à transmissão…",
    ready: "Inicie a transmissão pelo botão abaixo.",
    playing: "Reproduzindo",
    paused: "Transmissão pausada",
    error: "Não foi possível conectar à transmissão",
    unavailable: "Transmissão indisponível",
  };
  const fullscreen = () => {
    const screen = screenRef.current;
    if (!screen?.requestFullscreen) {
      setFullscreenError("Use a opção de tela cheia nos controles do vídeo.");
      return;
    }
    void screen
      .requestFullscreen()
      .catch(() =>
        setFullscreenError("Tela cheia indisponível neste navegador."),
      );
  };
  return (
    <div className="tv-player">
      <div className="tv-screen" ref={screenRef}>
        <video
          poster="/assets/editorial/hero.webp"
          ref={ref}
          controls
          muted={muted}
          autoPlay={autoPlay}
          playsInline
          preload={autoPlay ? "auto" : "none"}
          aria-label="Transmissão da Alvorada TV"
          onVolumeChange={() => {
            if (ref.current) setMuted(ref.current.muted);
          }}
        />
        {(status === "idle" || status === "ready" || status === "error") && (
          <div className="player-overlay">
            {status === "error" ? <CircleAlert size={36} /> : <Tv size={40} />}
            <h2>
              {status === "error"
                ? "O sinal não chegou por aqui."
                : "Sua janela para a Alvorada."}
            </h2>
            <p>
              {status === "error"
                ? failure?.message ||
                  "A transmissão pode estar temporariamente fora do ar."
                : "Conecte-se à programação da TV digital."}
            </p>
            <button className="button orange" onClick={start}>
              {status === "error" ? (
                <RefreshCw size={18} />
              ) : (
                <Play size={18} />
              )}{" "}
              Carregar transmissão
            </button>
          </div>
        )}
        {status === "loading" && (
          <div className="loading-indicator">
            <LoaderCircle className="spin" /> Conectando…
          </div>
        )}
      </div>
      <div className="tv-toolbar">
        <span role="status">{labels[status]}</span>
        <button
          onClick={() => setMuted((value) => !value)}
          aria-label={muted ? "Ativar som da TV" : "Silenciar TV"}
        >
          {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          <span>{muted ? "Ativar som" : "Silenciar"}</span>
        </button>
        <button onClick={fullscreen} aria-label="TV em tela cheia">
          <Maximize size={17} />
        </button>
      </div>
      {fullscreenError && (
        <p role="status" className="section-note">
          {fullscreenError}
        </p>
      )}
    </div>
  );
}
