import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import aboutContent from "./about.json";
import contactContent from "./contact.json";
import homeContent from "./home.json";
import projectsPageContent from "./projects-page.json";
import skillsContent from "./skills-tools.json";
import { projectSlugs } from "./project-slugs";
import { projects } from "./projects";
import { resolveContentImage } from "./image-paths";
import { normalizeContentImagePath } from "../../vite-content-images";
import type { Project } from "./projects";

type ProjectContentFile = Omit<Project, "cover" | "gallery"> & {
  cover: { path: string; alt: string };
  gallery: (Omit<Project["gallery"][number], "src"> & { path?: string })[];
};

const projectContentFiles = import.meta.glob<ProjectContentFile>("./projects/*.json", {
  eager: true,
  import: "default",
});

function assertSourceAssetExists(path: string) {
  const assetPath = path
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/^assets\//, "");
  expect(existsSync(resolve(process.cwd(), "src/assets", assetPath))).toBe(true);
}

describe("editable page content", () => {
  it("discovers project slugs from every project file in configured order", () => {
    const expectedSlugs = Object.values(projectContentFiles)
      .sort((a, b) => a.order - b.order)
      .map((project) => project.slug);

    expect(projectSlugs).toEqual(expectedSlugs);
    expect(projects.map((project) => project.slug)).toEqual(expectedSlugs);
  });

  it("preserves project data, configured order, and optional gallery images", () => {
    const expectedProjects = Object.values(projectContentFiles)
      .sort((a, b) => a.order - b.order)
      .map(({ cover, gallery, ...project }) => ({
        ...project,
        cover: { src: resolveContentImage(cover.path), alt: cover.alt },
        gallery: gallery.map(({ path, ...figure }) => ({
          ...figure,
          ...(path ? { src: resolveContentImage(path) } : {}),
        })),
      }));

    expect(projects).toEqual(expectedProjects);

    const imagePaths = [
      homeContent.hero.image.path,
      ...Object.values(projectContentFiles).flatMap((project) => [
        project.cover.path,
        ...project.gallery.flatMap((figure) => (figure.path ? [figure.path] : [])),
      ]),
    ];
    for (const path of imagePaths) assertSourceAssetExists(path);
  });

  it("keeps shared page content in valid JSON content", () => {
    const heroImagePath = homeContent.hero.image.path
      .replace(/\\/g, "/")
      .replace(/^\/+/, "")
      .replace(/^assets\//, "");

    expect(homeContent.hero.image.caption).toBeTruthy();
    expect(resolveContentImage(homeContent.hero.image.path)).toBeTruthy();
    expect(normalizeContentImagePath(`/assets/${heroImagePath}`, "home")).toBe(heroImagePath);
    expect(aboutContent.background.paragraphs).toHaveLength(3);
    expect(skillsContent.groups).toHaveLength(4);
    expect(contactContent.form.fields.message.maxLength).toBe(2000);
    expect(projectsPageContent.detail.sections.gallery.title).toBe("Gallery, CAD & drawings");
  });
});
