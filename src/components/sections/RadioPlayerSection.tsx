import { RadioControls } from "../ui/RadioControls";
import { useRadio } from "../../hooks/useRadio";
import { Waveform } from "../ui/Waveform";
export function RadioPlayerSection() {
  const { isDemo } = useRadio();
  return (
    <section className="section container">
      <div className="radio-player">
        <div className="radio-art">
          <img
            src="/assets/brand/logo-3d-hero.webp"
            alt="Marca 3D original da Rede Alvorada"
            width="640"
            height="640"
          />
          <Waveform />
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
