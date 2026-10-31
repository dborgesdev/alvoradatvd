import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { TeamSection } from "../components/sections/TeamSection";
export default function TeamPage() {
  usePageMeta(
    "Equipe",
    "Conheça os integrantes e profissionais da Rede Alvorada.",
  );
  return (
    <>
      <PageIntro
        eyebrow="QUEM FAZ A ALVORADA"
        title="Conexão feita por pessoas."
        description="Os profissionais que dão voz e imagem à nossa comunicação."
      />
      <TeamSection />
    </>
  );
}
