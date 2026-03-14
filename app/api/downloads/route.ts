import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend";

export async function GET() {
  try {
    const res = await fetchBackend("/api/v1/customer/get-document", {
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      return NextResponse.json(
        { message: error?.message || "Failed to fetch documents" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
