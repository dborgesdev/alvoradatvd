import { readFileSync, writeFileSync } from "node:fs";
import {
  parseInstitutionalSource,
  institutionalOrder,
} from "./institutional-source.mjs";
const path = "src/data/content/institutional.ts";
const previous = readFileSync(path, "utf8").split("// Transcrição integral")[0];
const sections = parseInstitutionalSource(
  readFileSync("docs/institucional-fonte.txt", "utf8"),
);
const ordered = institutionalOrder.map((title) => {
  const section = sections.find((item) => item.title === title);
  if (!section) throw new Error(`Seção ausente: ${title}`);
  return section;
});
writeFileSync(
  path,
  `${previous.trim()}\n\n// Transcrição integral de docs/institucional-fonte.txt; somente metadados de página removidos.\nexport const institutionalSections = ${JSON.stringify(ordered, null, 2)};\n\nexport const radioHistorySections = ${JSON.stringify(sections.slice(0, 2), null, 2)};\n`,
);
