import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body?.agree_to_privacy_policy !== true) {
      return NextResponse.json(
        {
          errorCode: "PRIVACY_POLICY_REQUIRED",
          message: "Please agree to the privacy policy before submitting.",
        },
        { status: 400 }
      );
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/contact-us`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "Something went wrong. Please try again." },
        { status: res.status || 401 }
      );
    }

    const response = NextResponse.json({ success: true, message: data.message });

    return response;
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { message: "Network error. Please check your connection and try again." },
      { status: 500 }
    );
  }
}
