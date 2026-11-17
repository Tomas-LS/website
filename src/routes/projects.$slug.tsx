import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { ReactNode } from "react";

import { Figure } from "@/components/site/Figure";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { slug: project.slug, title: project.title, summary: project.summary };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — ${site.name}` },
          { name: "description", content: loaderData.summary },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.summary },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Project not found" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: ProjectNotFound,
  component: ProjectPage,
});

function ProjectNotFound() {
  return (
    <div className="container-page py-32 text-center">
      <h1 className="text-3xl font-semibold">Project not found</h1>
      <p className="mt-3 text-muted-foreground">This case study doesn't exist or has moved.</p>
      <Button asChild className="mt-8">
        <Link to="/projects">Back to projects</Link>
      </Button>
    </div>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <Reveal as="section" className="grid gap-4 border-t py-10 md:grid-cols-[14rem_1fr] md:gap-10 md:py-14">
      <h2 className="flex items-baseline gap-3 text-xl font-semibold">
        <span className="font-mono text-sm text-accent">{n}</span>
        {title}
      </h2>
      <div className="max-w-2xl text-[1.05rem] leading-relaxed text-muted-foreground">{children}</div>
    </Reveal>
  );
}

function ProjectPage() {
  const { slug } = Route.useLoaderData();
  const project = getProject(slug)!;
  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <article>
      <header className="blueprint-wash border-b bg-surface">
        <div className="container-page animate-rise py-12 md:py-20">
          <Link to="/projects" className="eyebrow inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" aria-hidden /> All projects
          </Link>
          <p className="eyebrow mt-8 text-accent">
            {project.category} · {project.year}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.08] md:text-6xl">{project.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{project.summary}</p>

          <dl className="mt-10 grid gap-6 border-t pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Role", v: project.role },
              { k: "Duration", v: project.duration },
              { k: "Context", v: project.context },
              { k: "Tools", v: project.tools.join(", ") },
            ].map((d) => (
              <div key={d.k}>
                <dt className="eyebrow text-muted-foreground">{d.k}</dt>
                <dd className="mt-2 text-sm leading-relaxed">{d.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="bg-card py-12 md:py-16">
        <div className="container-page">
        <figure className="crop-marks animate-rise [animation-delay:120ms]">
          <img
            src={project.cover.src}
            alt={project.cover.alt}
            width={1408}
            height={1008}
            className="aspect-[16/9] w-full rounded-md object-cover shadow-lift"
          />
        </figure>

        <dl className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-md border bg-border">
          {project.metrics.map((m) => (
            <div key={m.label} className="flex flex-col-reverse gap-1 bg-card p-5 md:p-8">
              <dt className="eyebrow text-[0.62rem] text-muted-foreground md:text-xs">{m.label}</dt>
              <dd className="font-display text-2xl font-semibold text-primary md:text-4xl">{m.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12">
          <Block n="01" title="Problem definition">
            <p>{project.problem}</p>
          </Block>
          <Block n="02" title="User requirements">
            <ul className="space-y-3">
              {project.requirements.map((r) => (
                <li key={r} className="flex gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </Block>
          <Block n="03" title="Engineering approach">
            <p>{project.approach}</p>
          </Block>
          <Block n="04" title="Design process">
            <ol className="space-y-6">
              {project.process.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-2">
                  <span className="font-mono text-sm text-accent">{String.fromCharCode(97 + i)}.</span>
                  <div>
                    <h3 className="font-sans text-base font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-1">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Block>
          <Block n="05" title="Fabrication">
            <p>{project.fabrication}</p>
          </Block>
          <Block n="06" title="Final outcome">
            <p>{project.outcome}</p>
          </Block>
        </div>

        <section className="mt-10 rounded-md border bg-surface p-6 md:p-10" aria-labelledby="gallery-heading">
          <h2 id="gallery-heading" className="flex items-baseline gap-3 text-xl font-semibold">
            <span className="font-mono text-sm text-accent">07</span> Gallery, CAD & drawings
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {project.gallery.map((item, i) => (
              <Reveal key={item.caption} delay={(i % 2) * 80}>
                <Figure item={item} index={i} />
              </Reveal>
            ))}
          </div>
        </section>
        </div>
      </div>

      {next && next.slug !== slug && (
        <Link
          to="/projects/$slug"
          params={{ slug: next.slug }}
          className="group block border-t bg-inverse text-inverse-foreground"
        >
          <div className="container-page flex items-center justify-between gap-6 py-12">
            <div>
              <p className="eyebrow text-inverse-muted">Next project</p>
              <p className="mt-2 font-display text-2xl font-semibold md:text-3xl">{next.title}</p>
            </div>
            <ArrowRight className="size-7 shrink-0 text-accent transition-transform group-hover:translate-x-1" aria-hidden />
          </div>
        </Link>
      )}
    </article>
  );
}
