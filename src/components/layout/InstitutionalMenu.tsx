import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { institutionalNavigation } from "../../data/content/editorial";

export function InstitutionalMenu({ onNavigate }: { onNavigate?: () => void }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const { pathname } = useLocation();
  const active = institutionalNavigation.some(([url]) => url === pathname);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !ref.current?.contains(event.target) &&
        ref.current
      )
        ref.current.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);
  return (
    <details
      ref={ref}
      className="institutional-menu"
      onKeyDown={(event) => {
        if (event.key === "Escape" && ref.current?.open) {
          event.stopPropagation();
          ref.current.open = false;
          ref.current.querySelector("summary")?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          event.currentTarget.open = false;
      }}
    >
      <summary className={active ? "active" : undefined}>
        Institucional <ChevronDown size={14} />
      </summary>
      <div className="institutional-dropdown">
        {institutionalNavigation.map(([url, label]) => (
          <NavLink
            key={url}
            to={url}
            onClick={() => {
              if (ref.current) ref.current.open = false;
              onNavigate?.();
            }}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </details>
  );
}
