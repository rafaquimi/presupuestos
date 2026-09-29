import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConfiguracion } from "@/lib/configuracion";
import { configuracionSchema } from "@/lib/validation";
import { assertSameOrigin, csrfRejected, readJsonLimited, requireApiUser, unauthorized } from "@/lib/security";

export async function GET() {
  if (!(await requireApiUser())) return unauthorized();
  const config = await getConfiguracion();
  return NextResponse.json({ ...config, ivaDefault: config.ivaDefault.toNumber() });
}

export async function PUT(request: Request) {
  if (!(await requireApiUser())) return unauthorized();
  if (!assertSameOrigin(request)) return csrfRejected();
  try {
    const parsed = configuracionSchema.safeParse(await readJsonLimited(request, 50_000));
    if (!parsed.success) {
      return NextResponse.json({ error: "Revisa los datos", fields: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const config = await prisma.configuracion.upsert({
      where: { id: "principal" },
      create: {
        id: "principal",
        empresaNombre: data.empresaNombre,
        nif: data.nif || null,
        direccion: data.direccion || null,
        telefono: data.telefono || null,
        email: data.email || null,
        logoUrl: data.logoUrl || null,
        ivaDefault: data.ivaDefault,
        validezDias: data.validezDias,
      },
      update: {
        empresaNombre: data.empresaNombre,
        nif: data.nif || null,
        direccion: data.direccion || null,
        telefono: data.telefono || null,
        email: data.email || null,
        logoUrl: data.logoUrl || null,
        ivaDefault: data.ivaDefault,
        validezDias: data.validezDias,
      },
    });
    return NextResponse.json({ ...config, ivaDefault: config.ivaDefault.toNumber() });
  } catch (error) {
    console.error("Error guardando configuración", error);
    return NextResponse.json({ error: "No se pudo guardar la configuración" }, { status: 500 });
  }
}
