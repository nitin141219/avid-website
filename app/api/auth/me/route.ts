import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { parseApiResponseBody } from "@/lib/api-response";
import { fetchBackend } from "@/lib/backend";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const res = await fetchBackend("/api/v1/get-details", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await parseApiResponseBody(res);

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get user details error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
