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
    const res = await fetch("/api/backend/add-news", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Create news failed");
    }

    return data;
  },
  updateNews: async (newsId: string, formData: FormData): Promise<any> => {
    const res = await fetch(`/api/backend/update-news/${newsId}`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Update news failed");
    }

    return data;
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
