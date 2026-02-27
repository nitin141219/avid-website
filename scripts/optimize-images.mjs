import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public", "images");
const MIN_BYTES = 250 * 1024;

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
const HERO_IMAGE_BASENAMES = new Set(["banner_1", "banner_2", "banner_3"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function toKb(bytes) {
  return `${Math.round(bytes / 1024)}KB`;
}

async function optimizeOriginal(filePath, ext) {
  const originalBuffer = await fs.readFile(filePath);
  const originalSize = originalBuffer.length;
  const base = sharp(originalBuffer, { failOn: "none" }).rotate();

  let optimizedBuffer = null;

  if (ext === ".jpg" || ext === ".jpeg") {
    optimizedBuffer = await base
      .jpeg({
        quality: 72,
        mozjpeg: true,
        progressive: true,
      })
      .toBuffer();
  } else if (ext === ".png") {
    optimizedBuffer = await base
      .png({
        compressionLevel: 9,
        palette: true,
        quality: 75,
        effort: 10,
      })
      .toBuffer();
  }

  if (!optimizedBuffer) {
    return { replaced: false, before: originalSize, after: originalSize };
  }

  if (optimizedBuffer.length < originalSize * 0.95) {
    await fs.writeFile(filePath, optimizedBuffer);
    return { replaced: true, before: originalSize, after: optimizedBuffer.length };
  }

  return { replaced: false, before: originalSize, after: originalSize };
}

async function createWebp(filePath) {
  const src = await fs.readFile(filePath);
  const webpBuffer = await sharp(src, { failOn: "none" })
    .rotate()
    .webp({
      quality: 72,
      effort: 6,
      smartSubsample: true,
    })
    .toBuffer();

  const outPath = filePath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  let existingSize = Infinity;

  try {
    const stat = await fs.stat(outPath);
    existingSize = stat.size;
  } catch {
    // No existing file.
  }

  if (webpBuffer.length < existingSize * 0.95 || !Number.isFinite(existingSize)) {
    await fs.writeFile(outPath, webpBuffer);
  }

  return { path: outPath, size: webpBuffer.length };
}

async function run() {
  const files = await walk(ROOT);
  const candidates = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;

    const stat = await fs.stat(file);
    if (stat.size < MIN_BYTES) continue;
    candidates.push({ file, ext, size: stat.size });
  }

  let totalBefore = 0;
  let totalAfter = 0;
  let optimizedCount = 0;
  const heroWebp = [];

  for (const item of candidates) {
    totalBefore += item.size;

    const optimized = await optimizeOriginal(item.file, item.ext);
    totalAfter += optimized.after;
    if (optimized.replaced) optimizedCount += 1;

    const basename = path.parse(item.file).name;
    if (optimized.after >= 450 * 1024 || HERO_IMAGE_BASENAMES.has(basename)) {
      const webp = await createWebp(item.file);
      if (HERO_IMAGE_BASENAMES.has(basename)) {
        heroWebp.push(webp);
      }
    }
  }

  console.log(`Scanned: ${candidates.length} large images`);
  console.log(`Optimized in-place: ${optimizedCount}`);
  console.log(`Before: ${toKb(totalBefore)} | After: ${toKb(totalAfter)}`);
  console.log("Hero WebP files:");
  heroWebp.forEach((f) => console.log(`- ${f.path} (${toKb(f.size)})`));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
