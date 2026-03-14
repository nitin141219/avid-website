const cloneFormData = (source: FormData) => {
  const cloned = new FormData();
  source.forEach((value, key) => cloned.append(key, value));
  return cloned;
};

const stripDownloadKeys = (source: FormData) => {
  const cloned = cloneFormData(source);
  cloned.delete("download_pdf");
  cloned.delete("download_title");
  return cloned;
};

const stripDownloadFileOnly = (source: FormData) => {
  const cloned = cloneFormData(source);
  cloned.delete("download_pdf");
  return cloned;
};

const formDataToJson = (source: FormData) => {
  const payload: Record<string, string> = {};

  source.forEach((value, key) => {
    if (typeof value === "string") {
      payload[key] = value;
    }
  });

  return payload;
};

const buildPdfFallbackPayloads = (base: FormData): Array<{ label: string; payload: FormData }> => {
  const pdfValue = base.get("download_pdf");
  if (!(pdfValue instanceof File)) return [];

  const downloadTitle = base.get("download_title");
  const titleValue = downloadTitle ? String(downloadTitle) : "";

  // Try the field names already tolerated by the frontend/public news renderer.
  const fallbackVariants: Array<{ fileKey: string; titleKey?: string | null }> = [
    { fileKey: "pdf_file", titleKey: "pdf_title" },
    { fileKey: "pdfFile", titleKey: "pdfTitle" },
    { fileKey: "pdf", titleKey: "pdf_title" },
    { fileKey: "attachment", titleKey: "download_title" },
    { fileKey: "file", titleKey: null },
  ];

  return fallbackVariants.map(({ fileKey, titleKey }) => {
    const payload = stripDownloadKeys(base);
    payload.append(fileKey, pdfValue);
    if (titleValue && titleKey) {
      payload.append(titleKey, titleValue);
    }
    return {
      label: titleKey ? `${fileKey}+${titleKey}` : fileKey,
      payload,
    };
  });
};

const shouldRetryWithPdfFallback = (status: number, message: string) => {
  const text = (message || "").toLowerCase();
  return (
    status === 400 ||
    text.includes("unexpected field") ||
    text.includes("unexpected failed") ||
    text.includes("invalid field")
  );
};

const requestWithPdfFallback = async (
  url: string,
  method: "POST" | "PATCH" | "PUT",
  formData: FormData
) => {
  const attempt = async (payload: FormData, label: string) => {
    const res = await fetch(url, {
      method,
      credentials: "include",
      body: payload,
    });
    const contentType = (res.headers.get("content-type") || "").toLowerCase();
    let data: any = {};

    if (contentType.includes("application/json")) {
      data = await res.json().catch(() => ({}));
    } else {
      const text = await res.text().catch(() => "");
      data = text ? { message: text } : {};
    }

    if (!res.ok && !data?.message) {
      data = {
        ...data,
        message: `${method} ${url} failed (${res.status})`,
      };
    }

    return { res, data };
  };

  const first = await attempt(formData, "primary");
  if (first.res.ok && first.data?.success !== false) {
    return first.data;
  }

  const firstMessage = first.data?.message || "";
  const pdfValue = formData.get("download_pdf");
  const hasPdfFile = pdfValue instanceof File;
  const hasPdfString = typeof pdfValue === "string" && pdfValue.trim().length > 0;

  if (!shouldRetryWithPdfFallback(first.res.status, firstMessage)) {
    throw new Error(firstMessage || `${method} news failed`);
  }

  if (hasPdfString) {
    const retryWithoutStringPdf = await attempt(stripDownloadFileOnly(formData), "without-download-pdf");
    if (retryWithoutStringPdf.res.ok && retryWithoutStringPdf.data?.success !== false) {
      return retryWithoutStringPdf.data;
    }
  }

  if (!hasPdfFile) {
    throw new Error(firstMessage || `${method} news failed`);
  }

  const fallbackPayloads = buildPdfFallbackPayloads(formData);
  for (const { label, payload } of fallbackPayloads) {
    const retry = await attempt(payload, label);
    if (retry.res.ok && retry.data?.success !== false) {
      return retry.data;
    }
  }

  const retryWithoutPdf = await attempt(stripDownloadFileOnly(formData), "without-pdf");
  if (retryWithoutPdf.res.ok && retryWithoutPdf.data?.success !== false) {
    return {
      ...retryWithoutPdf.data,
      __pdfSkipped: true,
    };
  }

  throw new Error(
    firstMessage || "PDF upload failed because the backend rejected all supported file fields."
  );
};

export const NEWS_SERVICES = {
  getNews: async (params: { limit: number; page: number }): Promise<any> => {
    const query = new URLSearchParams({
      limit: String(params.limit),
      page: String(params.page),
    }).toString();
    const res = await fetch(`/api/backend/admin/get-news?${query}`, {
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Get News failed");
    }
    return {
      news: data?.data?.news || [],
      pagination: data?.data?.pagination || {},
    };
  },
  createNews: async (formData: FormData): Promise<any> => {
    return requestWithPdfFallback("/api/backend/add-news", "POST", formData);
  },
  updateNews: async (newsId: string, formData: FormData): Promise<any> => {
    if (!newsId) {
      throw new Error("Update news failed: news id is missing");
    }

    return requestWithPdfFallback(`/api/backend/update-news/${newsId}`, "PATCH", formData);
  },
  updateNewsStatus: async (newsId: string, status: boolean): Promise<boolean> => {
    const res = await fetch(`/api/backend/update-news-status/${newsId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_active: status,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || "News Update Status failed");
    }

    return true;
  },
  addSpotlight: async (newsId: string, status: boolean) => {
    const res = await fetch(`/api/backend/add-spotlight-news/${newsId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spotlight: status,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Add Spotlight failed");
    }

    return data;
  },
  deleteNews: async (ids: string[]): Promise<boolean> => {
    const res = await fetch("/api/backend/delete-news", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        news_ids: ids,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Delete failed");
    }

    return true;
  },
};
