import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { RadioPlayerSection } from "../components/sections/RadioPlayerSection";
export default function RadioPage() {
  usePageMeta(
    "Rádio",
    "Rádio Alvorada. A transmissão de áudio aguarda confirmação do serviço de streaming.",
  );
  return (
    <>
      <PageIntro
        eyebrow="DÊ VOZ AO SEU DIA"
        title="Rádio é proximidade."
        description="Música, informação e boas conversas. A conexão que acompanha você."
      />
      <RadioPlayerSection />
    </>
  );
}
