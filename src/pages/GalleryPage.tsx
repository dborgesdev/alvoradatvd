import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { GallerySection } from "../components/sections/GallerySection";
export default function GalleryPage() {
  usePageMeta(
    "Galeria de Fotos",
    "Explore os álbuns e fotografias publicados pela Rede Alvorada.",
  );
  return (
    <>
      <PageIntro
        eyebrow="IMAGENS QUE CONECTAM"
        title="Galeria de Fotos"
        description="Os registros, as histórias e os olhares publicados pela Rede Alvorada."
      />
      <GallerySection />
    </>
  );
}
