import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  res.cookies.delete("token");
  res.cookies.delete("profile_override");

  return res;
}
