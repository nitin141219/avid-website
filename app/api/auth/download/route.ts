import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
    const backendRes = await fetch(`${process.env.BACKEND_URL}/api/v1/get-document/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!backendRes.ok) {
      return NextResponse.json({ message: "Document not found" }, { status: 404 });
    }

    const data = await backendRes.json();
    const fileUrl = data?.data?.url; // 👈 backend must return this

    if (!fileUrl) {
      return NextResponse.json({ message: "Document not found" }, { status: 404 });
    }

    // 📥 Download actual file
    const fileRes = await fetch(fileUrl, {
      cache: "no-store",
    });

    if (!fileRes.ok) {
      return NextResponse.json({ message: "Failed to download document" }, { status: 500 });
    }

    const blob = await fileRes.blob();
    const contentType = fileRes.headers.get("content-type") || "application/octet-stream";

    const backendData = data?.data || {};
    const backendName =
      backendData?.original_filename ||
      backendData?.originalFileName ||
      backendData?.file_name ||
      backendData?.fileName ||
      backendData?.filename ||
      "";
    const documentDisplayName =
      backendData?.name || backendData?.document_name || backendData?.documentName || slug;

    const headerName = extractFileNameFromContentDisposition(
      fileRes.headers.get("content-disposition")
    );

    const urlName = fileUrl.split("/").pop() || "download";
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
