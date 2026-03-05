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

const buildPdfFallbackPayloads = (base: FormData): FormData[] => {
  const pdfValue = base.get("download_pdf");
  if (!(pdfValue instanceof File)) return [];

  // Keep a single quick compatibility retry to avoid long save delays.
  const fallbackVariants: Array<{ fileKey: string; titleKey?: string | null }> = [
    { fileKey: "file", titleKey: null },
  ];

  return fallbackVariants.map(({ fileKey, titleKey }) => {
    const payload = stripDownloadKeys(base);
    payload.append(fileKey, pdfValue);
    const downloadTitle = base.get("download_title");
    if (downloadTitle && titleKey) {
      payload.append(titleKey, String(downloadTitle));
    }
    return payload;
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

const requestWithPdfFallback = async (url: string, method: "POST" | "PATCH", formData: FormData) => {
  const attempt = async (payload: FormData) => {
    const res = await fetch(url, {
      method,
      credentials: "include",
      body: payload,
    });
    const data = await res.json().catch(() => ({}));
    return { res, data };
  };

  const first = await attempt(formData);
  if (first.res.ok && first.data?.success !== false) {
    return first.data;
  }

  const firstMessage = first.data?.message || "";
  const hasPdfFile = formData.get("download_pdf") instanceof File;
  if (!hasPdfFile) {
    throw new Error(firstMessage || `${method} news failed`);
  }
  if (!shouldRetryWithPdfFallback(first.res.status, firstMessage)) {
    throw new Error(firstMessage || `${method} news failed`);
  }

  const fallbackPayloads = buildPdfFallbackPayloads(formData);
  for (const payload of fallbackPayloads) {
    const retry = await attempt(payload);
    if (retry.res.ok && retry.data?.success !== false) {
      return retry.data;
    }
  }

  // Final fallback: save news without download fields so Add/Update doesn't fail.
  const noDownloadPayload = stripDownloadKeys(formData);
  const plainRetry = await attempt(noDownloadPayload);
  if (plainRetry.res.ok && plainRetry.data?.success !== false) {
    return {
      ...plainRetry.data,
      __pdfSkipped: true,
      message:
        plainRetry.data?.message ||
        "News saved, but PDF upload was skipped because backend rejected file fields.",
    };
  }

  throw new Error(firstMessage || plainRetry.data?.message || `${method} news failed`);
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
