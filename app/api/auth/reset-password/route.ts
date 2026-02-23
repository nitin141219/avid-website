import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/reset-password/${body?.token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: body?.password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to reset password" },
        { status: res.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Password reset successfully!",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Network error. Please check your connection and try again." },
      { status: 500 }
    );
  }
}
