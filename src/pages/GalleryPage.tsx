import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { GallerySection } from "../components/sections/GallerySection";
export default function GalleryPage() {
  usePageMeta(
    "Galeria de Fotos",
    "Explore álbuns demonstrativos e referências visuais de comunicação. Fotografias oficiais aguardam confirmação.",
  );
  return (
    <>
      <PageIntro
        eyebrow="IMAGENS QUE CONECTAM"
        title="Galeria de Fotos"
        description="Perspectivas da cidade, do audiovisual e da comunicação. Uma prévia do espaço reservado aos futuros álbuns da Alvorada."
      />
      <GallerySection />
    </>
  );
}
