import { NextResponse } from "next/server";
import { getApiErrorMessage, parseApiResponseBody } from "@/lib/api-response";
import { fetchBackend } from "@/lib/backend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetchBackend("/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await parseApiResponseBody<{ data?: { token?: string }; message?: string }>(res);

    if (!res.ok) {
      const errorCode = res.status === 401 ? "AUTH_INVALID_CREDENTIALS" : "AUTH_LOGIN_FAILED";
      return NextResponse.json(
        {
          errorCode,
          message: getApiErrorMessage(data, "Invalid credentials"),
        },
        { status: res.status || 401 }
      );
    }

    const token = data && typeof data === "object" && "data" in data ? data.data?.token : undefined;
    if (!token) {
      return NextResponse.json(
        {
          errorCode: "AUTH_LOGIN_FAILED",
          message: "Login succeeded but no session token was returned.",
        },
        { status: 502 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("token", token, {
      httpOnly: true,
      // `secure: true` blocks cookie storage on http://localhost.
      secure: process.env.NODE_ENV === "production",
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
