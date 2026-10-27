import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { FeedNews } from "../ui/FeedNews";
import { useService } from "../../hooks/useService";
import { newsResource } from "../../lib/services/client";
export function NewsListingSection() {
  const [params, setParams] = useSearchParams();
  const query = params.get("busca") || "";
  const state = useService(newsResource);
  return (
    <section className="section container">
      <div className="news-filters">
        <p className="eyebrow">ÚLTIMAS DO G1 CAMPINAS E REGIÃO</p>
        <label className="search-field">
          <Search size={18} />
          <span className="sr-only">Buscar notícias</span>
          <input
            type="search"
            value={query}
            placeholder="O que você procura?"
            onChange={(event) => {
              const next = new URLSearchParams(params);
              next.set("busca", event.target.value);
              setParams(next, { replace: true });
            }}
          />
        </label>
      </div>
      <FeedNews {...state} query={query} />
    </section>
  );
}
