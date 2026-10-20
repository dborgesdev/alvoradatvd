import { content } from "../../lib/content";
import { SectionHeading } from "../ui/SectionHeading";
import { NewsCard } from "../ui/NewsCard";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import "./editorial.css";
export function NewsSection() {
  return (
    <section className="section container news-section">
      <SectionHeading
        eyebrow="NO CENTRO DA CONVERSA"
        title="Um olhar para a nossa região."
        to="/noticias"
        linkLabel="Todas as notícias"
      />
      <div className="editorial-grid grid gap-6 lg:grid-cols-[1.2fr_1fr_.8fr]">
        {content.getNews().map((article, i) => (
          <NewsCard key={article.id} article={article} featured={i === 0} />
        ))}
        <aside className="editorial-aside">
          <span className="issue-number">01 / CONEXÕES</span>
          <h3>
            A sua voz <br />
            também faz <br />a notícia.
          </h3>
          <p>
            Uma sugestão de pauta, uma história ou uma informação da sua
            comunidade?
          </p>
          <Link to="/contato" className="text-link">
            Fale com o jornalismo <ArrowUpRight size={18} />
          </Link>
          <div className="aside-decoration" aria-hidden="true">
            a.
          </div>
        </aside>
      </div>
      <p className="section-note">
        Prévia editorial: os conteúdos acima são demonstrativos e as imagens são
        conceituais.
      </p>
    </section>
  );
}
