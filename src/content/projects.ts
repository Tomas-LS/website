import { resolveContentImage } from "./image-paths";

type GalleryKind = "photo" | "cad" | "drawing" | "test";

type ProjectImage = {
  path: string;
  alt: string;
};

type ProjectGalleryItem = {
  figure: string;
  path?: string;
  alt: string;
  caption: string;
  kind: GalleryKind;
};

type ProjectData = {
  order: number;
  slug: string;
  title: string;
  summary: string;
  category: string;
  year: string;
  role: string;
  duration: string;
  context: string;
  tools: string[];
  cover: ProjectImage;
  metrics: { value: string; label: string }[];
  problem: string;
  requirements: string[];
  approach: string;
  process: { title: string; body: string }[];
  fabrication: string;
  outcome: string;
  gallery: ProjectGalleryItem[];
};

export type GalleryItem = Omit<ProjectGalleryItem, "path"> & { src?: string };
export type Project = Omit<ProjectData, "cover" | "gallery"> & {
  cover: { src: string; alt: string };
  gallery: GalleryItem[];
};

const projectFiles = import.meta.glob<ProjectData>("./projects/*.json", {
  eager: true,
  import: "default",
});

export const projects: Project[] = Object.values(projectFiles)
  .sort((a, b) => a.order - b.order)
  .map((project) => ({
    ...project,
    cover: {
      src: resolveContentImage(project.cover.path),
      alt: project.cover.alt,
    },
    gallery: project.gallery.map(({ path, ...item }) => ({
      ...item,
      ...(path ? { src: resolveContentImage(path) } : {}),
    })),
  }));

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
