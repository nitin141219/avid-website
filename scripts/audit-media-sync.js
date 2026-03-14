import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const backendRoot =
  process.env.AVID_BACKEND_ROOT || path.resolve(ROOT, "..", "Avid_Web_API");
const backendUploadsRoot = path.join(backendRoot, "src", "uploads");

const defaultBaseUrl =
  process.env.AUDIT_API_BASE_URL ||
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://api.avidorganics.net";

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Request failed ${res.status} for ${url}`);
  }
  return res.json();
}

function getFileNameFromUrl(value) {
  if (!value) return "";
  try {
    const parsed = new URL(String(value));
    return path.basename(parsed.pathname);
  } catch {
    return path.basename(String(value));
  }
}

function listFiles(dir) {
  try {
    return new Set(fs.readdirSync(dir));
  } catch {
    return new Set();
  }
}

function printSection(title) {
  console.log(`\n${title}`);
  console.log("-".repeat(title.length));
}

function printResult(label, items) {
  if (items.length === 0) {
    console.log(`${label}: OK`);
    return;
  }

  console.log(`${label}: ${items.length}`);
  items.forEach((item) => console.log(`  - ${item}`));
}

async function main() {
  const eventFiles = listFiles(path.join(backendUploadsRoot, "event"));
  const newsFiles = listFiles(path.join(backendUploadsRoot, "news"));
  const documentFiles = listFiles(path.join(backendUploadsRoot, "document"));

  const [eventsJson, newsJson, documentsJson, spotlightJson] = await Promise.all([
    fetchJson(`${defaultBaseUrl}/api/v1/customer/get-events?limit=100&page=1&locale=en`),
    fetchJson(`${defaultBaseUrl}/api/v1/customer/get-news?limit=100&page=1&locale=en`),
    fetchJson(`${defaultBaseUrl}/api/v1/customer/get-document`),
    fetchJson(`${defaultBaseUrl}/api/v1/get-spotlight`),
  ]);

  const events = eventsJson?.data?.events || [];
  const news = newsJson?.data?.news || [];
  const documentsByCategory = documentsJson?.data || {};
  const spotlightItems = spotlightJson?.data || [];

  const missingEventImages = events
    .map((item) => ({
      slug: item.slug,
      file: getFileNameFromUrl(item.image),
    }))
    .filter((item) => item.file && !eventFiles.has(item.file))
    .map((item) => `${item.slug} -> ${item.file}`);

  const missingEventIcs = events
    .map((item) => ({
      slug: item.slug,
      file: getFileNameFromUrl(item.ics),
    }))
    .filter((item) => item.file && !eventFiles.has(item.file))
    .map((item) => `${item.slug} -> ${item.file}`);

  const missingNewsImages = news
    .map((item) => ({
      slug: item.slug,
      file: getFileNameFromUrl(item.image),
    }))
    .filter((item) => item.file && !newsFiles.has(item.file))
    .map((item) => `${item.slug} -> ${item.file}`);

  const allDocuments = Object.values(documentsByCategory).flat();
  const missingDocumentFiles = [];

  for (const document of allDocuments) {
    try {
      const detail = await fetchJson(`${defaultBaseUrl}/api/v1/get-document/${document.slug}`);
      const file = getFileNameFromUrl(detail?.data?.url);
      if (file && !documentFiles.has(file)) {
        missingDocumentFiles.push(`${document.slug} -> ${file}`);
      }
    } catch (error) {
      missingDocumentFiles.push(`${document.slug} -> detail lookup failed`);
    }
  }

  const spotlightMismatches = spotlightItems
    .map((item) => ({
      slug: item.slug,
      file: getFileNameFromUrl(item.image),
    }))
    .filter((item) => item.file && !eventFiles.has(item.file) && !newsFiles.has(item.file))
    .map((item) => `${item.slug} -> ${item.file}`);

  printSection("Audit Summary");
  console.log(`API base: ${defaultBaseUrl}`);
  console.log(`Backend uploads: ${backendUploadsRoot}`);
  console.log(`Events: ${events.length}`);
  console.log(`News: ${news.length}`);
  console.log(`Documents: ${allDocuments.length}`);
  console.log(`Spotlights: ${spotlightItems.length}`);

  printSection("Missing Files");
  printResult("Event images missing from uploads/event", missingEventImages);
  printResult("Event ICS files missing from uploads/event", missingEventIcs);
  printResult("News images missing from uploads/news", missingNewsImages);
  printResult("Documents missing from uploads/document", missingDocumentFiles);
  printResult("Spotlight files missing from uploads", spotlightMismatches);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
