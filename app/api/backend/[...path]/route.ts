import { cookies } from "next/headers";

async function proxy(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const token = (await cookies()).get("token")?.value;
  const path = (await params).path;

  if (!token) return new Response("Unauthorized", { status: 401 });

  const url = new URL(`${process.env.BACKEND_URL}/api/v1/${path?.join("/")}`);
  const clientUrl = req.url ? new URL(req.url) : null;
  if (clientUrl) {
    url.search = clientUrl?.search;
  }

  let body: any = undefined;
  const contentType = req.headers.get("content-type") || "";

  if (req.method !== "GET" && req.method !== "HEAD") {
    if (contentType.includes("application/json")) {
      body = await req.text(); // forward JSON as text
    } else if (contentType.includes("multipart/form-data")) {
      body = await req.formData(); // forward FormData
    } else {
      body = await req.text(); // fallback to text
    }
  }

  // 4️⃣ Prepare headers
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (contentType && !contentType.includes("multipart/form-data")) {
    headers["Content-Type"] = contentType;
  }

  const res = await fetch(url.toString(), {
    method: req.method,
    headers,
    body,
  });
  // // 6️⃣ Forward response back to client
  const responseHeaders = new Headers(res.headers);

  // // Remove any hop-by-hop headers that can break fetch
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");

  return new Response(res.body, {
    status: res.status,
    headers: responseHeaders,
  });
}

export { proxy as DELETE, proxy as GET, proxy as PATCH, proxy as POST, proxy as PUT };
