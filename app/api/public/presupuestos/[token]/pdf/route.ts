import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getConfiguracion } from "@/lib/configuracion";
import { PresupuestoPDF } from "@/lib/pdf-generator";
import { getPublicPresupuesto } from "@/lib/public-presupuesto";

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [presupuesto, configuracion] = await Promise.all([getPublicPresupuesto(token), getConfiguracion()]);
  if (!presupuesto) return NextResponse.json({ error: "Enlace no válido o caducado" }, { status: 404 });
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
  return new NextResponse(pdf as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${presupuesto.numero}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
