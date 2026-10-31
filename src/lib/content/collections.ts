import type { EditorialProgram } from "../../types/editorial.ts";
import type { ScheduleEntry } from "../../types/collections.ts";

export const broadcastLabels = { ao_vivo: "Ao vivo", gravado: "Gravado", reprise: "Reprise" };
export function buildSchedule(programs: EditorialProgram[]): ScheduleEntry[] {
  const entries: ScheduleEntry[] = [];
  programs.forEach(program => program.slots.forEach((slot, index) => slot.days.forEach(day => {
    const overnight = slot.endsAt < slot.startsAt;
    const base = { title: program.title, description: program.subtitle || program.description, category: program.category, image: program.image?.src || null, imageDetails: program.image, order: index, isDemo: false, broadcastType: slot.type, note: slot.note };
    entries.push({ ...base, id: `${program.id}-${index}-${day}`, dayOfWeek: day - 1, startsAt: slot.startsAt, endsAt: overnight ? "24:00" : slot.endsAt, continuesNextDay: overnight });
    if (overnight && slot.endsAt !== "00:00") entries.push({ ...base, id: `${program.id}-${index}-${day}-continuation`, dayOfWeek: day % 7, startsAt: "00:00", endsAt: slot.endsAt, continuation: true });
  })));
  return entries.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startsAt.localeCompare(b.startsAt) || a.title.localeCompare(b.title, "pt-BR") || a.id.localeCompare(b.id));
}
