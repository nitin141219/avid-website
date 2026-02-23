const LOCAL_STORAGE_KEY = "avid_products";

const getLocalProducts = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalProducts = (products: any[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch {
    console.warn("Failed to save products to localStorage");
  }
};

export const PRODUCTS_SERVICES = {
  getProducts: async (): Promise<any> => {
    try {
      const res = await fetch(`/api/backend/admin/get-products`, {
        credentials: "include",
      });

      if (!res.ok) {
        // Backend not ready, return local products
        return { products: getLocalProducts(), pagination: {} };
      }

      const data = await res.json();
      return {
        products: data?.data || [],
        pagination: data?.data?.pagination || {},
      };
    } catch (error: any) {
      // Network error, return local products
      console.warn("Failed to fetch products from backend, using local storage");
      return { products: getLocalProducts(), pagination: {} };
    }
  },

  createProduct: async (productData: {
    label: string;
    value: string;
  }): Promise<any> => {
    // Try backend first
    try {
      const res = await fetch("/api/backend/admin/create-product", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success !== false) {
        return data;
      }
    } catch (error: any) {
      console.warn("Backend create failed, saving to localStorage:", error?.message);
    }

    // Fallback: save locally
    const products = getLocalProducts();
    const newProduct = {
      _id: `local_${Date.now()}`,
      ...productData,
    };
    products.push(newProduct);
    saveLocalProducts(products);
    return newProduct;
  },

  updateProduct: async (
    id: string,
    productData: { label: string; value: string }
  ): Promise<boolean> => {
    const attempts = [
      { url: `/api/backend/admin/update-product/${id}`, method: "PATCH" },
      { url: `/api/backend/admin/update-product/${id}`, method: "PUT" },
      { url: `/api/backend/update-product/${id}`, method: "PATCH" },
      { url: `/api/backend/update-product/${id}`, method: "PUT" },
    ];

    let lastError = "Update failed";

    for (const attempt of attempts) {
      try {
        const res = await fetch(attempt.url, {
          method: attempt.method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });

        const data = await res.json().catch(() => null);

        if (res.ok && data?.success !== false) {
          return true;
        }

        lastError = data?.message || `Update failed (${res.status})`;
      } catch (error: any) {
        lastError = error?.message || "Update failed";
      }
    }

    // Fallback: update locally
    console.warn("Backend update failed, updating localStorage:", lastError);
    const products = getLocalProducts();
    const index = products.findIndex((p: any) => p._id === id || p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...productData };
      saveLocalProducts(products);
      return true;
    }

    throw new Error(lastError);
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/backend/admin/delete-product/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success !== false) {
        return true;
      }
    } catch (error: any) {
      console.warn("Backend delete failed, deleting from localStorage:", error?.message);
    }

    // Fallback: delete locally
    const products = getLocalProducts();
    const filtered = products.filter((p: any) => p._id !== id && p.id !== id);
    saveLocalProducts(filtered);
    return true;
  },
};
