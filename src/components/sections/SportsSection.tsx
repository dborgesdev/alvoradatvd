import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
export function SportsSection() {
  return (
    <section className="sports-section">
      <div className="container sports-grid">
        <div className="sports-photo">
          <img
            src="/assets/editorial/news-sport.webp"
            loading="lazy"
            alt="Ilustração conceitual de esporte em campo"
          />
          <span className="image-caption">Imagem conceitual</span>
        </div>
        <div className="sports-copy">
          <p className="eyebrow">ESPORTE QUE INSPIRA</p>
          <h2>
            O talento é local.
            <br />A paixão não
            <br />
            tem limites.
          </h2>
          <p>
            Valorizar atletas, equipes e projetos do esporte amador faz parte
            dos objetivos da Rede Alvorada. Um espaço para aproximar a
            comunidade das suas histórias.
          </p>
          <Link to="/noticias?categoria=Esportes" className="button ghost">
            Explore o espaço de esportes <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
