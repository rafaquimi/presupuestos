import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin, csrfRejected, requireApiUser, unauthorized } from "@/lib/security";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireApiUser())) return unauthorized();
  if (!assertSameOrigin(request)) return csrfRejected();
  const { id } = await params;
  const budgets = await prisma.presupuesto.count({ where: { clienteId: id } });
  if (budgets) {
    return NextResponse.json(
      { error: "No se puede eliminar un cliente con presupuestos" },
      { status: 409 },
    );
  }
  const deleted = await prisma.cliente.deleteMany({ where: { id } });
  if (!deleted.count) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
