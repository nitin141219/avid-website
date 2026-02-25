export const DOCUMENTS_SERVICES = {
  getDocuments: async (): Promise<any> => {
    const res = await fetch(`/api/backend/admin/get-document`, {
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Get documents failed");
    }
    return {
      documents: data?.data || [],
      pagination: data?.data?.pagination || {},
    };
  },
  deleteDocument: async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/backend/delete-document/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Delete failed");
    }

    return true;
  },
  uploadDocument: async (formData: FormData): Promise<any> => {
    const res = await fetch("/api/backend/upload-document", {
      method: "POST",
      credentials: "include",

      body: formData, // FormData comes from component
    });
    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Document upload failed");
    }
    return data;
  },
  renameDocument: async (id: string, name: string): Promise<boolean> => {
    const attempts: Array<{ url: string; method: "PATCH" | "PUT" }> = [
      { url: `/api/backend/update-document/${id}`, method: "PATCH" },
      { url: `/api/backend/admin/update-document/${id}`, method: "PATCH" },
      { url: `/api/backend/update-document/${id}`, method: "PUT" },
      { url: `/api/backend/admin/update-document/${id}`, method: "PUT" },
    ];

    let lastErrorMessage = "Rename failed";

    for (const attempt of attempts) {
      try {
        const res = await fetch(attempt.url, {
          method: attempt.method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });

        const data = await res.json().catch(() => null);

        if (res.ok && data?.success !== false) {
          return true;
        }

        lastErrorMessage = data?.message || `Rename failed (${res.status})`;
      } catch (error: any) {
        lastErrorMessage = error?.message || "Rename failed";
      }
    }

    throw new Error(lastErrorMessage);
  },
  updateDocument: async (
    id: string,
    formData: FormData,
    options?: { documentUrl?: string; documentSlug?: string }
  ): Promise<boolean> => {
    if (!id) {
      throw new Error("Update failed: document id is missing");
    }

    const attempts: Array<{
      url: string;
      method: "PATCH" | "PUT";
      includeIdInBody?: boolean;
    }> = [
      { url: `/api/backend/update-document/${id}`, method: "PATCH" },
      { url: `/api/backend/update-document/${id}`, method: "PUT" },
      { url: `/api/backend/admin/update-document/${id}`, method: "PATCH" },
      { url: `/api/backend/admin/update-document/${id}`, method: "PUT" },
      { url: `/api/backend/update-document`, method: "PATCH", includeIdInBody: true },
      { url: `/api/backend/update-document`, method: "PUT", includeIdInBody: true },
      { url: `/api/backend/admin/update-document`, method: "PATCH", includeIdInBody: true },
      { url: `/api/backend/admin/update-document`, method: "PUT", includeIdInBody: true },
    ];

    let lastErrorMessage = "Update failed";
    let lastAttempt = "";

    const cloneFormData = (source: FormData) => {
      const cloned = new FormData();

      source.forEach((value, key) => {
        cloned.append(key, value);
      });

      return cloned;
    };

    for (const attempt of attempts) {
      try {
        lastAttempt = `${attempt.method} ${attempt.url}`;
        const payload = cloneFormData(formData);

        if (attempt.includeIdInBody) {
          payload.set("id", id);
          payload.set("_id", id);
          payload.set("document_id", id);
          payload.set("documentId", id);
        }

        const res = await fetch(attempt.url, {
          method: attempt.method,
          credentials: "include",
          body: payload,
        });

        const data = await res.json().catch(() => null);

        if (res.ok && data?.success !== false) {
          return true;
        }

        lastErrorMessage = data?.message || `Update failed (${res.status})`;
      } catch (error: any) {
        lastErrorMessage = error?.message || "Update failed";
      }
    }

    // All update routes failed (404), fallback to recreate (upload new + delete old)
    // First check if file exists in FormData
    let hasFile = false;
    try {
      const fileEntry = formData.get("file");
      hasFile = fileEntry instanceof File || Boolean(fileEntry && typeof fileEntry === "object");
    } catch {
      hasFile = false;
    }

    // If no file, try to fetch from existing document
    if (!hasFile) {
      try {
        const url = options?.documentUrl;
        const slug = options?.documentSlug;

        let fileBlob: Blob | null = null;
        let fileName = "";

        // Try fetch from URL first
        if (url) {
          const urlRes = await fetch(url, { cache: "no-store" });
          if (urlRes.ok) {
            fileBlob = await urlRes.blob();
            fileName = url.split("/").pop() || "document.pdf";
          }
        }

        // If URL fetch failed, try slug-based fetch
        if (!fileBlob && slug) {
          const slugRes = await fetch(`/api/auth/download?slug=${encodeURIComponent(slug)}`, {
            method: "GET",
            credentials: "include",
          });

          if (slugRes.ok) {
            fileBlob = await slugRes.blob();
            const disposition = slugRes.headers.get("content-disposition") || "";
            const filenameMatch = disposition.match(/filename="?([^\"]+)"?/i);
            fileName = filenameMatch?.[1] || `${slug}.pdf`;
          }
        }

        // If we got a file, add to FormData
        if (fileBlob) {
          formData.set("file", new File([fileBlob], fileName, { type: fileBlob.type || "application/octet-stream" }));
          hasFile = true;
        }
      } catch (err) {
        // Silently continue, will fail at upload with clear error
      }
    }

    // Now try upload+delete
    try {
      // Delete old document first to avoid slug collision
      try {
        await fetch(`/api/backend/delete-document/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
      } catch (err) {
        // Continue even if delete fails
      }

      // Now upload as new document
      const uploadRes = await fetch("/api/backend/upload-document", {
        method: "POST",
        credentials: "include",
        body: cloneFormData(formData),
      });

      const uploadData = await uploadRes.json().catch(() => null);

      if (!uploadRes.ok || uploadData?.success === false) {
        throw new Error(uploadData?.message || "Update failed: could not upload document");
      }

      return true;
    } catch (error: any) {
      throw new Error(error?.message || "Update failed");
    }
  },
};
