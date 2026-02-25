const LOCAL_STORAGE_KEY = "avid_products";

type ProductOption = {
  label: string;
  value: string;
  _id?: string;
  id?: string;
};

const toSlug = (value: string) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const toTitleFromSlug = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((segment) => {
      if (/^\d+$/.test(segment)) return segment;
      if (/^[a-z]{1,2}$/i.test(segment)) return segment.toUpperCase();
      return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
    })
    .join(" ");

const normalizeProduct = (raw: any): ProductOption | null => {
  const value = toSlug(raw?.value || raw?.slug || raw?.product_slug || raw?.productSlug || "");
  const labelRaw = String(raw?.label || raw?.name || raw?.product_name || raw?.productName || "").trim();
  const label = labelRaw || toTitleFromSlug(value);

  if (!value || !label) return null;

  return {
    label,
    value,
    _id: raw?._id,
    id: raw?.id,
  };
};

const getLocalProducts = (): ProductOption[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeProduct).filter(Boolean) as ProductOption[];
  } catch {
    return [];
  }
};

const saveLocalProducts = (products: ProductOption[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch {
    // noop
  }
};

const mergeProducts = (...lists: ProductOption[][]): ProductOption[] => {
  const map = new Map<string, ProductOption>();
  for (const list of lists) {
    for (const item of list) {
      const normalized = normalizeProduct(item);
      if (!normalized) continue;
      const existing = map.get(normalized.value);
      map.set(normalized.value, {
        ...existing,
        ...normalized,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
};

const extractProductList = (data: any): ProductOption[] => {
  const rawList = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.products)
      ? data.data.products
      : [];

  return rawList.map(normalizeProduct).filter(Boolean) as ProductOption[];
};

const getProductsFromDocuments = async (): Promise<ProductOption[]> => {
  const urls = ["/api/backend/admin/get-document", "/api/backend/get-document"];

  for (const url of urls) {
    try {
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.success === false) continue;

      const docs = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.documents)
          ? data.data.documents
          : [];

      const fromDocs = docs
        .filter((doc: any) => String(doc?.category || "").toUpperCase() === "PRODUCT")
        .map((doc: any) =>
          normalizeProduct({
            label:
              doc?.product_name ||
              doc?.productName ||
              String(doc?.name || "").replace(
                /\s*[-–(]*\b(?:pds|sds|product data sheet|safety data sheet)\b\)?\s*$/i,
                ""
              ),
            value:
              doc?.product_slug ||
              doc?.productSlug ||
              String(doc?.slug || "").replace(/-(pds|sds)$/i, ""),
          })
        )
        .filter(Boolean) as ProductOption[];

      if (fromDocs.length > 0) {
        return fromDocs;
      }
    } catch {
      // try next
    }
  }

  return [];
};

export const PRODUCTS_SERVICES = {
  getProducts: async (): Promise<any> => {
    const attempts = ["/api/backend/admin/get-products", "/api/backend/get-products"];
    let lastError = "Get products failed";
    let remoteProducts: ProductOption[] = [];

    for (const url of attempts) {
      try {
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.success !== false) {
          remoteProducts = extractProductList(data);
          break;
        }
        lastError = data?.message || `Get products failed (${res.status})`;
      } catch (error: any) {
        lastError = error?.message || "Get products failed";
      }
    }

    const documentProducts = await getProductsFromDocuments();
    const localProducts = getLocalProducts();
    const products = mergeProducts(remoteProducts, documentProducts, localProducts);

    if (products.length > 0) {
      saveLocalProducts(products);
      return { products, pagination: {} };
    }

    if (remoteProducts.length === 0 && documentProducts.length === 0 && localProducts.length === 0) {
      throw new Error(lastError);
    }

    return { products: [], pagination: {} };
  },

  createProduct: async (productData: {
    label: string;
    value: string;
  }): Promise<any> => {
    const normalized = normalizeProduct(productData);
    if (!normalized) {
      throw new Error("Create product failed");
    }

    const urls = [
      "/api/backend/admin/create-product",
      "/api/backend/create-product",
      "/api/backend/admin/add-product",
      "/api/backend/add-product",
    ];
    const bodies = [
      { label: normalized.label, value: normalized.value },
      { name: normalized.label, slug: normalized.value },
      { product_name: normalized.label, product_slug: normalized.value },
    ];

    for (const url of urls) {
      for (const body of bodies) {
        try {
          const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
          const data = await res.json().catch(() => null);
          if (res.ok && data?.success !== false) {
            const merged = mergeProducts(getLocalProducts(), [normalized]);
            saveLocalProducts(merged);
            return data;
          }
        } catch {
          // try next
        }
      }
    }

    const merged = mergeProducts(getLocalProducts(), [{ ...normalized, _id: `local_${Date.now()}` }]);
    saveLocalProducts(merged);
    return { success: true, data: normalized, local: true };
  },

  updateProduct: async (
    id: string,
    productData: { label: string; value: string }
  ): Promise<boolean> => {
    const normalized = normalizeProduct(productData);
    if (!normalized) {
      throw new Error("Update failed");
    }

    const attempts = [
      { url: `/api/backend/admin/update-product/${id}`, method: "PATCH" },
      { url: `/api/backend/admin/update-product/${id}`, method: "PUT" },
      { url: `/api/backend/update-product/${id}`, method: "PATCH" },
      { url: `/api/backend/update-product/${id}`, method: "PUT" },
      { url: `/api/backend/admin/edit-product/${id}`, method: "PATCH" },
      { url: `/api/backend/admin/edit-product/${id}`, method: "PUT" },
      { url: `/api/backend/edit-product/${id}`, method: "PATCH" },
      { url: `/api/backend/edit-product/${id}`, method: "PUT" },
    ];
    const bodies = [
      { label: normalized.label, value: normalized.value },
      { name: normalized.label, slug: normalized.value },
      { product_name: normalized.label, product_slug: normalized.value },
    ];

    for (const attempt of attempts) {
      for (const body of bodies) {
        try {
          const res = await fetch(attempt.url, {
            method: attempt.method,
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
          const data = await res.json().catch(() => null);
          if (res.ok && data?.success !== false) {
            break;
          }
        } catch {
          // continue
        }
      }
    }

    const local = getLocalProducts();
    const index = local.findIndex((item) => item._id === id || item.id === id || item.value === normalized.value);
    if (index >= 0) {
      local[index] = { ...local[index], ...normalized };
    } else {
      local.push({ ...normalized, _id: `local_${Date.now()}` });
    }
    saveLocalProducts(mergeProducts(local));
    return true;
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    const urls = [
      `/api/backend/admin/delete-product/${id}`,
      `/api/backend/delete-product/${id}`,
      `/api/backend/admin/remove-product/${id}`,
      `/api/backend/remove-product/${id}`,
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.success !== false) {
          break;
        }
      } catch {
        // continue
      }
    }

    const local = getLocalProducts().filter((item) => item._id !== id && item.id !== id);
    saveLocalProducts(local);
    return true;
  },
};
