import { usePageMeta } from "../hooks/usePageMeta";
import { HeroSection } from "../components/sections/HeroSection";
import { RadioBarSection } from "../components/sections/RadioBarSection";
import { NewsSection } from "../components/sections/NewsSection";
import { SportsSection } from "../components/sections/SportsSection";
import { ProgramsSection } from "../components/sections/ProgramsSection";
import { AboutSection } from "../components/sections/AboutSection";
import { ContactCtaSection } from "../components/sections/ContactCtaSection";
export default function HomePage() {
  usePageMeta(
    "Informação que conecta",
    "Rádio, televisão digital, informação e esporte. Conecte-se à Rede Alvorada de Hortolândia.",
  );
  return (
    <>
      <div id="broadcast-region">
        <HeroSection />
        <RadioBarSection />
      </div>
      <NewsSection />
      <SportsSection />
      <ProgramsSection />
      <AboutSection />
      <ContactCtaSection />
    </>
  );
}
