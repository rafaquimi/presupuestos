import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

export async function requireApiUser() {
  return getCurrentUser();
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function csrfRejected() {
  return NextResponse.json(
    { error: "Origen de la solicitud no permitido" },
    { status: 403 },
  );
}

export function generatePublicToken() {
  return randomBytes(32).toString("base64url");
}

export function loginAttemptKey(request: Request, email: string) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256")
    .update(`${ip.toLowerCase()}|${email.trim().toLowerCase()}`)
    .digest("hex");
}

export function isAllowedImageUrl(value?: string | null) {
  if (!value) return true;
  if (/^\/api\/public\/imagenes\/[A-Za-z0-9_-]{40,60}$/.test(value)) return true;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    const allowed = (process.env.ALLOWED_IMAGE_HOSTS || "")
      .split(",")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean);
    return allowed.includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export async function readJsonLimited(request: Request, maxBytes = 1_000_000) {
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }
  return JSON.parse(text);
}
