import { news } from "../../data/content/news";
import { programs } from "../../data/content/programs";
import {
  institutional,
  institutionalSections,
  radioHistorySections,
} from "../../data/content/institutional";
import { site } from "../../data/content/site";
import { streams } from "../../data/content/streams";
import { team } from "../../data/content/team";
import { promotions } from "../../data/content/promotions";
import { institutionalDetails } from "../../data/content/editorial";
import { radioArchiveImage } from "../../data/content/history-media";
export const content = {
  getNews: () => news,
  getArticle: (slug: string) => news.find((article) => article.slug === slug),
  getPrograms: () => programs,
  getTeam: () => team,
  getPromotions: () => promotions,
  site,
  streams,
  institutional,
  getInstitutionalSections: () => institutionalSections,
  getRadioHistorySections: () => radioHistorySections,
  institutionalDetails,
  radioArchiveImage,
};
export const whatsappUrl = (phone: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent("Olá! Entrei em contato pelo portal da Rede Alvorada e gostaria de falar com a equipe.")}`;
