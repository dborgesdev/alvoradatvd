import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { InstitutionalSection } from "../components/sections/InstitutionalSection";
export default function InstitutionalPage() {
  usePageMeta(
    "Institucional",
    "Conheça a proposta, missão, visão e os valores da Rede Alvorada de Rádio e Televisão Digital.",
  );
  return (
    <>
      <PageIntro
        eyebrow="SOMOS REDE ALVORADA"
        title="Quem Somos"
        description="Informação que conecta, esporte que inspira, entretenimento que transforma."
      />
      <InstitutionalSection />
    </>
  );
}
