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
export function weatherLabel(code: number): {
  label: string;
  icon: "sun" | "cloud" | "rain" | "storm";
} {
  if (code === 0) return { label: "Céu limpo", icon: "sun" };
  if ([1, 2, 3].includes(code)) return { label: "Com nuvens", icon: "cloud" };
  if ([45, 48].includes(code)) return { label: "Neblina", icon: "cloud" };
  if ([95, 96, 99].includes(code)) return { label: "Trovoadas", icon: "storm" };
  if (
    [
      51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85,
      86,
    ].includes(code)
  )
    return { label: "Precipitação", icon: "rain" };
  return { label: "Condição meteorológica", icon: "cloud" };
}
