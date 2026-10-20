import { Link } from "react-router-dom";
import { Play, ArrowUpRight, Radio } from "lucide-react";
import { TvPlayer } from "../ui/TvPlayer";
export function HeroSection() {
  return (
    <section className="hero hero-with-tv">
      <img
        className="hero-image"
        src="/assets/editorial/studio-conceitual.webp"
        alt="Conceito visual de produção audiovisual em estúdio"
        fetchPriority="high"
      />
      <div className="hero-shade" />
      <div className="container hero-content">
        <div className="hero-copy">
          <div className="hero-topline">
            <span className="signal-dot" /> UMA NOVA FORMA DE SE CONECTAR
          </div>
          <h1>
            Informação que
            <br />
            conecta.
            <br />
            <em>Alvorada.</em>
          </h1>
          <p>
            O seu encontro com a informação, o esporte
            <br className="desktop-break" /> e o entretenimento. Em todas as
            telas.
          </p>
          <div className="hero-actions">
            <Link className="button orange" to="/tv">
              <Play size={18} fill="currentColor" /> Assistir à TV{" "}
              <ArrowUpRight size={18} />
            </Link>
            <Link className="button ghost" to="/radio">
              <Radio size={19} /> Ouvir a rádio
            </Link>
          </div>
          <span className="hero-note">
            Imagem conceitual · não representa as instalações da emissora
          </span>
        </div>
        <div className="hero-tv">
          <div className="hero-tv-heading">
            <span className="signal-dot" /> ALVORADA TV{" "}
            <span>TRANSMISSÃO DIGITAL</span>
          </div>
          <TvPlayer autoPlay />
          <p className="hero-tv-note">
            O vídeo inicia sem som, quando permitido pelo navegador.
          </p>
        </div>
      </div>
      <div className="hero-side">
        <span>RÁDIO + TV + DIGITAL</span>
        <span>INFORMAÇÃO SEM FRONTEIRAS</span>
      </div>
    </section>
  );
}
