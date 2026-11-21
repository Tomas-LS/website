import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import type { Plugin, ViteDevServer } from "vite";

const virtualModuleId = "virtual:content-images";
const resolvedVirtualModuleId = `\0${virtualModuleId}`;
const root = process.cwd();
const assetsDirectory = resolve(root, "src/assets");
const homeContentFile = resolve(root, "src/content/home.json");
const projectsDirectory = resolve(root, "src/content/projects");

function recordAt(value: unknown, key: string, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || !(key in value)) {
    throw new Error(`Content file "${label}" must include "${key}".`);
  }
  const record = (value as Record<string, unknown>)[key];
  if (typeof record !== "object" || record === null) {
    throw new Error(`Content field "${key}" in "${label}" must be an object.`);
  }
  return record as Record<string, unknown>;
}

export function normalizeContentImagePath(value: unknown, label: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Content image path in "${label}" must be a non-empty string.`);
  }
  const path = value.trim().replace(/\\/g, "/").replace(/^\/+/, "");
  const relativePath = path.startsWith("assets/") ? path.slice("assets/".length) : path;
  if (!relativePath || relativePath.split("/").some((part) => part === ".." || part === "")) {
    throw new Error(`Content image path "${value}" in "${label}" must stay within src/assets.`);
  }

  const filePath = resolve(assetsDirectory, relativePath);
  if (
    (filePath !== assetsDirectory && !filePath.startsWith(`${assetsDirectory}${sep}`)) ||
    !existsSync(filePath) ||
    !statSync(filePath).isFile()
  ) {
    throw new Error(`Content image "${value}" in "${label}" was not found under src/assets.`);
  }
  return relativePath;
}

function readContentImagePaths() {
  const imagePaths = new Set<string>();
  const watchFiles = [homeContentFile, projectsDirectory];
  const homeContent: unknown = JSON.parse(readFileSync(homeContentFile, "utf8"));
  const homeHero = recordAt(homeContent, "hero", homeContentFile);
  const homeImage = recordAt(homeHero, "image", homeContentFile);
  imagePaths.add(normalizeContentImagePath(homeImage["path"], homeContentFile));

  const projectFiles = readdirSync(projectsDirectory)
    .filter((file) => file.endsWith(".json"))
    .sort();
  for (const file of projectFiles) {
    const projectFile = join(projectsDirectory, file);
    watchFiles.push(projectFile);
    const project: unknown = JSON.parse(readFileSync(projectFile, "utf8"));
    const cover = recordAt(project, "cover", projectFile);
    imagePaths.add(normalizeContentImagePath(cover["path"], projectFile));

    if (typeof project !== "object" || project === null || !("gallery" in project)) {
      throw new Error(`Project content file "${projectFile}" must include a gallery array.`);
    }
    if (!Array.isArray(project.gallery)) {
      throw new Error(`Gallery in "${projectFile}" must be an array.`);
    }
    for (const [index, item] of project.gallery.entries()) {
      if (typeof item !== "object" || item === null) {
        throw new Error(`Gallery figure ${index + 1} in "${projectFile}" must be an object.`);
      }
      if ("path" in item && item.path !== undefined && item.path !== "") {
        imagePaths.add(normalizeContentImagePath(item.path, projectFile));
      }
    }
  }

  return { imagePaths: [...imagePaths], watchFiles };
}

function createVirtualModule() {
  const { imagePaths, watchFiles } = readContentImagePaths();
  const imports = imagePaths.map(
    (path, index) => `import image${index} from ${JSON.stringify(`/src/assets/${path}?url`)};`,
  );
  const entries = imagePaths.flatMap((path, index) => [
    `[${JSON.stringify(path)}, image${index}]`,
    `[${JSON.stringify(`assets/${path}`)}, image${index}]`,
  ]);
  const moduleSource = [
    ...imports,
    `const images = new Map([${entries.join(",")}]);`,
    "export function resolveContentImage(path) {",
    "  const image = images.get(path);",
    '  if (!image) throw new Error(`Content image "${path}" is not referenced by a content JSON file.`);',
    "  return image;",
    "}",
  ].join("\n");
  return { moduleSource, watchFiles };
}

function refreshVirtualModule(server: ViteDevServer) {
  const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
  if (module) server.moduleGraph.invalidateModule(module);
  server.ws.send({ type: "full-reload" });
}

export function contentImagesPlugin(): Plugin {
  return {
    name: "content-json-images",
    resolveId(id) {
      return id === virtualModuleId ? resolvedVirtualModuleId : null;
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) return null;
      const { moduleSource, watchFiles } = createVirtualModule();
      for (const file of watchFiles) this.addWatchFile(file);
      return moduleSource;
    },
    configureServer(server) {
      server.watcher.add([homeContentFile, projectsDirectory, assetsDirectory]);
      server.watcher.on("all", (event, file) => {
        const changedPath = resolve(file);
        const changedContent =
          changedPath === homeContentFile ||
          changedPath === projectsDirectory ||
          changedPath.startsWith(`${projectsDirectory}${sep}`);
        if (changedContent && (event === "add" || event === "change" || event === "unlink")) {
          refreshVirtualModule(server);
        }
      });
    },
  };
}
