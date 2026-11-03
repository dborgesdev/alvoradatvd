import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { PrivacySection } from "../components/sections/PrivacySection";
export default function PrivacyPage() {
  usePageMeta(
    "Política de Privacidade",
    "Política de Privacidade da Rede Alvorada: navegação, mídia, serviços externos e direitos previstos na LGPD.",
  );
  return (
    <>
      <PageIntro
        eyebrow="INFORMAÇÃO COM RESPONSABILIDADE"
        title="Política de Privacidade"
        description="Saiba como os recursos do portal se relacionam com seus dados."
      />
      <PrivacySection />
    </>
  );
}
