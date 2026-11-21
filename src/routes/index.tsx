import { createFileRoute, Link } from "@tanstack/react-router";
import { Accessibility, ArrowRight, Cog, HandHelping, Users } from "lucide-react";

import homeContent from "@/content/home.json";
import { resolveContentImage } from "@/content/image-paths";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

function getFocusIcon(key: string) {
  switch (key) {
    case "accessibility":
      return Accessibility;
    case "helping":
      return HandHelping;
    case "cog":
      return Cog;
    case "users":
      return Users;
    default:
      throw new Error(`Unknown homepage focus-area icon "${key}".`);
  }
}

const heroImage = resolveContentImage(homeContent.hero.image.path);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: homeContent.meta.title.replace("{name}", site.name) },
      { name: "description", content: homeContent.meta.description },
      { property: "og:title", content: homeContent.meta.title.replace("{name}", site.name) },
      { property: "og:description", content: homeContent.meta.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

export function HomePage() {
  return (
    <>
      {/* Intro */}
      <section className="blueprint-wash relative overflow-hidden border-b bg-surface">
        <div className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-28">
          <div className="animate-rise">
            <p className="eyebrow flex items-center gap-3 text-accent">
              <span aria-hidden className="h-px w-8 bg-current" />
              {site.title} · {site.specialization}
            </p>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.04] sm:text-6xl lg:text-[4.4rem]">
              {homeContent.hero.titleParts.prefix}
              <span className="text-accent">{homeContent.hero.titleParts.emphasis}</span>
              {homeContent.hero.titleParts.suffix}
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {homeContent.intro}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/projects">
                  {homeContent.hero.projectsButton} <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">{homeContent.hero.contactButton}</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t pt-6">
              {homeContent.hero.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse gap-1">
                  <dt className="eyebrow text-[0.6rem] text-muted-foreground">{stat.label}</dt>
                  <dd className="font-display text-3xl font-semibold text-primary">
                    {stat.value.replace("{projectCount}", String(projects.length))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-rise [animation-delay:150ms]">
            <figure className="crop-marks">
              <div className="overflow-hidden rounded-md shadow-lift">
                <img
                  src={heroImage}
                  alt={homeContent.hero.image.alt}
                  width={homeContent.hero.image.width}
                  height={homeContent.hero.image.height}
                  fetchPriority="high"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between gap-4 text-xs text-muted-foreground">
                <span className="eyebrow text-accent">Fig. {homeContent.hero.image.figure}</span>
                <span className="font-mono">{homeContent.hero.image.caption}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Specialisation */}
      <section className="bg-card py-20 md:py-28" aria-labelledby="focus-heading">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              index={homeContent.specialisation.index}
              eyebrow={homeContent.specialisation.eyebrow}
              title={<span id="focus-heading">{homeContent.specialisation.title}</span>}
              lead={homeContent.specialisation.lead}
            />
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {homeContent.specialisation.areas.map((area, i) => {
              const Icon = getFocusIcon(area.icon);
              return (
                <Reveal key={area.title} delay={i * 80} className="bg-card p-7">
                  <Icon className="size-7 text-accent" aria-hidden strokeWidth={1.6} />
                  <h3 className="mt-6 text-lg font-semibold">{area.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{area.body}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="border-y bg-surface-2 py-20 md:py-28" aria-labelledby="featured-heading">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <SectionHeading
                index={homeContent.featuredProjects.index}
                eyebrow={homeContent.featuredProjects.eyebrow}
                title={<span id="featured-heading">{homeContent.featuredProjects.title}</span>}
                lead={homeContent.featuredProjects.lead}
              />
            </Reveal>
            <Button asChild variant="outline">
              <Link to="/projects">
                {homeContent.featuredProjects.allProjectsButton} <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section
        className="blueprint-inverse bg-inverse py-20 text-inverse-foreground md:py-28"
        aria-labelledby="process-heading"
      >
        <div className="container-page">
          <Reveal>
            <SectionHeading
              inverse
              index={homeContent.process.index}
              eyebrow={homeContent.process.eyebrow}
              title={<span id="process-heading">{homeContent.process.title}</span>}
            />
          </Reveal>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-md border border-inverse-border bg-inverse-border sm:grid-cols-2 lg:grid-cols-5">
            {homeContent.process.steps.map((step, i) => (
              <Reveal as="li" key={step.number} delay={i * 80} className="bg-inverse p-7">
                <span className="font-mono text-sm text-accent">{step.number}</span>
                <h3 className="mt-8 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-inverse-muted">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Contact band */}
      <section className="bg-surface py-20 md:py-28">
        <Reveal className="container-page">
          <div className="flex flex-col items-start justify-between gap-8 rounded-md border bg-card p-8 shadow-card md:flex-row md:items-center md:p-12">
            <div>
              <p className="eyebrow text-accent">{homeContent.contactBand.eyebrow}</p>
              <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight">
                {homeContent.contactBand.title}
              </h2>
              <p className="mt-3 text-muted-foreground">{homeContent.contactBand.body}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link to="/contact">{homeContent.contactBand.contactButton}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">{homeContent.contactBand.aboutButton}</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
