import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "presupuestos_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export type SessionPayload = {
  userId: string;
  email: string;
  nombre: string;
  rol: "ADMIN";
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET debe contener al menos 32 caracteres");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .setIssuer("presupuestos-app")
    .setAudience("presupuestos-admin")
    .sign(getSecret());
}

export async function verifySession(token?: string | null) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: "presupuestos-app",
      audience: "presupuestos-admin",
      algorithms: ["HS256"],
    });

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.nombre !== "string" ||
      payload.rol !== "ADMIN"
    ) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}
