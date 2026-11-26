import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

import projectsContent from "@/content/projects-page.json";
import type { Project } from "@/content/projects";
import { formatTemplate } from "@/lib/format-template";

export function HumanStory({
  number,
  title,
  story,
}: {
  number: string;
  title: string;
  story: Project["humanStory"];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const detailId = useId();
  const labels = projectsContent.detail.interactionLabels.humanStory;
  const actionLabel = isOpen ? labels.readLess : labels.readMore;
  const accessibleLabel = formatTemplate(
    isOpen ? labels.readLessAccessibleLabel : labels.readMoreAccessibleLabel,
    { title },
  );

  return (
    <section className="grid gap-4 border-t py-10 md:grid-cols-[14rem_1fr] md:gap-10 md:py-14">
      <h2 className="flex items-baseline gap-3 text-xl font-semibold">
        <span className="font-mono text-sm text-accent">{number}</span>
        {title}
      </h2>
      <div className="max-w-2xl text-[1.05rem] leading-relaxed text-muted-foreground">
        <p>{story.abstract}</p>
        <div
          id={detailId}
          className="story-disclosure"
          data-open={isOpen}
          aria-hidden={!isOpen}
          inert={!isOpen}
        >
          <div className="min-h-0 overflow-hidden">
            <p className="pt-4">{story.detail}</p>
          </div>
        </div>
        <button
          type="button"
          className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-accent hover:text-foreground"
          aria-expanded={isOpen}
          aria-controls={detailId}
          aria-label={accessibleLabel}
          onClick={() => setIsOpen((open) => !open)}
        >
          {actionLabel}
          <ChevronDown
            className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
      </div>
    </section>
  );
}
