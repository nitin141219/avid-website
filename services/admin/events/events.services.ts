export const EVENTS_SERVICES = {
  getEvents: async (params: { limit: number; page: number }): Promise<any> => {
    const query = new URLSearchParams({
      limit: String(params.limit),
      page: String(params.page),
    }).toString();
    const res = await fetch(`/api/backend/admin/get-events?${query}`, {
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Get Events failed");
    }
    return {
      events: data?.data?.events || [],
      pagination: data?.data?.pagination || {},
    };
  },
  createEvent: async (formData: FormData): Promise<any> => {
    const res = await fetch("/api/backend/add-event", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Create event failed");
    }

    return data;
  },
  updateEvent: async (eventId: string, formData: FormData): Promise<any> => {
    const res = await fetch(`/api/backend/update-event/${eventId}`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Update event failed");
    }

    return data;
  },
  updateEventStatus: async (eventId: string, status: boolean): Promise<boolean> => {
    const res = await fetch(`/api/backend/update-event-status/${eventId}`, {
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
      throw new Error(data.message || "Event Update Status failed");
    }

    return true;
  },
  addSpotlight: async (eventId: string, status: boolean) => {
    const res = await fetch(`/api/backend/add-spotlight-event/${eventId}`, {
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
  deleteEvents: async (ids: string[]): Promise<boolean> => {
    const res = await fetch("/api/backend/delete-event", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_ids: ids,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Delete failed");
    }

    return true;
  },
};
