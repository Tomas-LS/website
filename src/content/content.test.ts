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

const projectContentFiles = import.meta.glob<{
  cover: { path: string };
  gallery: { path?: string }[];
}>("./projects/*.json", { eager: true, import: "default" });

function assertSourceAssetExists(path: string) {
  const assetPath = path
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/^assets\//, "");
  expect(existsSync(resolve(process.cwd(), "src/assets", assetPath))).toBe(true);
}

describe("editable page content", () => {
  it("loads each project JSON in display order and preserves numbered image placeholders", () => {
    expect(projects.map((project) => project.slug)).toEqual(projectSlugs);
    expect(projects[0]?.title).toBe("Modular Wheelchair Tray and Armrest Mount");
    expect(projects[0]?.year).toBe("2025");
    expect(projects[0]?.gallery.map((figure) => figure.figure)).toEqual(["01", "02", "03", "04"]);
    expect(projects[0]?.gallery[2]?.src).toBeUndefined();
    for (const project of projects) {
      for (const figure of project.gallery) {
        if (figure.src) expect(figure.src).toBeTruthy();
      }
    }
    const imagePaths = [
      homeContent.hero.image.path,
      ...Object.values(projectContentFiles).flatMap((project) => [
        project.cover.path,
        ...project.gallery.flatMap((figure) => (figure.path ? [figure.path] : [])),
      ]),
    ];
    for (const path of imagePaths) assertSourceAssetExists(path);
  });

  it("keeps the requested hero caption and page copy in valid JSON content", () => {
    expect(homeContent.hero.image.caption).toBe("Custom flip-over joystick and flat-switch mount");
    expect(resolveContentImage(homeContent.hero.image.path)).toContain("IMG_6905");
    expect(normalizeContentImagePath("Extras/IMG_6905 - Copy.JPG", "test")).toBe(
      "Extras/IMG_6905 - Copy.JPG",
    );
    expect(aboutContent.background.paragraphs).toHaveLength(3);
    expect(skillsContent.groups).toHaveLength(4);
    expect(contactContent.form.fields.message.maxLength).toBe(2000);
    expect(projectsPageContent.detail.sections.gallery.title).toBe("Gallery, CAD & drawings");
  });
});
