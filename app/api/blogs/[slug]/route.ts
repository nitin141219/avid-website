// import { blogs } from "@/lib/blogs";
// import { NextResponse } from "next/server";

// export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = await params; // ✅ await params
//   const blog = blogs.find((b) => b.slug === slug);

//   if (!blog) {
//     return NextResponse.json({ message: "Blog not found" }, { status: 404 });
//   }

//   return NextResponse.json(blog);
// }

import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // const { searchParams } = new URL(req.url);

  const backendUrl = new URL(`${process.env.BACKEND_URL}/api/v1/get-blog/${slug}`);

  try {
    const res = await fetch(backendUrl.toString(), {
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      return NextResponse.json(
        { message: error?.message || "Failed to fetch blog details" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
