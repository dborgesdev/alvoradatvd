import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { content } from "../../lib/content";
import { NewsCard } from "../ui/NewsCard";
export function NewsListingSection() {
  const [params, setParams] = useSearchParams();
  const query = params.get("busca") || "";
  const category = params.get("categoria") || "Todas";
  const articles = content.getNews();
  const categories = [
    "Todas",
    ...new Set(articles.map((article) => article.category)),
  ];
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const matches = articles.filter(
    (article) =>
      (category === "Todas" || category === article.category) &&
      `${article.title} ${article.excerpt}`
        .toLocaleLowerCase("pt-BR")
        .includes(query.toLocaleLowerCase("pt-BR")),
  );
  return (
    <section className="section container">
      <div className="news-filters">
        <div className="filter-tabs" aria-label="Categorias">
          {categories.map((item) => (
            <button
              key={item}
              aria-pressed={category === item}
              onClick={() => update("categoria", item)}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={18} />
          <span className="sr-only">Buscar notícias</span>
          <input
            type="search"
            value={query}
            onChange={(event) => update("busca", event.target.value)}
            placeholder="O que você procura?"
          />
        </label>
      </div>
      <p className="section-note" role="status">
        {matches.length}{" "}
        {matches.length === 1 ? "conteúdo encontrado" : "conteúdos encontrados"}{" "}
        · Prévia editorial demonstrativa
      </p>
      <div className="news-list-grid">
        {matches.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
      {matches.length === 0 && (
        <div className="empty-state">
          <Search size={36} />
          <h2>Nenhum conteúdo por aqui.</h2>
          <p>Tente outra palavra ou selecione uma categoria diferente.</p>
          <button className="button blue" onClick={() => setParams({})}>
            Limpar filtros
          </button>
        </div>
      )}
    </section>
  );
}
