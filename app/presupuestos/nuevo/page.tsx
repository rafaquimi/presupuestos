import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import PresupuestoForm from "@/components/PresupuestoForm";
import { getConfiguracion } from "@/lib/configuracion";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NuevoPresupuestoPage() {
  await requireUser();
  const config = await getConfiguracion();
  return (
    <AdminLayout>
      <div className="container-app py-8">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 font-semibold text-blue-700"><ArrowLeft size={17} /> Volver</Link>
        <h1 className="text-3xl font-extrabold">Nuevo presupuesto</h1>
        <p className="muted mb-7 mt-2">El total se validará y calculará de nuevo en el servidor.</p>
        <PresupuestoForm defaultVat={config.ivaDefault.toNumber()} />
      </div>
    </AdminLayout>
  );
}
