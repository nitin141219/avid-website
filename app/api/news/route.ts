import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend";
import { normalizeResponsiveImageSources } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const backendPath = `/api/v1/customer/get-news${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  try {
    const res = await fetchBackend(backendPath, {
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      return NextResponse.json(
        { message: error?.message || "Failed to fetch news" },
        { status: res.status }
      );
    }

    const data = await res.json();
    if (Array.isArray(data?.data?.news)) {
      data.data.news = data.data.news.map((item: any) => normalizeResponsiveImageSources(item));
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
