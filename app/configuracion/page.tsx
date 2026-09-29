import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import ConfiguracionForm from "@/components/ConfiguracionForm";
import PasswordForm from "@/components/PasswordForm";
import { getConfiguracion } from "@/lib/configuracion";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ConfiguracionPage() {
  await requireUser();
  const c = await getConfiguracion();
  const initial = { empresaNombre: c.empresaNombre, nif: c.nif || "", direccion: c.direccion || "", telefono: c.telefono || "", email: c.email || "", logoUrl: c.logoUrl || "", ivaDefault: c.ivaDefault.toNumber(), validezDias: c.validezDias };
  return <AdminLayout><div className="container-app py-8"><Link href="/" className="mb-5 inline-flex items-center gap-2 font-semibold text-blue-700"><ArrowLeft size={17} /> Volver</Link><h1 className="text-3xl font-extrabold">Configuración</h1><p className="muted mb-7 mt-2">Datos que aparecerán en los presupuestos y PDFs.</p><div className="space-y-8"><ConfiguracionForm initial={initial} /><PasswordForm /></div></div></AdminLayout>;
}
