import { toast } from "@/components/AvidToast";
import { addDownloadHistory } from "./downloadHistory";

const inFlightDownloads = new Set<string>();

type DownloadHistoryMeta = {
  userKey?: string | null;
  title?: string;
  productTitle?: string;
  pagePath?: string;
};

export const downloadFn = async (slug: string, historyMeta?: DownloadHistoryMeta) => {
  if (!slug) return;

  if (inFlightDownloads.has(slug)) {
    toast.info("Download is already in progress...");
    return;
  }

  inFlightDownloads.add(slug);

  try {
    const res = await fetch(`/api/auth/download?slug=${slug}`, {
      method: "GET",
      credentials: "include", // ✅ ensure cookies are sent
    });

    // ❌ Handle API error response
    if (!res.ok) {
      const data = await res.json();
      toast.error(data?.message || "No file found");
      return;
    }

    // 📥 Convert response to blob
    const blob = await res.blob();

    // 🔹 Get filename from response header (if set)
    const contentDisposition = res.headers.get("content-disposition");
    const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
    const fileName = fileNameMatch?.[1] || "download";

    // 🔗 Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    toast.success("File downloaded successfully.");

    if (historyMeta?.userKey) {
      addDownloadHistory(historyMeta.userKey, {
        slug,
        fileName,
        title: historyMeta.title || fileName,
        productTitle: historyMeta.productTitle,
        pagePath: historyMeta.pagePath,
      });
    }

    // 🧹 Cleanup
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    toast.error("Something went wrong while downloading");
  } finally {
    inFlightDownloads.delete(slug);
  }
};
