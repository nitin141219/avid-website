import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/get-details`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await res.json();

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get user details error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
