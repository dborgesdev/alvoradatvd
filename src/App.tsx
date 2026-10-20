import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import ArticlePage from "./pages/ArticlePage";
import TvPage from "./pages/TvPage";
import RadioPage from "./pages/RadioPage";
import ProgramsPage from "./pages/ProgramsPage";
import InstitutionalPage from "./pages/InstitutionalPage";
import TeamPage from "./pages/TeamPage";
import PromotionsPage from "./pages/PromotionsPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import { RadioProvider } from "./components/layout/RadioProvider";
import RadioHistoryPage from "./pages/RadioHistoryPage";
export default function App() {
  return (
    <BrowserRouter>
      <RadioProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="noticias" element={<NewsPage />} />
            <Route path="noticias/:slug" element={<ArticlePage />} />
            <Route path="tv" element={<TvPage />} />
            <Route path="radio" element={<RadioPage />} />
            <Route path="programas" element={<ProgramsPage />} />
            <Route path="institucional" element={<InstitutionalPage />} />
            <Route path="historia-do-radio" element={<RadioHistoryPage />} />
            <Route path="equipe" element={<TeamPage />} />
            <Route path="promocoes" element={<PromotionsPage />} />
            <Route path="contato" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </RadioProvider>
    </BrowserRouter>
  );
}
