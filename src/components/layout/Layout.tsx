import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { RadioDock } from "./RadioDock";
import "./layout.css";
import "../sections/internal-pages.css";
import { useSectionReveal } from "../../hooks/useSectionReveal";
export function Layout() {
  const { pathname } = useLocation();
  useSectionReveal(pathname);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        data-page={pathname.split("/")[1] || "home"}
      >
        <Outlet />
      </main>
      <Footer />
      <RadioDock />
    </>
  );
}
