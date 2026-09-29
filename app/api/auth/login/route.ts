import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { assertSameOrigin, csrfRejected, loginAttemptKey, readJsonLimited } from "@/lib/security";
import { SESSION_COOKIE, SESSION_DURATION_SECONDS, signSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    if (!assertSameOrigin(request)) return csrfRejected();
    const parsed = loginSchema.safeParse(await readJsonLimited(request, 10_000));
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos de acceso no válidos" }, { status: 400 });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const key = loginAttemptKey(request, email);
    const now = new Date();
    const attempt = await prisma.intentoLogin.findUnique({ where: { clave: key } });

    if (attempt?.bloqueadoHasta && attempt.bloqueadoHasta > now) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera 15 minutos." },
        { status: 429, headers: { "Retry-After": "900" } },
      );
    }

    const user = await prisma.usuario.findUnique({ where: { email } });
    const valid = Boolean(
      user?.activo && (await bcrypt.compare(parsed.data.password, user.passwordHash)),
    );

    if (!valid || !user) {
      const windowExpired =
        !attempt || now.getTime() - attempt.primerIntentoAt.getTime() > 15 * 60 * 1000;
      const attempts = windowExpired ? 1 : attempt.intentos + 1;
      await prisma.intentoLogin.upsert({
        where: { clave: key },
        create: {
          clave: key,
          intentos: attempts,
          primerIntentoAt: now,
          bloqueadoHasta: attempts >= 5 ? new Date(now.getTime() + 15 * 60 * 1000) : null,
        },
        update: {
          intentos: attempts,
          primerIntentoAt: windowExpired ? now : attempt?.primerIntentoAt,
          bloqueadoHasta: attempts >= 5 ? new Date(now.getTime() + 15 * 60 * 1000) : null,
        },
      });
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    await prisma.intentoLogin.deleteMany({ where: { clave: key } });
    const token = await signSession({
      userId: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
    });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ error: "No se pudo iniciar sesión" }, { status: 500 });
  }
}
