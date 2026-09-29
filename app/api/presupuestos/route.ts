import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { presupuestoSchema } from "@/lib/validation";
import { calculateTotals, serializePresupuesto } from "@/lib/presupuestos";
import { assertSameOrigin, csrfRejected, generatePublicToken, readJsonLimited, requireApiUser, unauthorized } from "@/lib/security";

export async function GET() {
  if (!(await requireApiUser())) return unauthorized();
  const presupuestos = await prisma.presupuesto.findMany({
    include: { productos: true },
    orderBy: { createdAt: "desc" },
    take: 250,
  });
  return NextResponse.json(presupuestos.map(serializePresupuesto));
}

export async function POST(request: Request) {
  if (!(await requireApiUser())) return unauthorized();
  if (!assertSameOrigin(request)) return csrfRejected();

  try {
    const parsed = presupuestoSchema.safeParse(await readJsonLimited(request));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Revisa los datos del presupuesto", fields: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const email = data.cliente.email.toLowerCase();
    const totals = calculateTotals(data.productos, data.ivaPorcentaje);
    const year = new Date().getFullYear();

    const presupuesto = await prisma.$transaction(async (tx) => {
      const counter = await tx.contador.upsert({
        where: { id: `presupuestos-${year}` },
        create: { id: `presupuestos-${year}`, valor: 1 },
        update: { valor: { increment: 1 } },
      });
      const cliente = await tx.cliente.upsert({
        where: { email },
        create: { ...data.cliente, email },
        update: { ...data.cliente, email },
      });

      return tx.presupuesto.create({
        data: {
          numero: `PRE-${year}-${String(counter.valor).padStart(6, "0")}`,
          publicToken: generatePublicToken(),
          publicEnabled: data.publicEnabled ?? true,
          publicExpiresAt: data.publicExpiresAt ? new Date(data.publicExpiresAt) : null,
          clienteId: cliente.id,
          clienteNombre: data.cliente.nombre,
          clienteEmail: email,
          clienteTelefono: data.cliente.telefono || null,
          clienteEmpresa: data.cliente.empresa || null,
          notas: data.notas || null,
          estado: data.estado || "BORRADOR",
          ivaPorcentaje: data.ivaPorcentaje,
          ...totals,
          productos: {
            create: data.productos.map((producto) => ({
              nombre: producto.nombre,
              descripcion: producto.descripcion || "",
              caracteristicas: producto.caracteristicas || "",
              precio: producto.precio,
              cantidad: producto.cantidad,
              imagenUrl: producto.imagenUrl || null,
            })),
          },
        },
        include: { productos: true },
      });
    });

    return NextResponse.json(serializePresupuesto(presupuesto), { status: 201 });
  } catch (error) {
    console.error("Error creando presupuesto", error);
    const status = error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? 413 : 500;
    return NextResponse.json({ error: "No se pudo crear el presupuesto" }, { status });
  }
}
