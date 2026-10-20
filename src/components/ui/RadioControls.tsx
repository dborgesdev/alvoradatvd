import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  LoaderCircle,
  Radio,
} from "lucide-react";
import { useId } from "react";
import { useRadio } from "../../hooks/useRadio";
import { Waveform } from "./Waveform";
import "./radio.css";
export function RadioControls({ compact = false }: { compact?: boolean }) {
  const { status, toggle, volume, setVolume, available, isDemo } = useRadio();
  const id = useId();
  const playing = status === "playing" || status === "loading";
  const labels = {
    idle: "Pronto para ouvir",
    loading: "Carregando áudio…",
    ready: "Pronto para ouvir",
    playing: "Reproduzindo",
    paused: "Pausado",
    error: "Não foi possível reproduzir. Tente novamente.",
    unavailable: "Aguardando sinal",
  };
  return (
    <div className={`radio-controls ${compact ? "compact" : ""}`}>
      <div className="radio-identity">
        <img
          src="/assets/brand/logo-3d-small.webp"
          alt=""
          width="128"
          height="128"
        />
        <div>
          <strong>Rádio Alvorada</strong>
          <span className="radio-mode">
            {isDemo ? "DEMONSTRAÇÃO · ÁUDIO LOCAL" : "TRANSMISSÃO OFICIAL"}
          </span>
        </div>
      </div>
      <button
        className="radio-play"
        disabled={!available}
        onClick={toggle}
        aria-label={playing ? "Pausar rádio" : "Reproduzir rádio"}
      >
        {status === "loading" ? (
          <LoaderCircle className="spin" />
        ) : playing ? (
          <Pause fill="currentColor" />
        ) : (
          <Play fill="currentColor" />
        )}
      </button>
      <Waveform />
      <div className="radio-state">
        <Radio size={15} />
        <span role="status">{labels[status]}</span>
        {isDemo && <small>Exemplo de áudio · não é programação ao vivo</small>}
      </div>
      <label className="radio-volume" htmlFor={id}>
        {volume === 0 ? <VolumeX size={19} /> : <Volume2 size={19} />}
        <span className="sr-only">Volume da rádio</span>
        <input
          id={id}
          aria-valuetext={`${Math.round(volume * 100)}%`}
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
        />
        <output htmlFor={id}>{Math.round(volume * 100)}%</output>
      </label>
    </div>
  );
}
