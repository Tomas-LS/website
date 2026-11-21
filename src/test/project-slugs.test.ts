import { describe, expect, it } from "vitest";

import { projectSlugs } from "@/content/project-slugs";
import { projects } from "@/content/projects";

/**
 * vite.config.ts discovers project slugs directly from the individual JSON
 * files, and the client loader discovers those same files via import.meta.glob.
 */
describe("project slugs used by the static build", () => {
  it("lists every project slug, and nothing extra", () => {
    expect([...projectSlugs].sort()).toEqual(projects.map((p) => p.slug).sort());
  });
});
