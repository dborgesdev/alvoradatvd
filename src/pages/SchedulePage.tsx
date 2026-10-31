import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { ScheduleSection } from "../components/sections/ScheduleSection";
export default function SchedulePage() {
  usePageMeta(
    "Programação",
    "Confira os programas e horários da Rede Alvorada por dia da semana.",
  );
  return (
    <>
      <PageIntro
        eyebrow="NO RITMO DA ALVORADA"
        title="Programação"
        description="Acompanhe a emissora, dia após dia. Confira os programas e seus horários de exibição."
      />
      <ScheduleSection />
    </>
  );
}
