import { cookies } from "next/headers";
import { fetchBackend } from "@/lib/backend";

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetchBackend("/api/v1/get-details", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: controller.signal,
    }).finally(() => {
      clearTimeout(timeout);
    });

    if (!res.ok) return null;
    const user = await res.json();
    return user;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    // During static generation, cookies() throws a dynamic server error
    // This is expected for statically generated pages - return null for public pages
    if (error instanceof Error && (error as any).digest === 'DYNAMIC_SERVER_USAGE') {
      return null;
    }
    console.error("Error in getAuthUser:", error);
    return null;
  }
}
