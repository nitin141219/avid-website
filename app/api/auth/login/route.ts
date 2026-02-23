import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorCode = res.status === 401 ? "AUTH_INVALID_CREDENTIALS" : "AUTH_LOGIN_FAILED";
      return NextResponse.json(
        {
          errorCode,
          message: data.message || "Invalid credentials",
        },
        { status: res.status || 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("token", data?.data?.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        errorCode: "AUTH_NETWORK_ERROR",
        message: "Network error. Please check your connection and try again.",
      },
      { status: 500 }
    );
  }
}
