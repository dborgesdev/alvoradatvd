import { ArrowUpRight } from "lucide-react";
import { useService } from "../../hooks/useService";
import { teamResource } from "../../lib/content/resources";
import { EditorialState } from "../ui/EditorialState";
import { EditorialImage } from "../ui/EditorialImage";
import "./team.css";
export function TeamSection() {
  const state = useService(teamResource);
  return <section className="section container team-section">
    <EditorialState {...state} emptyMessage="Nenhum integrante disponível para exibição no momento." />
    <div className="team-grid">
      {state.result?.data?.map(member => <article key={member.id} className="team-card">
        {member.image && <div className="team-photo"><EditorialImage image={member.image} /></div>}
        <div className="team-copy">
          {member.role && <p className="eyebrow">{member.role}</p>}
          <h2>{member.name}</h2>
          {member.biography && <p className="team-biography">{member.biography}</p>}
          {(member.instagram || member.facebook) && <div className="team-socials">
            {member.instagram && <a href={member.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram de ${member.name}`}>Instagram<ArrowUpRight size={18} /></a>}
            {member.facebook && <a href={member.facebook} target="_blank" rel="noopener noreferrer" aria-label={`Facebook de ${member.name}`}>Facebook<ArrowUpRight size={18} /></a>}
          </div>}
        </div>
      </article>)}
    </div>
  </section>;
}
