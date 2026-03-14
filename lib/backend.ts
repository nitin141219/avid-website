const DEFAULT_BACKEND_FALLBACK = "https://api.avidorganics.net";

function normalizeBaseUrl(value?: string | null) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return trimmed.replace(/\/+$/, "");
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

export function getBackendBaseUrls() {
  const configured = normalizeBaseUrl(process.env.BACKEND_URL);
  const publicBackend = normalizeBaseUrl(process.env.NEXT_PUBLIC_BACKEND_URL);
  const fallback = normalizeBaseUrl(DEFAULT_BACKEND_FALLBACK);

  const bases = unique([configured, publicBackend]);
  if (!bases.includes(fallback)) {
    bases.push(fallback);
  }

  return bases;
}

export function buildBackendUrl(path: string, baseUrl?: string) {
  const normalizedPath = `/${String(path || "").replace(/^\/+/, "")}`;
  return `${normalizeBaseUrl(baseUrl)}${normalizedPath}`;
}

export async function fetchBackend(path: string, init?: RequestInit) {
  const bases = getBackendBaseUrls();
  let lastError: unknown = null;
  let lastResponse: Response | null = null;

  for (const [index, baseUrl] of bases.entries()) {
    try {
      const response = await fetch(buildBackendUrl(path, baseUrl), init);

      if ([502, 503, 504].includes(response.status) && baseUrl !== bases[bases.length - 1]) {
        console.warn(
          `[backend] ${response.status} from ${baseUrl}${path}; trying fallback backend`
        );
        lastResponse = response;
        continue;
      }

      if (index > 0) {
        console.warn(`[backend] using fallback backend ${baseUrl}${path}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (baseUrl !== bases[bases.length - 1]) {
        console.warn(`[backend] failed to reach ${baseUrl}${path}; trying fallback backend`);
      }
    }
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Unable to reach any backend for ${path}`);
}
