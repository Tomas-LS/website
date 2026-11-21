import { createFileRoute, Link } from "@tanstack/react-router";
import { Accessibility, ArrowRight, Cog, HandHelping, Users } from "lucide-react";

import heroImage from "@/assets/IMG_6905.JPG";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

const description =
  "Mechanical engineer designing wheelchair adaptations, accessibility solutions and custom assistive devices for people with disabilities.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.name} — Engineering for a More Accessible World` },
      { name: "description", content: description },
      { property: "og:title", content: `${site.name} — Engineering for a More Accessible World` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const focusAreas = [
  {
    icon: Accessibility,
    title: "Wheelchair adaptations",
    body: "Mounts, trays, positioning aids and frame modifications that fit the chair and the person in it.",
  },
  {
    icon: HandHelping,
    title: "Assistive devices",
    body: "Custom mechanical tools for daily living, shaped around grip, reach and strength.",
  },
  {
    icon: Cog,
    title: "Accessibility solutions",
    body: "Ramps, access aids and environmental fixes that remove barriers in the built world.",
  },
  {
    icon: Users,
    title: "User-centred design",
    body: "Co-design with users and therapists, from first interview to field-tested prototype.",
  },
];

const processSteps = [
  { n: "01", title: "Define", body: "Understand the person, the task and the barrier." },
  { n: "02", title: "Specify", body: "Turn needs into measurable requirements." },
  { n: "03", title: "Design", body: "Concepts, CAD, analysis and material selection." },
  { n: "04", title: "Build", body: "Prototype, machine, print and assemble." },
  { n: "05", title: "Validate", body: "Test with users and iterate until it works." },
];

function HomePage() {
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
              Engineering for a More <span className="text-accent">Accessible</span> World.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">{site.intro}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/projects">
                  View projects <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Get in touch</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t pt-6">
              {[
                { v: String(projects.length), l: "Case studies" },
                { v: "2", l: "Internships" },
                { v: "15+", l: "Users involved" },
              ].map((s) => (
                <div key={s.l} className="flex flex-col-reverse gap-1">
                  <dt className="eyebrow text-[0.6rem] text-muted-foreground">{s.l}</dt>
                  <dd className="font-display text-3xl font-semibold text-primary">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-rise [animation-delay:150ms]">
            <figure className="crop-marks">
              <div className="overflow-hidden rounded-md shadow-lift">
                <img
                  src={heroImage}
                  alt="Wheelchair-mounted tray with a custom joystick control and blue ball grip"
                  width={4032}
                  height={3024}
                  fetchPriority="high"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between gap-4 text-xs text-muted-foreground">
                <span className="eyebrow text-accent">Fig. 00</span>
                <span className="font-mono">Custom wheelchair tray and joystick control</span>
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
              index="01"
              eyebrow="Specialisation"
              title={<span id="focus-heading">Mechanical design where the user comes first.</span>}
              lead="My work sits between mechanical engineering and rehabilitation — making devices that are strong, light and simple enough to use every day."
            />
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {focusAreas.map((f, i) => (
              <Reveal key={f.title} delay={i * 80} className="bg-card p-7">
                <f.icon className="size-7 text-accent" aria-hidden strokeWidth={1.6} />
                <h3 className="mt-6 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="border-y bg-surface-2 py-20 md:py-28" aria-labelledby="featured-heading">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <SectionHeading
                index="02"
                eyebrow="Selected work"
                title={<span id="featured-heading">Featured projects</span>}
                lead="Case studies from my university internships — from problem definition through fabrication and testing."
              />
            </Reveal>
            <Button asChild variant="outline">
              <Link to="/projects">
                All projects <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <ProjectCard project={p} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="blueprint-inverse bg-inverse py-20 text-inverse-foreground md:py-28" aria-labelledby="process-heading">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              inverse
              index="03"
              eyebrow="Method"
              title={<span id="process-heading">From a real barrier to a working device.</span>}
            />
          </Reveal>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-md border border-inverse-border bg-inverse-border sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 80} className="bg-inverse p-7">
                <span className="font-mono text-sm text-accent">{s.n}</span>
                <h3 className="mt-8 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-inverse-muted">{s.body}</p>
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
              <p className="eyebrow text-accent">Open to opportunities</p>
              <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight">
                Looking for a mechanical engineer in assistive technology?
              </h2>
              <p className="mt-3 text-muted-foreground">
                I'd be glad to talk about roles, projects or collaborations.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link to="/contact">Contact me</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">About me</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
