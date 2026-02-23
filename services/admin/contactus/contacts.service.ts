export const CONTACT_US_SERVICES = {
  getContactUs: async (params: { limit: number; page: number }): Promise<any> => {
    const query = new URLSearchParams({
      limit: String(params.limit),
      page: String(params.page),
    }).toString();
    const res = await fetch(`/api/backend/get-contact-us?${query}`, {
      credentials: "include",
      method: "GET",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Get contact us failed");
    }
    return {
      contactUs: data?.data?.enquiries || [],
      pagination: data?.data?.pagination || {},
    };
  },
  getSingleContactUs: async (id: string): Promise<any> => {
    const res = await fetch(`/api/backend/get-contact-us/${id}`, {
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Get contact us failed");
    }
    return {
      contactUs: data?.data || [],
    };
  },
};
