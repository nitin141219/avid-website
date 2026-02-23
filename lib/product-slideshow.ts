import "server-only";

import { readdir } from "fs/promises";
import path from "path";

const SLIDESHOW_ROOT_PATH = path.join(
  process.cwd(),
  "public",
  "images",
  "product",
  "Product Slide Show"
);

const VALID_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function normalizeValue(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function toPublicSlideshowPath(folderName: string, fileName: string): string {
  return `/images/product/Product%20Slide%20Show/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`;
}

function scoreFolderMatch(folderName: string, candidates: string[]): number {
  const normalizedFolder = normalizeValue(folderName);
  if (!normalizedFolder) return 0;

  let bestScore = 0;

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeValue(candidate);
    if (!normalizedCandidate) continue;

    let score = 0;

    if (normalizedFolder === normalizedCandidate) {
      score += 100;
    }

    if (normalizedFolder.includes(normalizedCandidate) || normalizedCandidate.includes(normalizedFolder)) {
      score += 70;
      score -= Math.abs(normalizedFolder.length - normalizedCandidate.length);
    }

    const folderTokens = new Set(normalizedFolder.split(" ").filter(Boolean));
    const candidateTokens = new Set(normalizedCandidate.split(" ").filter(Boolean));
    let sharedTokenCount = 0;

    for (const token of candidateTokens) {
      if (folderTokens.has(token)) {
        sharedTokenCount += 1;
      }
    }

    if (sharedTokenCount > 0) {
      score += sharedTokenCount * 10;
    }

    bestScore = Math.max(bestScore, score);
  }

  return bestScore;
}

function fallbackAsArray(fallbackImage?: string): string[] {
  return fallbackImage ? [fallbackImage] : [];
}

export async function resolveProductSlideshowImages({
  slug,
  productName,
  fallbackImage,
}: {
  slug: string;
  productName?: string;
  fallbackImage?: string;
}): Promise<string[]> {
  const candidates = [slug.replace(/-/g, " "), productName || ""].filter(Boolean);

  try {
    const rootEntries = await readdir(SLIDESHOW_ROOT_PATH, { withFileTypes: true });
    const folderNames = rootEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

    if (folderNames.length === 0) {
      return fallbackAsArray(fallbackImage);
    }

    let bestFolder: string | null = null;
    let bestScore = 0;

    for (const folderName of folderNames) {
      const score = scoreFolderMatch(folderName, candidates);
      if (score > bestScore) {
        bestScore = score;
        bestFolder = folderName;
      }
    }

    if (!bestFolder || bestScore <= 0) {
      return fallbackAsArray(fallbackImage);
    }

    const folderPath = path.join(SLIDESHOW_ROOT_PATH, bestFolder);
    const imageFiles = (await readdir(folderPath, { withFileTypes: true }))
      .filter((entry) => {
        if (!entry.isFile()) return false;
        return VALID_IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase());
      })
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

    if (imageFiles.length === 0) {
      return fallbackAsArray(fallbackImage);
    }

    return imageFiles.map((fileName) => toPublicSlideshowPath(bestFolder, fileName));
  } catch {
    return fallbackAsArray(fallbackImage);
  }
}
