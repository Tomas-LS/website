import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import projectsContent from "@/content/projects-page.json";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: projectsContent.meta.title.replace("{name}", site.name) },
      { name: "description", content: projectsContent.meta.description },
      { property: "og:title", content: projectsContent.meta.title.replace("{name}", site.name) },
      { property: "og:description", content: projectsContent.meta.description },
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
        eyebrow={projectsContent.listing.eyebrow}
        title={projectsContent.listing.title}
        lead={projectsContent.listing.lead}
      />
      <section className="bg-surface-2 py-16 md:py-24">
        <div className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 100}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
