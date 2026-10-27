import { SocialLinks } from "../ui/SocialLinks";
import { BrasiliaClock } from "./BrasiliaClock";
import { ServiceIndicators } from "./ServiceIndicators";
import { AppLinks } from "./AppLinks";
import "./utility-bar.css";
export function UtilityBar() {
  return (
    <div className="utility utility-bar">
      <div className="container">
        <div className="utility-brand-group">
          <span className="utility-eyebrow connect-label">CONECTE-SE</span>
          <SocialLinks />
          <AppLinks />
        </div>
        <div className="utility-services">
          <ServiceIndicators />
        </div>
        <BrasiliaClock />
      </div>
    </div>
  );
}
