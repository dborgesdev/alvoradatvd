import { SectionHeading } from "../ui/SectionHeading";
import { FeedNews } from "../ui/FeedNews";
import { useService } from "../../hooks/useService";
import { newsResource } from "../../lib/services/client";
export function NewsSection() {
  const state = useService(newsResource);
  return (
    <section id="noticias" className="section container news-section">
      <SectionHeading
        eyebrow=""
        title="Aconteceu, na Rede Alvorada virou notícia"
      />
      {/* <p className="news-curation-note">
        Seleção de matérias de veículos externos. A leitura completa acontece no
        portal de origem.
      </p> */}
      <FeedNews {...state} />
    </section>
  );
}
