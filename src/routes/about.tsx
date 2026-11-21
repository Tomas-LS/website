import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Briefcase } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import aboutContent from "@/content/about.json";
import { site } from "@/content/site";

function getTimelineIcon(key: string) {
  switch (key) {
    case "briefcase":
      return Briefcase;
    case "graduation":
      return GraduationCap;
    default:
      throw new Error(`Unknown timeline icon "${key}".`);
  }
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: aboutContent.meta.title.replace("{name}", site.name) },
      { name: "description", content: aboutContent.meta.description.replace("{name}", site.name) },
      { property: "og:title", content: aboutContent.meta.title.replace("{name}", site.name) },
      {
        property: "og:description",
        content: aboutContent.meta.description.replace("{name}", site.name),
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={aboutContent.heading.eyebrow}
        title={aboutContent.introduction.primary}
        lead={aboutContent.introduction.secondary.replace("{name}", site.name)}
      />

      <section className="py-16 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              index={aboutContent.background.index}
              eyebrow={aboutContent.background.eyebrow}
              title={aboutContent.background.title}
            />
          </Reveal>
          <Reveal className="space-y-5 text-[1.05rem] leading-relaxed text-muted-foreground">
            {aboutContent.background.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-y bg-surface-2 py-16 md:py-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              index={aboutContent.experience.index}
              eyebrow={aboutContent.experience.eyebrow}
              title={aboutContent.experience.title}
            />
          </Reveal>
          <ol className="mt-12 space-y-4">
            {aboutContent.experience.entries.map((entry, i) => {
              const Icon = getTimelineIcon(entry.icon);
              return (
                <Reveal
                  as="li"
                  key={entry.title}
                  delay={i * 80}
                  className="grid gap-4 rounded-md border bg-card p-6 shadow-card md:grid-cols-[10rem_1fr] md:p-8"
                >
                  <div className="flex items-center gap-3 md:flex-col md:items-start">
                    <Icon className="size-5 text-accent" aria-hidden />
                    <span className="font-mono text-sm text-muted-foreground">{entry.period}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{entry.title}</h3>
                    <p className="mt-1 text-sm font-medium text-accent">{entry.organisation}</p>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{entry.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading
              index={aboutContent.interests.index}
              eyebrow={aboutContent.interests.eyebrow}
              title={aboutContent.interests.title}
            />
            <ul className="mt-8 divide-y border-y">
              {aboutContent.interests.items.map((interest) => (
                <li key={interest} className="py-4">
                  {interest}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <SectionHeading
              index={aboutContent.goals.index}
              eyebrow={aboutContent.goals.eyebrow}
              title={aboutContent.goals.title}
              lead={aboutContent.goals.lead}
            />
            <Button asChild size="lg" className="mt-8">
              <Link to="/contact">{aboutContent.goals.contactButton}</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
