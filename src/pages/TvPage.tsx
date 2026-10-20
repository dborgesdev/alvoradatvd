import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { TvPlayerSection } from "../components/sections/TvPlayerSection";
export default function TvPage() {
  usePageMeta("TV ao vivo", "Acompanhe a transmissão digital da Alvorada TV.");
  return (
    <>
      <PageIntro
        eyebrow="CONECTE-SE AO SINAL"
        title="Alvorada TV. Com você."
        description="Informação e entretenimento no mesmo lugar, em qualquer tela."
      />
      <TvPlayerSection />
    </>
  );
}
