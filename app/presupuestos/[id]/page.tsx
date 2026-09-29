/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Eye, Pencil } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import PresupuestoActions from "@/components/PresupuestoActions";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
const stateLabel = { BORRADOR: "Borrador", ENVIADO: "Enviado", ACEPTADO: "Aceptado", RECHAZADO: "Rechazado" } as const;

export default async function PresupuestoPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const p = await prisma.presupuesto.findUnique({ where: { id }, include: { productos: true } });
  if (!p) notFound();

  return (
    <AdminLayout>
      <div className="container-app py-8">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 font-semibold text-blue-700"><ArrowLeft size={17} /> Volver</Link>
        <section className="card mb-6 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-5 mobile-stack"><div><div className="mb-3 flex flex-wrap items-center gap-3"><h1 className="text-3xl font-extrabold">{p.numero}</h1><span className={`badge badge-${p.estado}`}>{stateLabel[p.estado]}</span></div><p className="muted">Creado el {p.createdAt.toLocaleDateString("es-ES")}</p></div><div className="text-left sm:text-right"><p className="muted text-sm">Total</p><p className="text-3xl font-extrabold text-blue-700">{p.total.toFixed(2)} €</p></div></div>
          <div className="mt-6 flex flex-wrap gap-2"><Link className="btn btn-primary" href={`/presupuestos/${id}/editar`}><Pencil size={17} /> Editar</Link><a className="btn btn-secondary" href={`/api/presupuestos/${id}/pdf?view=1`} target="_blank" rel="noopener noreferrer"><Eye size={17} /> Ver PDF</a><a className="btn btn-ghost" href={`/api/presupuestos/${id}/pdf`}><Download size={17} /> Descargar PDF</a></div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <section className="card p-6"><h2 className="mb-4 text-xl font-extrabold">Productos</h2><div className="space-y-4">{p.productos.map((product) => <article key={product.id} className="rounded-xl border border-slate-200 p-4"><div className="flex justify-between gap-4">{product.imagenUrl && <img src={product.imagenUrl} alt="" className="h-24 w-24 shrink-0 rounded-lg object-cover" />}<div className="min-w-0 flex-1"><h3 className="font-extrabold">{product.nombre}</h3>{product.descripcion && <p className="muted mt-1">{product.descripcion}</p>}{product.caracteristicas && <p className="mt-3 whitespace-pre-line text-sm text-slate-600">{product.caracteristicas}</p>}</div><strong className="whitespace-nowrap text-blue-700">{product.precio.mul(product.cantidad).toFixed(2)} €</strong></div><p className="muted mt-3 text-sm">{product.cantidad} × {product.precio.toFixed(2)} €</p></article>)}</div></section>
            {p.notas && <section className="card p-6"><h2 className="mb-3 text-xl font-extrabold">Notas</h2><p className="whitespace-pre-line text-slate-600">{p.notas}</p></section>}
          </div>
          <aside className="space-y-6">
            <section className="card p-5"><h2 className="mb-3 font-extrabold">Cliente</h2><p className="font-bold">{p.clienteNombre}</p>{p.clienteEmpresa && <p>{p.clienteEmpresa}</p>}<p className="muted mt-2 text-sm">{p.clienteEmail}</p>{p.clienteTelefono && <p className="muted text-sm">{p.clienteTelefono}</p>}</section>
            {p.proveedor && <section className="card border-amber-200 bg-amber-50 p-5"><h2 className="mb-2 font-extrabold">Proveedor interno</h2><p>{p.proveedor}</p></section>}
            <section className="card p-5"><h2 className="mb-3 font-extrabold">Totales</h2><div className="space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{p.subtotal.toFixed(2)} €</span></div><div className="flex justify-between"><span>IVA ({p.ivaPorcentaje.toFixed(2)}%)</span><span>{p.iva.toFixed(2)} €</span></div><div className="flex justify-between border-t pt-3 text-lg font-extrabold"><span>Total</span><span>{p.total.toFixed(2)} €</span></div></div></section>
            <section className="card p-5"><h2 className="mb-3 font-extrabold">Compartir</h2><p className="muted mb-4 text-sm">{p.publicEnabled ? "Enlace activo" : "Enlace desactivado"}{p.publicExpiresAt ? ` hasta ${p.publicExpiresAt.toLocaleDateString("es-ES")}` : " sin caducidad"}.</p><PresupuestoActions id={p.id} publicToken={p.publicToken} publicEnabled={p.publicEnabled} /></section>
          </aside>
        </div>
      </div>
    </AdminLayout>
  );
}
