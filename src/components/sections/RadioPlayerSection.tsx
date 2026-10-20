import { Radio } from "lucide-react";
import { RadioControls } from "../ui/RadioControls";
import { useRadio } from "../../hooks/useRadio";
export function RadioPlayerSection() {
  const { isDemo } = useRadio();
  return (
    <section className="section container">
      <div className="radio-player">
        <div className="radio-art">
          <Radio size={75} />
          <div className="waveform" aria-hidden="true">
            {Array.from({ length: 25 }, (_, i) => (
              <i key={i} style={{ height: `${15 + ((i * 17) % 64)}px` }} />
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">RÁDIO ALVORADA</p>
          <h2>
            A companhia
            <br />
            que conecta.
          </h2>
          <p>
            {isDemo
              ? "Experimente o player com um áudio local de demonstração. Este áudio não é a programação ao vivo da emissora."
              : "Acompanhe a transmissão oficial da Rádio Alvorada."}
          </p>
        </div>
      </div>
      <div className="radio-page-controls">
        <RadioControls />
      </div>
    </section>
  );
}
