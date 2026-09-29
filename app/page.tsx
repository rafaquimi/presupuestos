import Link from "next/link";
import { FileCheck2, FileText, Plus, Search, Send } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const stateLabel = { BORRADOR: "Borrador", ENVIADO: "Enviado", ACEPTADO: "Aceptado", RECHAZADO: "Rechazado" } as const;

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; estado?: string }> }) {
  await requireUser();
  const filters = await searchParams;
  const q = filters.q?.trim().slice(0, 100) || "";
  const allowedStates = ["BORRADOR", "ENVIADO", "ACEPTADO", "RECHAZADO"] as const;
  const estado = allowedStates.find((item) => item === filters.estado);
  const where = {
    ...(estado ? { estado } : {}),
    ...(q ? { OR: [
      { numero: { contains: q, mode: "insensitive" as const } },
      { clienteNombre: { contains: q, mode: "insensitive" as const } },
      { clienteEmail: { contains: q, mode: "insensitive" as const } },
      { clienteEmpresa: { contains: q, mode: "insensitive" as const } },
    ] } : {}),
  };
  const [presupuestos, total, enviados, aceptados] = await Promise.all([
    prisma.presupuesto.findMany({ where, include: { _count: { select: { productos: true } } }, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.presupuesto.count(),
    prisma.presupuesto.count({ where: { estado: "ENVIADO" } }),
    prisma.presupuesto.count({ where: { estado: "ACEPTADO" } }),
  ]);

  return (
    <AdminLayout>
      <div className="container-app py-8">
        <div className="mb-7 flex items-end justify-between gap-4 mobile-stack"><div><h1 className="text-3xl font-extrabold">Panel de presupuestos</h1><p className="muted mt-2">Crea, comparte y controla todos los presupuestos.</p></div><Link href="/presupuestos/nuevo" className="btn btn-primary"><Plus size={18} /> Nuevo presupuesto</Link></div>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="card flex items-center gap-4 p-5"><FileText className="text-blue-600" /><div><p className="muted text-sm">Total</p><p className="text-2xl font-extrabold">{total}</p></div></div>
          <div className="card flex items-center gap-4 p-5"><Send className="text-indigo-600" /><div><p className="muted text-sm">Enviados</p><p className="text-2xl font-extrabold">{enviados}</p></div></div>
          <div className="card flex items-center gap-4 p-5"><FileCheck2 className="text-green-600" /><div><p className="muted text-sm">Aceptados</p><p className="text-2xl font-extrabold">{aceptados}</p></div></div>
        </section>

        <form className="card mb-6 flex gap-3 p-4 mobile-stack" method="get">
          <div className="relative flex-1"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input className="field pl-10" name="q" defaultValue={q} placeholder="Número, cliente, correo o empresa" /></div>
          <select className="field sm:max-w-52" name="estado" defaultValue={estado || ""}><option value="">Todos los estados</option>{allowedStates.map((item) => <option key={item} value={item}>{stateLabel[item]}</option>)}</select>
          <button className="btn btn-secondary">Buscar</button>
        </form>

        {presupuestos.length ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {presupuestos.map((p) => (
              <Link href={`/presupuestos/${p.id}`} key={p.id} className="card block p-5 text-inherit no-underline transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="mb-4 flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-blue-700">{p.numero}</p><h2 className="mt-1 text-lg font-extrabold">{p.clienteNombre}</h2><p className="muted text-sm">{p.clienteEmpresa || p.clienteEmail}</p></div><span className={`badge badge-${p.estado}`}>{stateLabel[p.estado]}</span></div>
                <div className="flex items-end justify-between border-t border-slate-100 pt-4"><div className="muted text-sm"><p>{p._count.productos} producto{p._count.productos === 1 ? "" : "s"}</p><p>{p.createdAt.toLocaleDateString("es-ES")}</p></div><strong className="text-xl text-blue-700">{p.total.toFixed(2)} €</strong></div>
              </Link>
            ))}
          </section>
        ) : <div className="card p-12 text-center"><FileText className="mx-auto mb-4 text-slate-300" size={50} /><h2 className="text-xl font-extrabold">No hay resultados</h2><p className="muted mt-2">Crea un presupuesto o cambia los filtros.</p></div>}
      </div>
    </AdminLayout>
  );
}
