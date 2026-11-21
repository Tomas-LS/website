import { resolveContentImage as resolveImage } from "virtual:content-images";

export function resolveContentImage(path: string) {
  return resolveImage(path);
}
