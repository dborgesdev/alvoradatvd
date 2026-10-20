import type { DocumentSection } from "../../types/institutional";
export function DocumentSections({
  sections,
}: {
  sections: DocumentSection[];
}) {
  return (
    <div className="institutional-content">
      {sections.map((section) => (
        <section key={section.id} id={section.id}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>
      ))}
    </div>
  );
}
