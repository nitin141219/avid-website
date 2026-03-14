import { NextResponse } from "next/server";
import { getApiErrorMessage, parseApiResponseBody } from "@/lib/api-response";
import { fetchBackend } from "@/lib/backend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetchBackend("/api/v1/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await parseApiResponseBody<{ message?: string }>(res);

    if (!res.ok) {
      return NextResponse.json(
        { message: getApiErrorMessage(data, "Failed to send reset link") },
        { status: res.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: getApiErrorMessage(data, "Reset link sent successfully!"),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Network error. Please check your connection and try again." },
      { status: 500 }
    );
  }
}
