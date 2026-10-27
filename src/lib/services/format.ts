export const brazilTimeZone = "America/Sao_Paulo";
const weekdayFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: brazilTimeZone,
  weekday: "long",
});
const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: brazilTimeZone,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const clockFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: brazilTimeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});
export function formatClock(date: Date): string {
  return `${weekdayFormat.format(date)}, ${dateFormat.format(date)} · ${clockFormat.format(date)}`;
}
export function formatDate(value: string, time = true): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: brazilTimeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(time ? ({ hour: "2-digit", minute: "2-digit" } as const) : {}),
  }).format(new Date(value));
}
