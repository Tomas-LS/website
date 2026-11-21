import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import projectsContent from "@/content/projects-page.json";
import type { Project } from "@/content/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-md border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={project.cover.src}
          alt={project.cover.alt}
          loading="lazy"
          width={1408}
          height={1008}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <span className="eyebrow absolute left-3 top-3 rounded-sm bg-background/90 px-2 py-1 text-[0.62rem] text-foreground">
          {projectsContent.card.figurePrefix} {String(project.order).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow text-accent">
          {project.category} · {project.year}
        </p>
        <h3 className="mt-3 text-xl font-semibold leading-snug">{project.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          {projectsContent.card.readCaseStudy}
          <ArrowUpRight
            className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
