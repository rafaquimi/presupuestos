import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { assertSameOrigin, csrfRejected } from "@/lib/security";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return csrfRejected();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ success: true });
}
