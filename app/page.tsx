import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PlusCircle, FileText, Calendar, User } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

// Forzar renderizado dinámico (no estático durante el build)
export const dynamic = 'force-dynamic';

async function getPresupuestos() {
  const presupuestos = await prisma.presupuesto.findMany({
    include: {
      cliente: true,
      productos: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return presupuestos;
}

type PresupuestoConRelaciones = Awaited<ReturnType<typeof getPresupuestos>>[0];

export default async function Home() {
  const presupuestos = await getPresupuestos();

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gestor de Presupuestos
          </h1>
          <p className="text-gray-600">
            Crea y gestiona presupuestos para tus clientes
          </p>
        </div>

        {/* Botón crear presupuesto */}
        <div className="mb-6">
          <Link
            href="/presupuestos/nuevo"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <PlusCircle className="w-5 h-5" />
            Crear Nuevo Presupuesto
          </Link>
        </div>

        {/* Lista de presupuestos */}
        {presupuestos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay presupuestos
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer presupuesto para comenzar
            </p>
            <Link
              href="/presupuestos/nuevo"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Crear Presupuesto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presupuestos.map((presupuesto: PresupuestoConRelaciones) => (
              <Link
                key={presupuesto.id}
                href={`/presupuestos/${presupuesto.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 p-6 border border-gray-100 hover:border-blue-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Presupuesto #{presupuesto.numero}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        presupuesto.estado === "borrador"
                          ? "bg-gray-100 text-gray-700"
                          : presupuesto.estado === "enviado"
                          ? "bg-blue-100 text-blue-700"
                          : presupuesto.estado === "aceptado"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {presupuesto.estado.charAt(0).toUpperCase() +
                        presupuesto.estado.slice(1)}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    €{presupuesto.total.toFixed(2)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{presupuesto.cliente.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>
                      {presupuesto.productos.length}{" "}
                      {presupuesto.productos.length === 1
                        ? "producto"
                        : "productos"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(presupuesto.createdAt).toLocaleDateString(
                        "es-ES"
                      )}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
}
