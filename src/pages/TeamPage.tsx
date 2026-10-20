import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { PendingContentSection } from "../components/sections/PendingContentSection";
export default function TeamPage() {
  usePageMeta(
    "Equipe",
    "Conheça o espaço da equipe da Rede Alvorada. Informações em preparação.",
  );
  return (
    <>
      <PageIntro
        eyebrow="QUEM FAZ A ALVORADA"
        title="Conexão feita por pessoas."
        description="Os profissionais que dão voz e imagem à nossa comunicação."
      />
      <PendingContentSection kind="team" />
    </>
  );
}
