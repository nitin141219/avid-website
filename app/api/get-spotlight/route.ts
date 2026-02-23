import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = new URL(`${process.env.BACKEND_URL}/api/v1/get-spotlight`);

  try {
    const res = await fetch(backendUrl.toString(), {
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      return NextResponse.json(
        { message: error?.message || "Failed to fetch spotlight" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
