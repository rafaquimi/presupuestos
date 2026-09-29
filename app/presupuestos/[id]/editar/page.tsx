import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import PresupuestoForm from "@/components/PresupuestoForm";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EditarPresupuestoPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const presupuesto = await prisma.presupuesto.findUnique({ where: { id }, include: { productos: true } });
  if (!presupuesto) notFound();

  const initial = {
    id: presupuesto.id,
    clienteNombre: presupuesto.clienteNombre,
    clienteEmail: presupuesto.clienteEmail,
    clienteTelefono: presupuesto.clienteTelefono,
    clienteEmpresa: presupuesto.clienteEmpresa,
    proveedor: presupuesto.proveedor,
    notas: presupuesto.notas,
    ivaPorcentaje: presupuesto.ivaPorcentaje.toNumber(),
    estado: presupuesto.estado,
    publicEnabled: presupuesto.publicEnabled,
    publicExpiresAt: presupuesto.publicExpiresAt,
    productos: presupuesto.productos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      caracteristicas: p.caracteristicas,
      precio: p.precio.toNumber(),
      cantidad: p.cantidad,
      imagenUrl: p.imagenUrl || "",
    })),
  };

  return (
    <AdminLayout>
      <div className="container-app py-8">
        <Link href={`/presupuestos/${id}`} className="mb-5 inline-flex items-center gap-2 font-semibold text-blue-700"><ArrowLeft size={17} /> Volver</Link>
        <h1 className="text-3xl font-extrabold">Editar {presupuesto.numero}</h1>
        <p className="muted mb-7 mt-2">Los cambios se reflejarán en el enlace público.</p>
        <PresupuestoForm initial={initial} />
      </div>
    </AdminLayout>
  );
}
