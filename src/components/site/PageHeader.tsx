import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, lead }: { eyebrow: string; title: ReactNode; lead?: ReactNode }) {
  return (
    <section className="blueprint-wash border-b bg-surface">
      <div className="container-page animate-rise py-16 md:py-24">
        <p className="eyebrow flex items-center gap-3 text-accent">
          <span aria-hidden className="h-px w-8 bg-current" />
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] md:text-6xl">{title}</h1>
        {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{lead}</p>}
      </div>
    </section>
  );
}
