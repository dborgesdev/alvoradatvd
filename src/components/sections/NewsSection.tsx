import { SectionHeading } from "../ui/SectionHeading";
import { FeedNews } from "../ui/FeedNews";
import { useService } from "../../hooks/useService";
import { newsResource } from "../../lib/services/client";
export function NewsSection() {
  const state = useService(newsResource);
  return (
    <section id="noticias" className="section container news-section">
      <SectionHeading
        eyebrow="G1 CAMPINAS E REGIÃO"
        title="Um olhar para a nossa região."
        to="/noticias"
        linkLabel="Todas as notícias"
      />
      <FeedNews {...state} />
    </section>
  );
}
