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
  backText: string;
  kind: GalleryKind;
};

export type ProcessStepNode = {
  id?: string;
  type: "step";
  title: string;
  body: string;
  next?: string;
};

export type ProcessDecisionNode = {
  id?: string;
  type: "decision";
  title: string;
  body: string;
  branches: { label: string; destination: string }[];
};

export type ProcessNode = ProcessStepNode | ProcessDecisionNode;

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
  humanStory: { abstract: string; detail: string };
  processFlow: ProcessNode[];
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
  .map((project) => {
    const processFlow = prepareProcessNodes(project.processFlow, project.title);
    getProcessConnections(processFlow, project.title);

    return {
      ...project,
      processFlow,
      cover: {
        src: resolveContentImage(project.cover.path),
        alt: project.cover.alt,
      },
      gallery: project.gallery.map(({ path, ...item }) => ({
        ...item,
        ...(path ? { src: resolveContentImage(path) } : {}),
      })),
    };
  });

export type ProcessConnection = {
  source: string;
  destination: string;
  kind: "sequence" | "jump" | "branch";
  label?: string;
  branchIndex?: number;
  branchCount?: number;
};

export function slugifyProcessTitle(title: string) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTitleReference(title: string) {
  return slugifyProcessTitle(title);
}

export function prepareProcessNodes(nodes: ProcessNode[], projectTitle = "Project"): ProcessNode[] {
  const titleCounts = new Map<string, number>();
  const generatedIds = new Map<string, string>();

  return nodes.map((node) => {
    const normalizedTitle = normalizeTitleReference(node.title);
    const baseId = slugifyProcessTitle(node.title);
    if (!baseId) {
      throw new Error(`${projectTitle}: process node titles must generate a non-empty ID.`);
    }
    const occurrence = (titleCounts.get(normalizedTitle) ?? 0) + 1;
    titleCounts.set(normalizedTitle, occurrence);
    const id = occurrence === 1 ? baseId : `${baseId}-${occurrence}`;
    if (generatedIds.has(id)) {
      throw new Error(`${projectTitle}: generated process node ID "${id}" is ambiguous.`);
    }
    generatedIds.set(id, node.title);
    return { ...node, id };
  });
}

export function resolveProcessDestination(
  nodes: ProcessNode[],
  reference: string,
  projectTitle = "Project",
): ProcessNode {
  const trimmed = reference.trim();
  if (!trimmed) {
    throw new Error(`${projectTitle}: process destinations cannot be empty.`);
  }

  if (/^\d+$/.test(trimmed)) {
    const position = Number(trimmed);
    if (position >= 1 && position <= nodes.length) return nodes[position - 1]!;
    throw new Error(
      `${projectTitle}: process destination "${trimmed}" is outside node positions 1-${nodes.length}.`,
    );
  }

  const idMatches = nodes.filter((node) => node.id === trimmed);
  if (idMatches.length === 1) return idMatches[0]!;
  if (idMatches.length > 1) {
    throw new Error(`${projectTitle}: process destination "${trimmed}" matches multiple IDs.`);
  }

  const titleGroups = new Map<string, { normalizedTitle: string; nodes: ProcessNode[] }>();
  nodes.forEach((node) => {
    const normalizedTitle = normalizeTitleReference(node.title);
    const group = titleGroups.get(normalizedTitle);
    if (group) group.nodes.push(node);
    else titleGroups.set(normalizedTitle, { normalizedTitle, nodes: [node] });
  });

  const referenceNormalized = normalizeTitleReference(trimmed);
  const exactTitleMatch = titleGroups.get(referenceNormalized);
  if (exactTitleMatch) {
    if (exactTitleMatch.nodes.length === 1) return exactTitleMatch.nodes[0]!;
  }

  const occurrenceMatch = trimmed.match(/^(.+?)[\s_-]*(\d+)$/);
  if (occurrenceMatch) {
    const baseTitle = normalizeTitleReference(occurrenceMatch[1]!);
    const occurrence = Number(occurrenceMatch[2]);
    const group = titleGroups.get(baseTitle);
    if (group && occurrence >= 1 && occurrence <= group.nodes.length) {
      return group.nodes[occurrence - 1]!;
    }
  }

  for (const [baseTitle, group] of titleGroups) {
    if (referenceNormalized === `${baseTitle}-${2}` || referenceNormalized === `${baseTitle}${2}`) {
      return group.nodes[1]!;
    }
  }

  if (exactTitleMatch) return exactTitleMatch.nodes[0]!;

  throw new Error(
    `${projectTitle}: process destination "${trimmed}" is unresolved (use an ID, title, or 1-based position).`,
  );
}

export function getProcessConnections(
  nodes: ProcessNode[],
  projectTitle = "Project",
): ProcessConnection[] {
  const preparedNodes = prepareProcessNodes(nodes, projectTitle);
  const nodeIds = new Set(preparedNodes.map((node) => node.id));
  if (nodeIds.size !== preparedNodes.length) {
    throw new Error(`${projectTitle}: process node IDs must be unique.`);
  }

  const connections: ProcessConnection[] = [];
  preparedNodes.forEach((node, index) => {
    if (node.type === "step") {
      const destinationReference = node.next ?? preparedNodes[index + 1]?.id;
      const destination = destinationReference
        ? resolveProcessDestination(preparedNodes, destinationReference, projectTitle).id
        : undefined;
      if (destination) {
        if (!nodeIds.has(destination)) {
          throw new Error(
            `${projectTitle}: process step "${node.id}" targets missing node "${destination}".`,
          );
        }
        connections.push({
          source: node.id!,
          destination,
          kind: node.next ? "jump" : "sequence",
        });
      }
      return;
    }

    if (node.branches.length > 3) {
      throw new Error(
        `${projectTitle}: decision "${node.id}" cannot have more than three branches.`,
      );
    }

    node.branches.forEach(({ label, destination }, branchIndex) => {
      if (!label.trim()) {
        throw new Error(`${projectTitle}: branches on "${node.id}" need a label.`);
      }
      const resolvedDestination = resolveProcessDestination(
        preparedNodes,
        destination,
        projectTitle,
      );
      connections.push({
        source: node.id!,
        destination: resolvedDestination.id!,
        kind: "branch",
        label,
        branchIndex,
        branchCount: node.branches.length,
      });
    });
  });

  return connections;
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
