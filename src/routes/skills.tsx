import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import skillsContent from "@/content/skills-tools.json";
import { site } from "@/content/site";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: skillsContent.meta.title.replace("{name}", site.name) },
      { name: "description", content: skillsContent.meta.description },
      { property: "og:title", content: skillsContent.meta.title.replace("{name}", site.name) },
      { property: "og:description", content: skillsContent.meta.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <>
      <PageHeader
        eyebrow={skillsContent.heading.eyebrow}
        title={skillsContent.heading.title}
        lead={skillsContent.heading.lead}
      />
      <section className="bg-surface-2 py-16 md:py-24">
        <div className="container-page grid gap-6 md:grid-cols-2">
          {skillsContent.groups.map((group, i) => (
            <Reveal
              key={group.title}
              delay={(i % 2) * 80}
              className="rounded-md border bg-card p-7 shadow-card md:p-9"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-semibold">{group.title}</h2>
                <span className="font-mono text-sm text-accent">{group.code}</span>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="rounded-sm border bg-secondary px-3 py-1.5 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
