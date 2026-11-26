import { useState } from "react";
import { Box, Camera, PenTool, RotateCw, Ruler } from "lucide-react";

import projectsContent from "@/content/projects-page.json";
import type { GalleryItem } from "@/content/projects";
import { formatTemplate } from "@/lib/format-template";
import { cn } from "@/lib/utils";

const kindIcon = { photo: Camera, cad: Box, drawing: PenTool, test: Ruler } as const;

/** One gallery image with a flip-to-read back. Items without `src` show a labelled placeholder. */
export function Figure({ item, className }: { item: GalleryItem; className?: string }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = kindIcon[item.kind];
  const kindLabel = projectsContent.detail.figureKinds[item.kind];
  const labels = projectsContent.detail.interactionLabels.gallery;
  const accessibleLabel = formatTemplate(
    isFlipped ? labels.showImageAccessibleLabelTemplate : labels.showDetailsAccessibleLabelTemplate,
    {
      figurePrefix: projectsContent.card.figurePrefix,
      figure: item.figure,
      caption: item.caption,
      alt: item.alt,
    },
  );

  return (
    <figure className={cn("group", className)}>
      <div
        className="figure-flip group/figure relative block aspect-[4/3] w-full rounded-md"
        data-flipped={isFlipped}
      >
        <button
          type="button"
          className="figure-flip-button absolute inset-0 rounded-md text-left focus-visible:outline"
          aria-label={accessibleLabel}
          aria-pressed={isFlipped}
          onClick={() => setIsFlipped((flipped) => !flipped)}
        >
          <span className="figure-flip-inner">
            <span
              className="figure-flip-face overflow-hidden rounded-md border bg-muted shadow-card"
              aria-hidden={isFlipped}
            >
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  width={1408}
                  height={1008}
                  className="size-full object-cover transition-transform duration-700 group-hover/figure:scale-[1.02]"
                />
              ) : (
                <span
                  className="blueprint flex size-full flex-col items-center justify-center gap-3 text-muted-foreground"
                  role="img"
                  aria-label={item.alt}
                >
                  <Icon className="size-8 text-accent" aria-hidden />
                  <span className="eyebrow">
                    {kindLabel} — {projectsContent.detail.placeholderSuffix}
                  </span>
                </span>
              )}
            </span>
            <span
              className="figure-flip-face figure-flip-back flex items-center justify-center overflow-hidden rounded-md border bg-surface p-5 text-center sm:p-8"
              aria-hidden={!isFlipped}
            >
              <span className="max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.backText}
              </span>
            </span>
          </span>
        </button>
        <span className="pointer-events-none absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-sm border bg-card/90 px-2 py-1 text-foreground shadow-sm">
          <RotateCw className="size-3" aria-hidden />
          {isFlipped ? (
            <>
              <span className="eyebrow hidden text-[0.58rem] sm:inline">{labels.flipBack}</span>
              <span className="eyebrow text-[0.58rem] sm:hidden">{labels.tapToReturn}</span>
            </>
          ) : (
            <>
              <span className="eyebrow hidden text-[0.58rem] sm:inline">
                {labels.flipForDetails}
              </span>
              <span className="eyebrow text-[0.58rem] sm:hidden">{labels.tapForDetails}</span>
            </>
          )}
        </span>
      </div>
      <figcaption className="mt-3 flex gap-3 text-sm">
        <span className="eyebrow shrink-0 pt-0.5 text-accent">
          {projectsContent.card.figurePrefix} {item.figure}
        </span>
        <span className="text-muted-foreground">{item.caption}</span>
      </figcaption>
    </figure>
  );
}
