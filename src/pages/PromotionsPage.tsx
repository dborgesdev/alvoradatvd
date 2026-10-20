import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { PendingContentSection } from "../components/sections/PendingContentSection";
export default function PromotionsPage() {
  usePageMeta(
    "Promoções",
    "Acompanhe o espaço de promoções oficiais da Rede Alvorada.",
  );
  return (
    <>
      <PageIntro
        eyebrow="PARTICIPE DA CONEXÃO"
        title="Mais perto de você."
        description="Um espaço para acompanhar as ações oficiais da Rede Alvorada."
      />
      <PendingContentSection kind="promotions" />
    </>
  );
}
