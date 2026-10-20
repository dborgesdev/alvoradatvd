import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
export function SectionHeading({
  eyebrow,
  title,
  to,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  to?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {to && (
        <Link className="text-link" to={to}>
          {linkLabel || "Explore mais"} <ArrowUpRight size={17} />
        </Link>
      )}
    </div>
  );
}
