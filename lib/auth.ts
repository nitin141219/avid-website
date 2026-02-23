import { cookies } from "next/headers";

export async function getAuthUser() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) return null;

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/get-details`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const user = await res.json();
    return user;
  } catch (error) {
    // During static generation, cookies() throws a dynamic server error
    // This is expected for statically generated pages - return null for public pages
    if (error instanceof Error && (error as any).digest === 'DYNAMIC_SERVER_USAGE') {
      return null;
    }
    console.error("Error in getAuthUser:", error);
    return null;
  }
}
