import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { NewsListingSection } from "../components/sections/NewsListingSection";
export default function NewsPage() {
  usePageMeta(
    "Notícias",
    "Explore a prévia editorial do portal Rede Alvorada. Conteúdos demonstrativos identificados.",
  );
  return (
    <>
      <PageIntro
        eyebrow="JORNAL DIGITAL"
        title="A região em perspectiva."
        description="Informação que aproxima. Explore os conteúdos demonstrativos desta prévia editorial."
      />
      <NewsListingSection />
    </>
  );
}
