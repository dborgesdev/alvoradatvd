import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import "./regional-news-banner.css";
export function RegionalNewsBanner() {
  return (
    <section className="regional-news-banner">
      <img
        src="/assets/editorial/region-v2.webp"
        width="1000"
        height="667"
        loading="lazy"
        alt="Paisagem urbana conceitual ao pôr do sol; não representa local confirmado ou ocorrência jornalística"
      />
      <div className="container">
        <div className="regional-news-copy">
          <p className="eyebrow">ACONTECE NA NOSSA REGIÃO</p>
          <h2>
            A notícia acontece aqui.
            <br />
            <span>Você acompanha na Alvorada.</span>
          </h2>
          <p>
            Os acontecimentos de Campinas e região em um só lugar. Informação
            para acompanhar o que importa no seu dia a dia.
          </p>
          <Link to="/noticias" className="button orange">
            Ver todas as notícias <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
