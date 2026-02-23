export const BLOGS_SERVICES = {
  getBlogs: async (params: { limit: number; page: number }): Promise<any> => {
    const query = new URLSearchParams({
      limit: String(params.limit),
      page: String(params.page),
    }).toString();
    const res = await fetch(`/api/backend/admin/get-blogs?${query}`, {
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Get blogs failed");
    }
    return {
      blogs: data?.data?.blogs || [],
      pagination: data?.data?.pagination || {},
    };
  },
  createBlog: async (formData: FormData): Promise<any> => {
    const res = await fetch("/api/backend/add-blog", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Create blog failed");
    }

    return data;
  },
  updateBlog: async (blogId: string, formData: FormData): Promise<any> => {
    const res = await fetch(`/api/backend/update-blog/${blogId}`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Update blog failed");
    }

    return data;
  },
  updateBlogStatus: async (blogId: string, status: boolean): Promise<boolean> => {
    const res = await fetch(`/api/backend/update-blog-status/${blogId}`, {
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
      throw new Error(data.message || "Blog Update Status failed");
    }

    return true;
  },
  deleteBlog: async (ids: string[]): Promise<boolean> => {
    const res = await fetch("/api/backend/delete-blog", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blog_ids: ids,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Delete failed");
    }

    return true;
  },
};
