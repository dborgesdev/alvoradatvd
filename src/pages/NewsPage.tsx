import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { NewsListingSection } from "../components/sections/NewsListingSection";
export default function NewsPage() {
  usePageMeta(
    "Notícias",
    "Seleção de notícias de Campinas e região, com links para as matérias originais.",
  );
  return (
    <>
      <PageIntro
        eyebrow="JORNAL DIGITAL"
        title="Aconteceu, na Rede Alvorada virou notícia."
        description=""
      />
      <NewsListingSection />
    </>
  );
}
