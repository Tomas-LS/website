import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { projectSlugs } from "./src/content/project-slugs";

/**
 * Static export for GitHub Pages.
 *
 * BASE_PATH is the sub-path the site is served from: "/<repo-name>/" for a
 * project site, "/" for a user/org site or a connected custom domain.
 */
const staticExport = process.env["STATIC_EXPORT"] === "1";
const basePath = process.env["BASE_PATH"] ?? "/";

/** Explicit routes include dynamic project case studies in the static export. */
const pages = [
  { path: "/" },
  { path: "/projects" },
  { path: "/about" },
  { path: "/skills" },
  { path: "/contact" },
  ...projectSlugs.map((slug) => ({ path: `/projects/${slug}` })),
];

export default defineConfig({
  base: basePath,
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart({
      ...(staticExport
        ? {
            pages,
            prerender: {
              enabled: true,
              autoStaticPathsDiscovery: false,
              crawlLinks: false,
            },
          }
        : {}),
    }),
    react(),
    tailwindcss(),
  ],
});
