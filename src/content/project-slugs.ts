import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const projectsDirectory = resolve(process.cwd(), "src/content/projects");

export const projectSlugs = readdirSync(projectsDirectory)
  .filter((file) => file.endsWith(".json"))
  .map((file) => {
    const projectPath = join(projectsDirectory, file);
    const content: unknown = JSON.parse(readFileSync(projectPath, "utf8"));
    if (
      typeof content !== "object" ||
      content === null ||
      !("slug" in content) ||
      typeof content.slug !== "string" ||
      content.slug.length === 0 ||
      !("order" in content) ||
      typeof content.order !== "number" ||
      !Number.isFinite(content.order)
    ) {
      throw new Error(
        `Project content file "${file}" must contain a non-empty slug and numeric order.`,
      );
    }
    return { slug: content.slug, order: content.order };
  })
  .sort((a, b) => a.order - b.order)
  .map(({ slug }) => slug);
