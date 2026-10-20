import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { RadioHistorySection } from "../components/sections/RadioHistorySection";
export default function RadioHistoryPage() {
  usePageMeta(
    "História do Rádio",
    "História do Rádio e Rádio no Brasil: texto integral do documento institucional fornecido pela Rede Alvorada.",
  );
  return (
    <>
      <PageIntro
        eyebrow="MEMÓRIA DA COMUNICAÇÃO"
        title="Uma história que segue no ar."
        description="História do Rádio e Rádio no Brasil. Uma leitura do material institucional da Rede Alvorada."
      />
      <RadioHistorySection />
    </>
  );
}
