import { Link } from "@tanstack/react-router";

/**
 * The page a visitor sees for a URL the site doesn't serve.
 *
 * Rendered by the router's notFoundComponent for unknown in-app paths, and
 * prerendered to 404.html for GitHub Pages (src/routes/404.tsx).
 */
export function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-20">
      <div className="max-w-md text-center">
        <p className="eyebrow flex items-center justify-center gap-3 text-accent">
          <span aria-hidden className="h-px w-8 bg-current" />
          Error 404
          <span aria-hidden className="h-px w-8 bg-current" />
        </p>
        <h1 className="mt-5 text-6xl font-semibold tracking-tight text-foreground">Not found</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          This page doesn&apos;t exist or has moved. The projects and contact pages are still
          reachable from here.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Browse projects
          </Link>
        </div>
      </div>
    </div>
  );
}
