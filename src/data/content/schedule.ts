import type { ScheduleEntry } from "../../types/collections";
export const scheduleDays = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];
export const schedule: ScheduleEntry[] = scheduleDays.flatMap((_, dayOfWeek) =>
  [
    {
      title: "Faixa editorial · exemplo",
      description:
        "Espaço ilustrativo para notícias e informações da comunidade.",
      startsAt: "08:00",
      endsAt: "10:00",
      category: "Jornalismo",
    },
    {
      title: "Faixa musical · exemplo",
      description: "Espaço ilustrativo para música e entretenimento.",
      startsAt: "12:00",
      endsAt: "14:00",
      category: "Entretenimento",
    },
    {
      title: "Faixa de entrevistas · exemplo",
      description: "Espaço ilustrativo para conversas e temas regionais.",
      startsAt: "18:00",
      endsAt: "19:00",
      category: "Entrevistas",
    },
  ].map((entry, order) => ({
    ...entry,
    id: `demo-${dayOfWeek}-${order}`,
    dayOfWeek,
    order,
    image: null,
    isDemo: true,
  })),
);
