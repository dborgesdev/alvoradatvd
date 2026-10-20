export const sourceTitles = [
  "História do Rádio",
  "Rádio no Brasil",
  "Proposta",
  "Resumo da Proposta",
  "Resultado da Proposta",
  "Objetivos",
  "Objetivos específicos",
  "Sobre",
  "Quem Somos",
  "Missão",
  "Visão",
  "Valores",
  "Filosofia de trabalho:",
  "Estrutura",
  "Para ouvir",
  "Comercial",
  "Resumo",
];
export const institutionalOrder = [
  "Quem Somos",
  "Sobre",
  "Proposta",
  "Resumo da Proposta",
  "Resultado da Proposta",
  "Objetivos",
  "Objetivos específicos",
  "Missão",
  "Visão",
  "Valores",
  "Filosofia de trabalho:",
  "Estrutura",
  "Para ouvir",
  "Comercial",
  "Resumo",
];
export function parseInstitutionalSource(source) {
  const sections = [];
  let current;
  for (const line of source.split(/\r?\n/)) {
    const text = line.replace(/\f/g, "").trim();
    if (
      !text ||
      /- Página \d+ de \d+ -/.test(text) ||
      /^Rua Zacarias/.test(text) ||
      /^(\\?:)/.test(text)
    )
      continue;
    if (sourceTitles.includes(text)) {
      current = {
        id: text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/-$/, ""),
        title: text,
        paragraphs: [],
      };
      sections.push(current);
      continue;
    }
    if (!current) continue;
    if (/^\s{3,}\S/.test(line) || !current.paragraphs.length)
      current.paragraphs.push(text);
    else current.paragraphs[current.paragraphs.length - 1] += ` ${text}`;
  }
  return sections;
}
