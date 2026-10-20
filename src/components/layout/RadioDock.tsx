import { createPortal } from "react-dom";
import type { CSSProperties } from "react";
import { useLocation } from "react-router-dom";
import { useRadioDock } from "../../hooks/useRadioDock";
import { RadioControls } from "../ui/RadioControls";
export function RadioDock() {
  const { pathname } = useLocation();
  const { slot, floating, headerOffset } = useRadioDock(pathname);
  const player = (
    <aside
      className={`radio-dock ${floating ? "is-floating" : "is-integrated"} ${pathname === "/" ? "is-home" : "is-secondary"} ${!slot && pathname === "/" ? "is-pending" : ""}`}
      style={{ "--radio-header-offset": `${headerOffset}px` } as CSSProperties}
      aria-label="Player da Rádio Alvorada"
    >
      <RadioControls compact={floating} />
    </aside>
  );
  return slot ? createPortal(player, slot) : player;
}
