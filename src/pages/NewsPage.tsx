import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { NewsListingSection } from "../components/sections/NewsListingSection";
export default function NewsPage() {
  usePageMeta(
    "Notícias",
    "Notícias do G1 Campinas e Região, com acesso direto às matérias originais.",
  );
  return (
    <>
      <PageIntro
        eyebrow="JORNAL DIGITAL"
        title="A região em perspectiva."
        description="Uma seleção das últimas notícias do G1 Campinas e Região. Leia cada matéria completa no portal de origem."
      />
      <NewsListingSection />
    </>
  );
}
