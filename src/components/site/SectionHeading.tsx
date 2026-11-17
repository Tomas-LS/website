import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  inverse?: boolean;
  className?: string;
};

export function SectionHeading({ index, eyebrow, title, lead, inverse, className }: Props) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className={cn("eyebrow flex items-center gap-3", inverse ? "text-accent-soft" : "text-accent")}>
        {index && <span>{index}</span>}
        <span aria-hidden className="h-px w-8 bg-current opacity-60" />
        <span>{eyebrow}</span>
      </p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-[2.6rem]">{title}</h2>
      {lead && (
        <p className={cn("mt-5 text-lg leading-relaxed", inverse ? "text-inverse-muted" : "text-muted-foreground")}>
          {lead}
        </p>
      )}
    </div>
  );
}
