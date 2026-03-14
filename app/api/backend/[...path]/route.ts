import { cookies } from "next/headers";
import { getApiErrorMessage, parseApiResponseBody } from "@/lib/api-response";
import { fetchBackend } from "@/lib/backend";

async function proxy(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const token = (await cookies()).get("token")?.value;
    const path = (await params).path;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const clientUrl = req.url ? new URL(req.url) : null;
    const targetPath = `/api/v1/${path?.join("/") || ""}${clientUrl?.search || ""}`;

    let body: BodyInit | undefined = undefined;
    const contentType = req.headers.get("content-type") || "";

    if (req.method !== "GET" && req.method !== "HEAD") {
      if (contentType.includes("application/json")) {
        body = await req.text();
      } else if (contentType.includes("multipart/form-data")) {
        body = await req.formData();
      } else {
        body = await req.text();
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (contentType && !contentType.includes("multipart/form-data")) {
      headers["Content-Type"] = contentType;
    }

    const res = await fetchBackend(targetPath, {
      method: req.method,
      headers,
      body,
    });

    const responseHeaders = new Headers(res.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    responseHeaders.delete("transfer-encoding");

    return new Response(res.body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Backend proxy error:", error);

    if (error instanceof Response) {
      const payload = await parseApiResponseBody(error);
      return Response.json(
        { message: getApiErrorMessage(payload, "Backend request failed") },
        { status: error.status || 500 }
      );
    }

    return Response.json({ message: "Backend request failed" }, { status: 502 });
  }
}

export { proxy as DELETE, proxy as GET, proxy as PATCH, proxy as POST, proxy as PUT };
