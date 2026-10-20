import { usePageMeta } from "../hooks/usePageMeta";
import { PageIntro } from "../components/ui/PageIntro";
import { ContactSection } from "../components/sections/ContactSection";
export default function ContactPage() {
  usePageMeta(
    "Contato",
    "Fale com jornalismo, administração e comercial da Rede Alvorada em Hortolândia.",
  );
  return (
    <>
      <PageIntro
        eyebrow="A GENTE QUER OUVIR VOCÊ"
        title="Toda conexão começa aqui."
        description="Uma sugestão, uma parceria ou uma boa conversa. Encontre o canal certo."
      />
      <ContactSection />
    </>
  );
}
