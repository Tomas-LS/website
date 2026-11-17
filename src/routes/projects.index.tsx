import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

const description =
  "Engineering case studies in wheelchair adaptation, assistive devices and accessibility — problem, requirements, design, fabrication and outcome.";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: `Projects — ${site.name}` },
      { name: "description", content: description },
      { property: "og:title", content: `Projects — ${site.name}` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Case studies"
        title="Projects"
        lead="Real projects from my university internships. Each case study follows the engineering process from problem definition to final outcome."
      />
      <section className="bg-surface-2 py-16 md:py-24">
        <div className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 100}>
              <ProjectCard project={p} index={i} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
