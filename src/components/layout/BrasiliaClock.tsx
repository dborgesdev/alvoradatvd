import { useEffect, useState } from "react";
import { formatClock } from "../../lib/services/format";
import { Clock3 } from "lucide-react";
export function BrasiliaClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const [date, time] = formatClock(now).split(" · ");
  return (
    <time
      className="utility-clock"
      dateTime={now.toISOString()}
      title="Horário de Brasília — America/Sao_Paulo"
    >
      <Clock3 aria-hidden="true" />
      <span className="utility-clock-copy">
        <span className="utility-clock-date">{date}</span>
        <strong>{time}</strong>
      </span>
    </time>
  );
}
