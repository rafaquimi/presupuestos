import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import ClientesList from "@/components/ClientesList";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ClientesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireUser();
  const q = (await searchParams).q?.trim().slice(0, 100) || "";
  const clientes = await prisma.cliente.findMany({ where: q ? { OR: [{ nombre: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { empresa: { contains: q, mode: "insensitive" } }] } : undefined, include: { _count: { select: { presupuestos: true } } }, orderBy: { nombre: "asc" }, take: 100 });
  return <AdminLayout><div className="container-app py-8"><Link href="/" className="mb-5 inline-flex items-center gap-2 font-semibold text-blue-700"><ArrowLeft size={17} /> Volver</Link><h1 className="text-3xl font-extrabold">Clientes</h1><p className="muted mb-6 mt-2">Se crean y actualizan automáticamente desde los presupuestos.</p><form className="card mb-5 flex gap-3 p-4"><div className="relative flex-1"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input name="q" className="field pl-10" defaultValue={q} placeholder="Nombre, correo o empresa" /></div><button className="btn btn-secondary">Buscar</button></form><ClientesList clientes={clientes} /></div></AdminLayout>;
}
