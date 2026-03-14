import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getApiErrorMessage, parseApiResponseBody } from "@/lib/api-response";
import { fetchBackend, getBackendBaseUrls } from "@/lib/backend";

const extractFileNameFromContentDisposition = (contentDisposition: string | null) => {
  if (!contentDisposition) return "";

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const quotedMatch = contentDisposition.match(/filename="([^"]+)"/i);
  if (quotedMatch?.[1]) return quotedMatch[1];

  const plainMatch = contentDisposition.match(/filename=([^;]+)/i);
  return plainMatch?.[1]?.trim() || "";
};

const extractExtension = (value: string) => {
  const clean = String(value || "").split("?")[0];
  const parts = clean.split(".");
  if (parts.length < 2) return "";
  return parts[parts.length - 1].toLowerCase();
};

const extensionFromContentType = (contentType: string) => {
  const normalized = (contentType || "").toLowerCase();
  if (normalized.includes("pdf")) return "pdf";
  if (normalized.includes("msword")) return "doc";
  if (normalized.includes("officedocument.wordprocessingml.document")) return "docx";
  if (normalized.includes("officedocument.spreadsheetml.sheet")) return "xlsx";
  if (normalized.includes("vnd.ms-excel")) return "xls";
  if (normalized.includes("officedocument.presentationml.presentation")) return "pptx";
  if (normalized.includes("vnd.ms-powerpoint")) return "ppt";
  if (normalized.includes("text/plain")) return "txt";
  if (normalized.includes("zip")) return "zip";
  return "";
};

const sanitizeFileName = (value: string) =>
  String(value || "download")
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

const toAsciiFileName = (value: string) => {
  const ascii = String(value || "download")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/["\\]/g, "")
    .trim();

  return ascii || "download";
};

const isGeneratedStorageName = (value: string) =>
  /^file-\d+-\d+(?:\.[a-z0-9]+)?$/i.test(String(value || "").trim());

const normalizeAssetUrl = (value: string) =>
  String(value || "").replace(/(https?:\/\/)|(\/)+/g, (match, protocol) => protocol || "/");

const buildFileUrlCandidates = (value: string) => {
  const normalized = normalizeAssetUrl(value);
  const candidates = new Set<string>();

  if (!normalized) return [];

  candidates.add(normalized);

  try {
    const parsed = new URL(normalized);
    const pathname = parsed.pathname || "";
    const search = parsed.search || "";

    getBackendBaseUrls().forEach((baseUrl) => {
      if (!baseUrl) return;
      try {
        const backend = new URL(baseUrl);
        const next = new URL(pathname + search, `${backend.protocol}//${backend.host}`);
        candidates.add(next.toString());
      } catch {
        // ignore malformed fallback base
      }
    });
  } catch {
    // If it's not a valid absolute URL, keep original candidate only.
  }

  return Array.from(candidates);
};

const fetchDocumentFile = async (value: string) => {
  const candidates = buildFileUrlCandidates(value);
  let lastStatus = 0;

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, { cache: "no-store" });
      if (response.ok) {
        return { response, resolvedUrl: candidate };
      }

      lastStatus = response.status;
    } catch {
      // Try next candidate.
    }
  }

  return { response: null, resolvedUrl: "", status: lastStatus };
};

export async function GET(req: Request) {
  try {
    // 🔐 AUTH CHECK (same as your existing API)
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 📌 Get slug
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ message: "Slug is required" }, { status: 400 });
    }

    // 🔍 Call backend to get file URL by slug
    const backendRes = await fetchBackend(`/api/v1/get-document/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!backendRes.ok) {
      const errorData = await parseApiResponseBody(backendRes);
      const status = backendRes.status || 500;
      const fallbackMessage =
        status === 401
          ? "Unauthorized"
          : status === 404
          ? "Document not found"
          : "Failed to fetch document details";
      return NextResponse.json(
        { message: getApiErrorMessage(errorData, fallbackMessage) },
        { status }
      );
    }

    const data = await parseApiResponseBody<{ data?: { url?: string; [key: string]: unknown } }>(backendRes);
    const backendData: Record<string, unknown> =
      data && typeof data === "object" && "data" in data && data.data && typeof data.data === "object"
        ? data.data
        : {};
    const fileUrl = typeof backendData.url === "string" ? backendData.url : ""; // 👈 backend must return this

    if (!fileUrl) {
      return NextResponse.json({ message: "Document not found" }, { status: 404 });
    }

    // 📥 Download actual file
    const fileResult = await fetchDocumentFile(fileUrl);

    if (!fileResult.response) {
      const status = fileResult.status === 404 ? 404 : 500;
      const message =
        status === 404 ? "Document not found" : "Failed to download document";
      return NextResponse.json({ message }, { status });
    }

    const { response: fileRes, resolvedUrl } = fileResult;

    const blob = await fileRes.blob();
    const contentType = fileRes.headers.get("content-type") || "application/octet-stream";

    const backendName =
      (typeof backendData.original_filename === "string" && backendData.original_filename) ||
      (typeof backendData.originalFileName === "string" && backendData.originalFileName) ||
      (typeof backendData.file_name === "string" && backendData.file_name) ||
      (typeof backendData.fileName === "string" && backendData.fileName) ||
      (typeof backendData.filename === "string" && backendData.filename) ||
      "";
    const documentDisplayName =
      (typeof backendData.name === "string" && backendData.name) ||
      (typeof backendData.document_name === "string" && backendData.document_name) ||
      (typeof backendData.documentName === "string" && backendData.documentName) ||
      slug;

    const headerName = extractFileNameFromContentDisposition(
      fileRes.headers.get("content-disposition")
    );

    const urlName = resolvedUrl.split("/").pop() || fileUrl.split("/").pop() || "download";
    const primaryName = backendName || headerName || urlName || "download";
    let filename = sanitizeFileName(primaryName);

    if (isGeneratedStorageName(filename) && documentDisplayName) {
      filename = sanitizeFileName(String(documentDisplayName));
    }

    const currentExt = extractExtension(filename);
    if (!currentExt) {
      const fallbackExt =
        extractExtension(backendName) ||
        extractExtension(headerName) ||
        extractExtension(urlName) ||
        extensionFromContentType(contentType);
      if (fallbackExt) {
        filename = `${filename}.${fallbackExt}`;
      }
    }

    const encodedFileName = encodeURIComponent(filename);
    const asciiFileName = toAsciiFileName(filename);

    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${asciiFileName}"; filename*=UTF-8''${encodedFileName}`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { message: "Network error. Please check your connection and try again." },
      { status: 500 }
    );
  }
}
