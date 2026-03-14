type ApiErrorPayload = {
  message?: unknown;
  error?: unknown;
  detail?: unknown;
  data?: {
    message?: unknown;
    error?: unknown;
    detail?: unknown;
  };
};

function isJsonContentType(contentType: string) {
  return contentType.includes("application/json") || contentType.includes("+json");
}

export async function parseApiResponseBody<T = unknown>(res: Response): Promise<T | string | null> {
  if (res.status === 204 || res.status === 205) return null;

  const contentType = (res.headers.get("content-type") || "").toLowerCase();

  try {
    if (isJsonContentType(contentType)) {
      return (await res.json()) as T;
    }

    const text = await res.text();
    return text || null;
  } catch {
    return null;
  }
}

export function getApiErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === "string") {
    const message = payload.trim();
    return message || fallback;
  }

  if (payload && typeof payload === "object") {
    const candidate = payload as ApiErrorPayload;
    const values = [
      candidate.message,
      candidate.error,
      candidate.detail,
      candidate.data?.message,
      candidate.data?.error,
      candidate.data?.detail,
    ];

    for (const value of values) {
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }

  return fallback;
}
