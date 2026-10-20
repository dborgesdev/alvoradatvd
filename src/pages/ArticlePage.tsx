import { Link, useParams } from "react-router-dom";
import { content } from "../lib/content";
import { usePageMeta } from "../hooks/usePageMeta";
import NotFoundPage from "./NotFoundPage";
export default function ArticlePage() {
  const { slug } = useParams();
  const article = content.getArticle(slug || "");
  usePageMeta(
    article?.title || "Conteúdo não encontrado",
    article?.excerpt || "O conteúdo solicitado não foi encontrado.",
  );
  if (!article) return <NotFoundPage />;
  return (
    <article className="article-page container">
      <Link className="text-link" to="/noticias">
        ← Voltar às notícias
      </Link>
      <header>
        <div className="article-meta">
          <span>{article.category}</span>
          <span>Conteúdo demonstrativo</span>
        </div>
        <h1>{article.title}</h1>
        <p className="article-lead">{article.excerpt}</p>
        <p className="section-note">
          Prévia editorial · Sem data de publicação · Rede Alvorada
        </p>
      </header>
      <figure>
        <img
          src={article.image}
          alt="Imagem conceitual para demonstração do layout editorial"
        />
        <figcaption>
          Imagem conceitual. Não retrata um acontecimento ou local confirmado.
        </figcaption>
      </figure>
      <div className="article-body">
        <aside className="demo-notice">
          Conteúdo demonstrativo. Este artigo apresenta a experiência de leitura
          da V1 e não é uma notícia real.
        </aside>
        {article.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p>
          Os conteúdos oficiais serão publicados pela equipe da emissora após
          apuração e aprovação editorial. Até lá, este espaço permite avaliar a
          organização da matéria, a leitura e a navegação do portal.
        </p>
        <Link className="text-link" to="/contato">
          Envie sua sugestão de pauta ↗
        </Link>
      </div>
      <section className="article-related">
        <h2>Continue explorando</h2>
        {content
          .getNews()
          .filter((item) => item.id !== article.id)
          .map((item) => (
            <Link
              className="text-link"
              key={item.id}
              to={`/noticias/${item.slug}`}
            >
              {item.title} ↗
            </Link>
          ))}
      </section>
    </article>
  );
}
