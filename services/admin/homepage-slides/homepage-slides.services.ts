async function syncHomepageSlideTranslations(
  slideId: string,
  formData: FormData
): Promise<void> {
  await fetch(`/api/admin/homepage-slides/${slideId}/translations`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title_en: String(formData.get("title_en") || formData.get("title") || ""),
      title_de: String(formData.get("title_de") || ""),
      title_fr: String(formData.get("title_fr") || ""),
      title_es: String(formData.get("title_es") || ""),
      cta_text_en: String(formData.get("cta_text_en") || formData.get("cta_text") || ""),
      cta_text_de: String(formData.get("cta_text_de") || ""),
      cta_text_fr: String(formData.get("cta_text_fr") || ""),
      cta_text_es: String(formData.get("cta_text_es") || ""),
    }),
  });
}

export const HOMEPAGE_SLIDES_SERVICES = {
  getSlides: async (params: { limit: number; page: number }): Promise<any> => {
    const query = new URLSearchParams({
      limit: String(params.limit),
      page: String(params.page),
    }).toString();

    const res = await fetch(`/api/admin/homepage-slides?${query}`, {
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || "Get homepage slides failed");
    }

    return {
      slides: data?.data?.slides || [],
      pagination: data?.data?.pagination || {},
    };
  },

  getSlide: async (slideId: string): Promise<any> => {
    const res = await fetch(`/api/admin/homepage-slides/${slideId}`, {
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || "Get homepage slide failed");
    }

    return data?.data;
  },

  createSlide: async (formData: FormData): Promise<any> => {
    const res = await fetch("/api/backend/add-homepage-slide", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();

    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || "Create homepage slide failed");
    }

    const createdSlideId = data?.data?._id || data?.data?.id;
    if (createdSlideId) {
      await syncHomepageSlideTranslations(String(createdSlideId), formData);
    }

    return data?.data;
  },

  updateSlide: async (slideId: string, formData: FormData): Promise<any> => {
    const res = await fetch(`/api/backend/update-homepage-slide/${slideId}`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();

    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || "Update homepage slide failed");
    }

    await syncHomepageSlideTranslations(slideId, formData);

    return data?.data;
  },

  updateSlideStatus: async (slideId: string, status: boolean): Promise<boolean> => {
    const res = await fetch(`/api/backend/update-homepage-slide-status/${slideId}`, {
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

    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || "Update homepage slide status failed");
    }

    return true;
  },

  deleteSlide: async (slideId: string): Promise<boolean> => {
    const res = await fetch(`/api/backend/delete-homepage-slide/${slideId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || "Delete homepage slide failed");
    }

    return true;
  },
};
