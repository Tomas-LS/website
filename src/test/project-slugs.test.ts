import { describe, expect, it } from "vitest";

import { projectSlugs } from "@/content/project-slugs";
import { projects } from "@/content/projects";

/**
 * vite.config.ts prerenders one HTML file per project page from projectSlugs.
 * A project missing from that list would 404 on GitHub Pages, so the two
 * lists have to stay identical.
 */
describe("project slugs used by the static build", () => {
  it("lists every project slug, and nothing extra", () => {
    expect([...projectSlugs].sort()).toEqual(projects.map((p) => p.slug).sort());
  });
});
