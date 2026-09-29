import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { presupuestoSchema, presupuestoValidationMessages } from "@/lib/validation";
import { calculateTotals, serializePresupuesto } from "@/lib/presupuestos";
import { assertSameOrigin, csrfRejected, generatePublicToken, readJsonLimited, requireApiUser, unauthorized } from "@/lib/security";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  if (!(await requireApiUser())) return unauthorized();
  const { id } = await params;
  const presupuesto = await prisma.presupuesto.findUnique({ where: { id }, include: { productos: true } });
  if (!presupuesto) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(serializePresupuesto(presupuesto));
}

export async function PATCH(request: Request, { params }: Context) {
  if (!(await requireApiUser())) return unauthorized();
  if (!assertSameOrigin(request)) return csrfRejected();
  const { id } = await params;

  try {
    const parsed = presupuestoSchema.safeParse(await readJsonLimited(request));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Revisa los datos del presupuesto", details: presupuestoValidationMessages(parsed.error) },
        { status: 400 },
      );
    }
    const data = parsed.data;
    const email = data.cliente.email.toLowerCase();
    const totals = calculateTotals(data.productos, data.ivaPorcentaje);

    const updated = await prisma.$transaction(async (tx) => {
      const current = await tx.presupuesto.findUnique({ where: { id } });
      if (!current) return null;
      const cliente = await tx.cliente.upsert({
        where: { email },
        create: { ...data.cliente, email },
        update: { ...data.cliente, email },
      });
      await tx.producto.deleteMany({ where: { presupuestoId: id } });
      return tx.presupuesto.update({
        where: { id },
        data: {
          clienteId: cliente.id,
          clienteNombre: data.cliente.nombre,
          clienteEmail: email,
          clienteTelefono: data.cliente.telefono || null,
          clienteEmpresa: data.cliente.empresa || null,
          notas: data.notas || null,
          estado: data.estado || current.estado,
          ivaPorcentaje: data.ivaPorcentaje,
          publicEnabled: data.publicEnabled ?? current.publicEnabled,
          publicExpiresAt: data.publicExpiresAt ? new Date(data.publicExpiresAt) : null,
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

    if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(serializePresupuesto(updated));
  } catch (error) {
    console.error("Error actualizando presupuesto", error);
    return NextResponse.json({ error: "No se pudo actualizar el presupuesto" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Context) {
  if (!(await requireApiUser())) return unauthorized();
  if (!assertSameOrigin(request)) return csrfRejected();
  const { id } = await params;
  const deleted = await prisma.presupuesto.deleteMany({ where: { id } });
  if (!deleted.count) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: Request, { params }: Context) {
  if (!(await requireApiUser())) return unauthorized();
  if (!assertSameOrigin(request)) return csrfRejected();
  const { id } = await params;
  const updated = await prisma.presupuesto.updateMany({
    where: { id },
    data: { publicToken: generatePublicToken(), publicEnabled: true },
  });
  if (!updated.count) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ success: true });
}
