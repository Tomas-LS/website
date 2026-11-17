import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Briefcase } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

const description = `About ${site.name}: mechanical engineering education, internship experience in rehabilitation engineering, and professional goals in assistive technology.`;

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${site.name}` },
      { name: "description", content: description },
      { property: "og:title", content: `About — ${site.name}` },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const timeline = [
  {
    icon: Briefcase,
    period: "2025",
    title: "Mechanical Engineering Intern",
    org: "Rehabilitation Engineering Lab, University Hospital",
    body: "Designed and tested custom wheelchair adaptations with clinicians and users; produced manufacturing drawings and FEA reports.",
  },
  {
    icon: Briefcase,
    period: "2024",
    title: "Product Design Intern",
    org: "Occupational Therapy Partner Program",
    body: "Developed parametric 3D-printed assistive grips and trained therapists to customise and print them in-house.",
  },
  {
    icon: GraduationCap,
    period: "2021 – 2026",
    title: "MEng Mechanical Engineering",
    org: "University of Engineering",
    body: "Focus on mechanical design, biomechanics and product development. Final-year project in assistive mobility.",
  },
];

const interests = [
  "Rehabilitation and mobility engineering",
  "Human-centred and inclusive product design",
  "Lightweight structures and material efficiency",
  "Low-cost, locally manufacturable assistive devices",
];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About me"
        title="A mechanical engineer who designs with people, not just for them."
        lead={`I'm ${site.name}, a mechanical engineer focused on assistive technology. I enjoy the moment a device stops being a prototype and becomes part of someone's daily routine.`}
      />

      <section className="py-16 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal>
            <SectionHeading index="01" eyebrow="Biography" title="Background" />
          </Reveal>
          <Reveal className="space-y-5 text-[1.05rem] leading-relaxed text-muted-foreground">
            <p>
              My interest in accessibility began when I helped adapt a family member's wheelchair and
              realised how few products are designed around the individual. Since then I have focused my
              studies and internships on rehabilitation engineering.
            </p>
            <p>
              During my internships I worked alongside occupational therapists, clinicians and wheelchair
              users — running interviews, defining requirements, modelling in CAD, analysing parts and
              fabricating prototypes in the workshop.
            </p>
            <p>
              I care about devices that are robust, light, affordable and easy to maintain, and about
              documenting them clearly so others can build on the work.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-y bg-surface-2 py-16 md:py-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading index="02" eyebrow="Experience & education" title="Internships and studies" />
          </Reveal>
          <ol className="mt-12 space-y-4">
            {timeline.map((t, i) => (
              <Reveal
                as="li"
                key={t.title}
                delay={i * 80}
                className="grid gap-4 rounded-md border bg-card p-6 shadow-card md:grid-cols-[10rem_1fr] md:p-8"
              >
                <div className="flex items-center gap-3 md:flex-col md:items-start">
                  <t.icon className="size-5 text-accent" aria-hidden />
                  <span className="font-mono text-sm text-muted-foreground">{t.period}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{t.title}</h3>
                  <p className="mt-1 text-sm font-medium text-accent">{t.org}</p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{t.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading index="03" eyebrow="Interests" title="What I want to work on" />
            <ul className="mt-8 divide-y border-y">
              {interests.map((i) => (
                <li key={i} className="py-4">{i}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <SectionHeading
              index="04"
              eyebrow="Goals"
              title="Professional goals"
              lead="I'm looking to join a product development or rehabilitation engineering team where I can take assistive devices from user research through to manufacture — and keep learning from the people who use them."
            />
            <Button asChild size="lg" className="mt-8">
              <Link to="/contact">Get in touch</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
