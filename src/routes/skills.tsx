import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { skillGroups } from "@/content/skills";
import { site } from "@/content/site";

const description =
  "CAD software, mechanical design, prototyping, fabrication, material selection and product development skills.";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: `Skills & Tools — ${site.name}` },
      { name: "description", content: description },
      { property: "og:title", content: `Skills & Tools — ${site.name}` },
      { property: "og:description", content: description },
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
        eyebrow="Skills & tools"
        title="From first sketch to finished part."
        lead="The software, methods and workshop skills I use to design, analyse and build assistive devices."
      />
      <section className="bg-surface-2 py-16 md:py-24">
        <div className="container-page grid gap-6 md:grid-cols-2">
          {skillGroups.map((g, i) => (
            <Reveal key={g.title} delay={(i % 2) * 80} className="rounded-md border bg-card p-7 shadow-card md:p-9">
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-semibold">{g.title}</h2>
                <span className="font-mono text-sm text-accent">{g.code}</span>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {g.items.map((item) => (
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
