import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { ScheduleSection } from "../components/sections/ScheduleSection";
export default function SchedulePage() {
  usePageMeta(
    "Programação",
    "Explore uma demonstração da grade por dia da semana. Programas e horários oficiais aguardam confirmação.",
  );
  return (
    <>
      <PageIntro
        eyebrow="NO RITMO DA ALVORADA"
        title="Programação"
        description="Uma experiência para acompanhar a emissora, dia após dia. Conheça a estrutura da futura grade oficial."
      />
      <ScheduleSection />
    </>
  );
}
