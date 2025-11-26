import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft,
  Download,
  Send,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  FileText,
} from "lucide-react";
import Image from "next/image";
import AccionesPresupuesto from "./AccionesPresupuesto";

async function getPresupuesto(id: string) {
  const presupuesto = await prisma.presupuesto.findUnique({
    where: { id },
    include: {
      cliente: true,
      productos: true,
    },
  });

  return presupuesto;
}

type PresupuestoConRelaciones = NonNullable<Awaited<ReturnType<typeof getPresupuesto>>>;
type ProductoType = PresupuestoConRelaciones['productos'][0];

export default async function PresupuestoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const presupuesto = await getPresupuesto(id);

  if (!presupuesto) {
    notFound();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const enlacePublico = `${appUrl}/ver/${presupuesto.id}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al listado
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Presupuesto #{presupuesto.numero}
              </h1>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
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
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Total</div>
              <div className="text-4xl font-bold text-blue-600">
                €{presupuesto.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <AccionesPresupuesto
          presupuestoId={presupuesto.id}
          clienteEmail={presupuesto.cliente.email}
          enlacePublico={enlacePublico}
        />

        {/* Información del Cliente */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Información del Cliente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Nombre</div>
                <div className="font-medium">{presupuesto.cliente.nombre}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium">{presupuesto.cliente.email}</div>
              </div>
            </div>
            {presupuesto.cliente.telefono && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Teléfono</div>
                  <div className="font-medium">
                    {presupuesto.cliente.telefono}
                  </div>
                </div>
              </div>
            )}
            {presupuesto.cliente.empresa && (
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Empresa</div>
                  <div className="font-medium">
                    {presupuesto.cliente.empresa}
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Fecha de creación</div>
                <div className="font-medium">
                  {new Date(presupuesto.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Productos
          </h2>
          <div className="space-y-6">
            {presupuesto.productos.map((producto: ProductoType, index: number) => (
              <div
                key={producto.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex gap-6">
                  {producto.imagenUrl && (
                    <div className="flex-shrink-0">
                      <Image
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        width={150}
                        height={150}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {index + 1}. {producto.nombre}
                    </h3>
                    {producto.descripcion && (
                      <p className="text-gray-600 mb-3">
                        {producto.descripcion}
                      </p>
                    )}
                    {producto.caracteristicas && (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Características:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {producto.caracteristicas
                            .split("\n")
                            .filter((c: string) => c.trim())
                            .map((caracteristica: string, idx: number) => (
                              <li key={idx}>{caracteristica.trim()}</li>
                            ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                      <div className="text-gray-600">
                        Cantidad: {producto.cantidad} x €
                        {producto.precio.toFixed(2)}
                      </div>
                      <div className="text-xl font-bold text-blue-600">
                        €{(producto.precio * producto.cantidad).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notas */}
        {presupuesto.notas && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Notas Adicionales
            </h2>
            <p className="text-gray-600 whitespace-pre-wrap">
              {presupuesto.notas}
            </p>
          </div>
        )}

        {/* Total */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center text-2xl font-bold">
            <span className="text-gray-900">Total del Presupuesto</span>
            <span className="text-blue-600">
              €{presupuesto.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

