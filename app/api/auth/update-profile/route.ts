import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getApiErrorMessage, parseApiResponseBody } from "@/lib/api-response";
import { getMongoDb } from "@/lib/mongodb";

type Candidate = {
  path: string;
  method: "PUT" | "PATCH" | "POST";
};

const CANDIDATE_ENDPOINTS: Candidate[] = [
  { path: "get-details", method: "PATCH" },
  { path: "get-details", method: "PUT" },
  { path: "profile", method: "PATCH" },
  { path: "profile", method: "PUT" },
  { path: "profile/update", method: "PATCH" },
  { path: "profile/update", method: "PUT" },
  { path: "update-profile", method: "PATCH" },
  { path: "update-profile", method: "PUT" },
  { path: "update-profile", method: "POST" },
  { path: "update-details", method: "PATCH" },
  { path: "update-details", method: "PUT" },
  { path: "update-details", method: "POST" },
  { path: "update-user-details", method: "PATCH" },
  { path: "update-user-details", method: "PUT" },
  { path: "update-user-details", method: "POST" },
  { path: "update-user", method: "PATCH" },
  { path: "update-user", method: "PUT" },
  { path: "update-user", method: "POST" },
  { path: "customer/update-details", method: "PATCH" },
  { path: "customer/update-details", method: "PUT" },
  { path: "customer/update-details", method: "POST" },
  { path: "customer/update-profile", method: "PATCH" },
  { path: "customer/update-profile", method: "PUT" },
  { path: "customer/update-profile", method: "POST" },
  { path: "customer/update-user-details", method: "PATCH" },
  { path: "customer/update-user-details", method: "PUT" },
  { path: "customer/update-user-details", method: "POST" },
  { path: "customer/update-user", method: "PATCH" },
  { path: "customer/update-user", method: "PUT" },
  { path: "customer/update-user", method: "POST" },
];

type UpdatePayload = {
  first_name?: string;
  last_name?: string;
  company_name?: string;
  email?: string;
  mobile_no?: string;
  department?: string | null;
  country?: string | null;
  market_interest?: string[];
  receive_updates?: boolean;
};

function sanitizePayload(raw: any): UpdatePayload {
  const payload: UpdatePayload = {};

  if (typeof raw?.first_name === "string") payload.first_name = raw.first_name.trim();
  if (typeof raw?.last_name === "string") payload.last_name = raw.last_name.trim();
  if (typeof raw?.company_name === "string") payload.company_name = raw.company_name.trim();
  if (typeof raw?.email === "string") payload.email = raw.email.trim().toLowerCase();
  if (typeof raw?.mobile_no === "string") payload.mobile_no = raw.mobile_no.trim();
  if (typeof raw?.department === "string" || raw?.department === null) payload.department = raw.department;
  if (typeof raw?.country === "string" || raw?.country === null) payload.country = raw.country;
  if (Array.isArray(raw?.market_interest)) {
    payload.market_interest = raw.market_interest.map((item: unknown) => String(item)).filter(Boolean);
  }
  if (typeof raw?.receive_updates === "boolean") payload.receive_updates = raw.receive_updates;

  return payload;
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const baseUrl = process.env.BACKEND_URL;
    const configuredPath = process.env.PROFILE_UPDATE_ENDPOINT;
    const configuredMethod = (process.env.PROFILE_UPDATE_METHOD || "PATCH").toUpperCase();
    if (!baseUrl) {
      return NextResponse.json({ message: "BACKEND_URL is not configured." }, { status: 500 });
    }

    const normalizedConfiguredPath = configuredPath
      ? configuredPath.replace(/^\/+/, "").replace(/^api\/v1\//, "")
      : null;
    const dynamicCandidates: Candidate[] = normalizedConfiguredPath
      ? [
          {
            path: normalizedConfiguredPath,
            method:
              configuredMethod === "PUT"
                ? "PUT"
                : configuredMethod === "POST"
                ? "POST"
                : "PATCH",
          },
        ]
      : [];

    const candidates = [...dynamicCandidates, ...CANDIDATE_ENDPOINTS];

    for (const candidate of candidates) {
      const res = await fetch(`${baseUrl}/api/v1/${candidate.path}`, {
        method: candidate.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await parseApiResponseBody(res);
        return NextResponse.json(data || { message: "Profile updated successfully." });
      }

      if (res.status === 404 || res.status === 405) {
        continue;
      }

      const errorData = await parseApiResponseBody(res);
      return NextResponse.json(
        { message: getApiErrorMessage(errorData, "Profile update failed.") },
        { status: res.status || 400 }
      );
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { message: "Profile update is not available on backend. Please contact admin." },
        { status: 501 }
      );
    }

    const meRes = await fetch(`${baseUrl}/api/v1/get-details`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!meRes.ok) {
      return NextResponse.json({ message: "Unable to identify user for profile update." }, { status: 401 });
    }

    const meData = await parseApiResponseBody<{ data?: { _id?: string; email?: string } }>(meRes);
    const loggedInUser =
      meData && typeof meData === "object" && "data" in meData && meData.data && typeof meData.data === "object"
        ? meData.data
        : {};
    const loggedInUserId = loggedInUser?._id ? String(loggedInUser._id) : "";
    const loggedInEmail = loggedInUser?.email ? String(loggedInUser.email).toLowerCase() : "";
    const updateData = sanitizePayload(body);

    if (!Object.keys(updateData).length) {
      return NextResponse.json({ message: "No valid fields to update." }, { status: 400 });
    }

    const db = await getMongoDb();
    const collectionName = process.env.MONGODB_USERS_COLLECTION || "users";
    const usersCollection = db.collection(collectionName);

    const filterById = loggedInUserId && ObjectId.isValid(loggedInUserId) ? { _id: new ObjectId(loggedInUserId) } : null;
    const filterByEmail = loggedInEmail ? { email: loggedInEmail } : null;

    const updateDoc = {
      $set: {
        ...updateData,
        updated_at: new Date(),
      },
    };

    let updateResult: any = null;
    if (filterById) {
      updateResult = await usersCollection.updateOne(filterById, updateDoc);
    }
    if ((!updateResult || updateResult.matchedCount === 0) && filterByEmail) {
      updateResult = await usersCollection.updateOne(filterByEmail, updateDoc);
    }

    if (!updateResult || updateResult.matchedCount === 0) {
      return NextResponse.json({ message: "User document not found in MongoDB." }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ message: "Network error. Please try again." }, { status: 500 });
  }
}
