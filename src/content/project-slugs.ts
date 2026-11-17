/**
 * Project page slugs, kept here so the static build (vite.config.ts) can
 * prerender every case-study page without importing the image assets that
 * src/content/projects.ts pulls in.
 *
 * Keep this list in step with the `slug` values in src/content/projects.ts —
 * src/test/project-slugs.test.ts fails the build check if they drift apart.
 */
export const projectSlugs = [
  "modular-wheelchair-tray-mount",
  "adaptive-grip-system",
  "portable-folding-ramp",
] as const;
