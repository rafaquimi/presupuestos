import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { getConfiguracion } from "@/lib/configuracion";
import { PresupuestoPDF } from "@/lib/pdf-generator";
import { requireApiUser, unauthorized } from "@/lib/security";
import { absoluteImageUrl } from "@/lib/images";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireApiUser())) return unauthorized();
  const { id } = await params;
  const [presupuesto, configuracion] = await Promise.all([
    prisma.presupuesto.findUnique({ where: { id }, include: { productos: true } }),
    getConfiguracion(),
  ]);
  if (!presupuesto) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const serializado = {
    numero: presupuesto.numero,
    clienteNombre: presupuesto.clienteNombre,
    clienteEmail: presupuesto.clienteEmail,
    clienteTelefono: presupuesto.clienteTelefono,
    clienteEmpresa: presupuesto.clienteEmpresa,
    notas: presupuesto.notas,
    subtotal: presupuesto.subtotal.toNumber(),
    ivaPorcentaje: presupuesto.ivaPorcentaje.toNumber(),
    iva: presupuesto.iva.toNumber(),
    total: presupuesto.total.toNumber(),
    createdAt: presupuesto.createdAt,
    productos: presupuesto.productos.map((producto) => ({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      caracteristicas: producto.caracteristicas,
      precio: producto.precio.toNumber(),
      cantidad: producto.cantidad,
      imagenUrl: absoluteImageUrl(producto.imagenUrl, request.url),
    })),
  };
  const pdf = await renderToBuffer(PresupuestoPDF({
    presupuesto: serializado,
    configuracion: {
      empresaNombre: configuracion.empresaNombre,
      nif: configuracion.nif,
      direccion: configuracion.direccion,
      telefono: configuracion.telefono,
      email: configuracion.email,
      validezDias: configuracion.validezDias,
    },
  }));
  const inline = new URL(request.url).searchParams.get("view") === "1";
  return new NextResponse(pdf as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${presupuesto.numero}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
