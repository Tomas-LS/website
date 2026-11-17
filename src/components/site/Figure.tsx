import { Box, PenTool, Ruler, Camera } from "lucide-react";

import type { GalleryItem } from "@/content/projects";
import { cn } from "@/lib/utils";

const kindLabel = { photo: "Photograph", cad: "CAD", drawing: "Drawing", test: "Testing" } as const;
const kindIcon = { photo: Camera, cad: Box, drawing: PenTool, test: Ruler } as const;

/** One gallery image with caption. Items without `src` show a labelled placeholder frame. */
export function Figure({ item, index, className }: { item: GalleryItem; index: number; className?: string }) {
  const Icon = kindIcon[item.kind];
  return (
    <figure className={cn("group", className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border bg-muted">
        {item.src ? (
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            width={1408}
            height={1008}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="blueprint flex size-full flex-col items-center justify-center gap-3 text-muted-foreground" role="img" aria-label={item.alt}>
            <Icon className="size-8 text-accent" aria-hidden />
            <span className="eyebrow">{kindLabel[item.kind]} — coming soon</span>
          </div>
        )}
      </div>
      <figcaption className="mt-3 flex gap-3 text-sm">
        <span className="eyebrow shrink-0 pt-0.5 text-accent">Fig. {String(index + 1).padStart(2, "0")}</span>
        <span className="text-muted-foreground">{item.caption}</span>
      </figcaption>
    </figure>
  );
}
