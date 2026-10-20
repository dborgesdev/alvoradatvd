import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { ProgramsSection } from "../components/sections/ProgramsSection";
export default function ProgramsPage() {
  usePageMeta(
    "Programas",
    "Conheça o espaço de programas e acesse o canal oficial da Rede Alvorada.",
  );
  return (
    <>
      <PageIntro
        eyebrow="CONTEÚDO PARA SE CONECTAR"
        title="O seu tempo. A sua tela."
        description="O ponto de encontro para os programas e vídeos da Rede Alvorada."
      />
      <ProgramsSection full />
    </>
  );
}
