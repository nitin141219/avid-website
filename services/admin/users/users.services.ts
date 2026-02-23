export const USER_SERVICES = {
  getUsers: async (params: { limit: number; page: number }): Promise<any> => {
    const query = new URLSearchParams({
      limit: String(params.limit),
      page: String(params.page),
    }).toString();
    const res = await fetch(`/api/backend/get-users?${query}`, {
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Get users failed");
    }
    return {
      users: data?.data?.users || [],
      pagination: data?.data?.pagination || {},
    };
  },
  deleteUsers: async (userIds: string[]): Promise<boolean> => {
    const res = await fetch("/api/backend/delete-users", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        user_ids: userIds,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Delete failed");
    }

    return true;
  },
  updateUserStatus: async (userIds: string[], status: boolean): Promise<boolean> => {
    const res = await fetch("/api/backend/update-user-status", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_ids: userIds,
        active_status: status,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Delete failed");
    }

    return true;
  },
};
