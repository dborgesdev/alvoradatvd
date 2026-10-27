import { useState } from "react";
import { ArrowUpRight, ExternalLink, ImageOff } from "lucide-react";
import type { FeedArticle, ServiceResult } from "../../types/services";
import { formatDate } from "../../lib/services/format";
import { useNewsLayout, type NewsLayout } from "../../hooks/useNewsLayout";
import "../sections/feed-news.css";

function FeedCard({
  article,
  featured,
  compact,
}: {
  article: FeedArticle;
  featured: boolean;
  compact: boolean;
}) {
  const [failedImage, setFailedImage] = useState(false);
  const heading = (
    <>
      {!compact && article.sponsored && (
        <p className="feed-meta">
          {article.sponsored && <strong>Conteúdo publicitário</strong>}
        </p>
      )}
      <h3>{article.title}</h3>
      {!compact && (
        <time dateTime={article.publishedAt}>
          {formatDate(article.publishedAt)}
        </time>
      )}
    </>
  );
  return (
    <article className={`feed-card ${featured ? "feed-featured" : ""}`}>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="feed-card-link"
        title={`Fonte original: ${article.source}`}
      >
        <div className="feed-image">
          {article.image && !failedImage ? (
            <img
              src={article.image}
              alt=""
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              width="960"
              height="540"
              onError={() => setFailedImage(true)}
            />
          ) : (
            <span className="feed-no-image">
              <ImageOff size={30} />
              Imagem não disponível no feed
            </span>
          )}
          {featured && <div className="feed-overlay">{heading}</div>}
        </div>
        <div className="feed-copy">
          {!featured && heading}
          {!compact && <p className="feed-summary">{article.summary}</p>}
          <span className="feed-read">
            Ler matéria <ExternalLink size={15} />
          </span>
        </div>
      </a>
    </article>
  );
}
type FeedNewsProps = {
  result: ServiceResult<FeedArticle[]> | null;
  loading: boolean;
  query?: string;
};
export function FeedNews(props: FeedNewsProps) {
  const { ref, layout } = useNewsLayout();
  return (
    <div ref={ref} className="feed-news" data-layout={layout}>
      <FeedContent {...props} layout={layout} />
    </div>
  );
}
function FeedContent({
  result,
  loading,
  query = "",
  layout,
}: FeedNewsProps & { layout: NewsLayout }) {
  if (loading)
    return (
      <div className="feed-placeholder" role="status">
        Buscando as notícias da região…
      </div>
    );
  if (!result?.data)
    return (
      <div className="feed-placeholder" role="status">
        <h3>As notícias estão temporariamente indisponíveis.</h3>
        <p>Você pode acompanhar a cobertura diretamente no portal de origem.</p>
        <a
          className="text-link"
          href="https://g1.globo.com/sp/campinas-regiao/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir portal de origem <ArrowUpRight size={16} />
        </a>
      </div>
    );
  const articles = result.data.filter((article) =>
    `${article.title} ${article.summary}`
      .toLocaleLowerCase("pt-BR")
      .includes(query.toLocaleLowerCase("pt-BR")),
  );
  return (
    <>
      {result.stale && (
        <p className="feed-status" role="status">
          A atualização está indisponível. Exibindo a última seleção recebida
          {result.updatedAt ? ` em ${formatDate(result.updatedAt)}` : ""}.
        </p>
      )}
      <div className="feed-highlights">
        {articles.slice(0, layout === "compact" ? 5 : 4).map((article, i) => (
          <FeedCard
            key={article.url}
            article={article}
            featured={layout === "wide" && i === 0}
            compact={layout === "compact"}
          />
        ))}
      </div>
      {layout !== "compact" && articles.length > 4 && (
        <div className="feed-list" aria-label="Mais notícias da região">
          {articles.slice(4, 10).map((article) => (
            <article key={article.url}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Fonte original: ${article.source}`}
              >
                <div className="feed-meta">
                  <time dateTime={article.publishedAt}>
                    {formatDate(article.publishedAt)}
                  </time>
                  {article.sponsored && <strong>Conteúdo publicitário</strong>}
                </div>
                <h3>
                  {article.title} <ArrowUpRight size={17} />
                </h3>
                <p>{article.summary}</p>
              </a>
            </article>
          ))}
        </div>
      )}
      {articles.length === 0 && (
        <p className="feed-placeholder" role="status">
          Nenhuma notícia corresponde à sua busca.
        </p>
      )}
    </>
  );
}
