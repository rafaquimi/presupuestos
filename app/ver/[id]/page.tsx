/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import { Download, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import { getPublicPresupuesto } from "@/lib/public-presupuesto";
import { getConfiguracion } from "@/lib/configuracion";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function VerPresupuesto({ params }: { params: Promise<{ id: string }> }) {
  const { id: token } = await params;
  const [p, config] = await Promise.all([getPublicPresupuesto(token), getConfiguracion()]);
  if (!p) notFound();

  return (
    <main className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="container-app max-w-4xl">
        <header className="mb-6 flex items-center justify-between gap-4 mobile-stack"><Logo publicView /><span className="flex items-center gap-2 text-sm font-semibold text-green-700"><ShieldCheck size={17} /> Enlace seguro</span></header>
        <section className="card mb-5 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-5 mobile-stack"><div><p className="text-sm font-bold uppercase tracking-wide text-blue-700">Presupuesto</p><h1 className="mt-1 text-3xl font-extrabold">{p.numero}</h1><p className="muted mt-2">{p.createdAt.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</p></div><div className="text-left sm:text-right"><p className="muted text-sm">Total con impuestos</p><p className="text-3xl font-extrabold text-blue-700">{p.total.toFixed(2)} €</p></div></div>
          <div className="mt-6"><a className="btn btn-primary" href={`/api/public/presupuestos/${encodeURIComponent(token)}/pdf`}><Download size={18} /> Descargar PDF</a></div>
        </section>

        <section className="card mb-5 p-6"><h2 className="text-lg font-extrabold">Preparado para</h2><p className="mt-2 text-xl font-bold">{p.clienteNombre}</p>{p.clienteEmpresa && <p className="muted">{p.clienteEmpresa}</p>}</section>

        <section className="card mb-5 p-6"><h2 className="mb-5 text-xl font-extrabold">Productos y servicios</h2><div className="space-y-4">{p.productos.map((product) => <article key={product.id} className="rounded-xl border border-slate-200 p-4 sm:p-5"><div className="flex justify-between gap-4 mobile-stack">{product.imagenUrl && <img src={product.imagenUrl} alt="" className="h-28 w-28 shrink-0 rounded-lg object-cover" />}<div className="min-w-0 flex-1"><h3 className="text-lg font-extrabold">{product.nombre}</h3>{product.descripcion && <p className="muted mt-2 whitespace-pre-line">{product.descripcion}</p>}{product.caracteristicas && <div className="mt-4 border-t border-slate-200 pt-3"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Características</p><ul className="mt-2 space-y-1 text-sm text-slate-600">{product.caracteristicas.split("\n").filter(Boolean).map((line, index) => <li key={index}>• {line}</li>)}</ul></div>}</div><div className="whitespace-nowrap text-right"><strong className="text-lg text-blue-700">{product.precio.mul(product.cantidad).toFixed(2)} €</strong><p className="muted text-sm">{product.cantidad} × {product.precio.toFixed(2)} €</p><p className="muted text-xs">IVA incluido</p></div></div></article>)}</div></section>

        {p.notas && <section className="card mb-5 p-6"><h2 className="mb-3 text-lg font-extrabold">Notas</h2><p className="whitespace-pre-line text-slate-600">{p.notas}</p></section>}

        <section className="card ml-auto max-w-md p-6"><div className="space-y-2"><div className="flex justify-between"><span>Base imponible</span><span>{p.subtotal.toFixed(2)} €</span></div><div className="flex justify-between"><span>IVA incluido ({p.ivaPorcentaje.toFixed(2)}%)</span><span>{p.iva.toFixed(2)} €</span></div><div className="flex justify-between border-t pt-4 text-xl font-extrabold text-blue-700"><span>Total</span><span>{p.total.toFixed(2)} €</span></div></div></section>

        <footer className="py-8 text-center text-sm text-slate-500">{config.empresaNombre} · Documento válido durante {config.validezDias} días</footer>
      </div>
    </main>
  );
}
