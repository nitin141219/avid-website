import { NextResponse } from "next/server";
import { getApiErrorMessage, parseApiResponseBody } from "@/lib/api-response";
import { fetchBackend } from "@/lib/backend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body?.agree !== true) {
      return NextResponse.json(
        {
          errorCode: "PRIVACY_POLICY_REQUIRED",
          message: "Please agree to the privacy policy before submitting.",
        },
        { status: 400 }
      );
    }

    const res = await fetchBackend("/api/v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await parseApiResponseBody(res);
      const errorCode = res.status === 409 ? "AUTH_EMAIL_EXISTS" : "AUTH_REGISTER_FAILED";
      return NextResponse.json(
        {
          errorCode,
          message: getApiErrorMessage(error, "Registration failed"),
        },
        { status: res.status }
      );
    }

    const data = await parseApiResponseBody(res);

    // If backend returns token on register (recommended)
    const response = NextResponse.json(data || { success: true });

    // response.cookies.set("token", data.token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "lax",
    //   path: "/",
    // });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        errorCode: "AUTH_NETWORK_ERROR",
        message: "Network error. Please check your connection and try again.",
      },
      { status: 500 }
    );
  }
}
