import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Download, Calendar, Mail, Phone, Building, User } from "lucide-react";
import Image from "next/image";
import DescargarPDFButton from "./DescargarPDFButton";
import Logo from "@/components/Logo";

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

export default async function VerPresupuestoPublico({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const presupuesto = await getPresupuesto(id);

  if (!presupuesto) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo de la empresa */}
        <div className="mb-6 flex justify-center">
          <Logo size="md" />
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Presupuesto #{presupuesto.numero}
              </h1>
              <p className="text-gray-600">
                {new Date(presupuesto.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Total</div>
              <div className="text-4xl font-bold text-blue-600">
                €{presupuesto.total.toFixed(2)}
              </div>
            </div>
          </div>

          <DescargarPDFButton presupuestoId={presupuesto.id} />
        </div>

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
          </div>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Productos Incluidos
          </h2>
          <div className="space-y-6">
            {presupuesto.productos.map((producto: ProductoType, index: number) => (
              <div
                key={producto.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-6">
                  {producto.imagenUrl && (
                    <div className="flex-shrink-0">
                      <Image
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover shadow-md"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      {index + 1}. {producto.nombre}
                    </h3>
                    {producto.descripcion && (
                      <p className="text-gray-600 mb-4 text-lg">
                        {producto.descripcion}
                      </p>
                    )}
                    {producto.caracteristicas && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                          Características:
                        </h4>
                        <ul className="space-y-2">
                          {producto.caracteristicas
                            .split("\n")
                            .filter((c: string) => c.trim())
                            .map((caracteristica: string, idx: number) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-gray-700"
                              >
                                <span className="text-blue-600 mt-1">✓</span>
                                <span>{caracteristica.trim()}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                      <div className="text-gray-600 text-lg">
                        Cantidad: <span className="font-semibold">{producto.cantidad}</span> x €
                        {producto.precio.toFixed(2)}
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
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
              Información Adicional
            </h2>
            <p className="text-gray-600 whitespace-pre-wrap text-lg">
              {presupuesto.notas}
            </p>
          </div>
        )}

        {/* Total Final */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Total del Presupuesto</h2>
              <p className="text-blue-100">IVA incluido</p>
            </div>
            <div className="text-5xl font-bold">
              €{presupuesto.total.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Si tienes alguna pregunta sobre este presupuesto, no dudes en
            contactarnos.
          </p>
          <p className="text-sm mt-2">
            Este presupuesto es válido por 30 días desde la fecha de emisión.
          </p>
        </div>
      </div>
    </div>
  );
}

