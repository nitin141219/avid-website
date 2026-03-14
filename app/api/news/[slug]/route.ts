import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const backendPath = `/api/v1/get-news/${slug}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  try {
    const res = await fetchBackend(backendPath, {
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      return NextResponse.json(
        { message: error?.message || "Failed to fetch news details" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
