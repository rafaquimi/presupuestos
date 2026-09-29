import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  assertSameOrigin,
  csrfRejected,
  readJsonLimited,
  requireApiUser,
  unauthorized,
} from "@/lib/security";
import { passwordChangeSchema } from "@/lib/validation";

export async function PUT(request: Request) {
  const session = await requireApiUser();
  if (!session) return unauthorized();
  if (!assertSameOrigin(request)) return csrfRejected();

  try {
    const parsed = passwordChangeSchema.safeParse(
      await readJsonLimited(request, 10_000),
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Revisa las contraseñas" },
        { status: 400 },
      );
    }

    const user = await prisma.usuario.findUnique({
      where: { id: session.userId },
      select: { passwordHash: true, activo: true },
    });
    if (
      !user?.activo ||
      !(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))
    ) {
      return NextResponse.json(
        { error: "La contraseña actual no es correcta" },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    await prisma.usuario.update({
      where: { id: session.userId },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cambiando contraseña", error);
    return NextResponse.json(
      { error: "No se pudo cambiar la contraseña" },
      { status: 500 },
    );
  }
}
