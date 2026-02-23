import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const backendUrl = new URL(`${process.env.BACKEND_URL}/api/v1/customer/get-blogs`);

  // Forward all filters
  searchParams.forEach((value, key) => {
    backendUrl.searchParams.append(key, value);
  });

  try {
    const res = await fetch(backendUrl.toString(), {
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      return NextResponse.json(
        { message: error?.message || "Failed to fetch blogs" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
