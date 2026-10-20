import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { NewsArticle } from "../../types/content";
import "../sections/editorial.css";
export function NewsCard({
  article,
  featured = false,
}: {
  article: NewsArticle;
  featured?: boolean;
}) {
  return (
    <article className={`news-card ${featured ? "featured" : ""}`}>
      <Link
        to={`/noticias/${article.slug}`}
        className="image-link"
        aria-label={`Ler: ${article.title} — conteúdo demonstrativo`}
      >
        <img src={article.image} alt="" loading="lazy" />
        <span className="image-caption">Imagem conceitual</span>
      </Link>
      <div className="news-copy">
        <div className="article-meta">
          <span>{article.category}</span>
          <span>Conteúdo demonstrativo</span>
        </div>
        <h3>
          <Link to={`/noticias/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.excerpt}</p>
        <Link className="text-link" to={`/noticias/${article.slug}`}>
          Ler demonstração <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}
