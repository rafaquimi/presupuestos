"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle, Trash2, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  caracteristicas: string;
  precio: number;
  cantidad: number;
  imagenUrl: string;
}

export default function NuevoPresupuesto() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Datos del cliente
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [clienteEmpresa, setClienteEmpresa] = useState("");
  
  // Datos del presupuesto
  const [notas, setNotas] = useState("");
  const [productos, setProductos] = useState<Producto[]>([]);

  const agregarProducto = () => {
    const nuevoProducto: Producto = {
      id: Date.now().toString(),
      nombre: "",
      descripcion: "",
      caracteristicas: "",
      precio: 0,
      cantidad: 1,
      imagenUrl: "",
    };
    setProductos([...productos, nuevoProducto]);
  };

  const eliminarProducto = (id: string) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  const actualizarProducto = (id: string, campo: string, valor: any) => {
    setProductos(
      productos.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
    );
  };

  const calcularTotal = () => {
    return productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/presupuestos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente: {
            nombre: clienteNombre,
            email: clienteEmail,
            telefono: clienteTelefono,
            empresa: clienteEmpresa,
          },
          productos: productos.map((p) => ({
            nombre: p.nombre,
            descripcion: p.descripcion,
            caracteristicas: p.caracteristicas,
            precio: p.precio,
            cantidad: p.cantidad,
            imagenUrl: p.imagenUrl,
          })),
          notas,
          total: calcularTotal(),
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        router.push(`/presupuestos/${data.id}`);
      } else {
        const errorMsg = data.details || data.error || "Error desconocido";
        alert(`Error al crear el presupuesto:\n${errorMsg}`);
        console.error("Error del servidor:", data);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión al crear el presupuesto");
    } finally {
      setLoading(false);
    }
  };

  const handleImagePaste = (productoId: string, e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageUrl = event.target?.result as string;
            actualizarProducto(productoId, "imagenUrl", imageUrl);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

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
            Volver
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">
            Crear Nuevo Presupuesto
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos del Cliente */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Datos del Cliente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={clienteNombre}
                  onChange={(e) => setClienteNombre(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={clienteEmail}
                  onChange={(e) => setClienteEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="juan@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={clienteTelefono}
                  onChange={(e) => setClienteTelefono(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="612 345 678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa
                </label>
                <input
                  type="text"
                  value={clienteEmpresa}
                  onChange={(e) => setClienteEmpresa(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mi Empresa S.L."
                />
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Productos
              </h2>
              <button
                type="button"
                onClick={agregarProducto}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Agregar Producto
              </button>
            </div>

            {productos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No hay productos. Haz clic en "Agregar Producto" para comenzar.
              </div>
            ) : (
              <div className="space-y-6">
                {productos.map((producto, index) => (
                  <div
                    key={producto.id}
                    className="border border-gray-200 rounded-lg p-4 relative"
                  >
                    <button
                      type="button"
                      onClick={() => eliminarProducto(producto.id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <h3 className="font-semibold text-gray-900 mb-4">
                      Producto {index + 1}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre del Producto *
                        </label>
                        <input
                          type="text"
                          required
                          value={producto.nombre}
                          onChange={(e) =>
                            actualizarProducto(
                              producto.id,
                              "nombre",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="PC Gaming Custom"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descripción
                        </label>
                        <textarea
                          value={producto.descripcion}
                          onChange={(e) =>
                            actualizarProducto(
                              producto.id,
                              "descripcion",
                              e.target.value
                            )
                          }
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Descripción del producto"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Características (una por línea)
                        </label>
                        <textarea
                          value={producto.caracteristicas}
                          onChange={(e) =>
                            actualizarProducto(
                              producto.id,
                              "caracteristicas",
                              e.target.value
                            )
                          }
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Intel Core i7-13700K&#10;32GB RAM DDR5&#10;RTX 4070 Ti 12GB&#10;SSD 1TB NVMe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Precio (€) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={producto.precio}
                          onChange={(e) =>
                            actualizarProducto(
                              producto.id,
                              "precio",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="1299.99"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cantidad *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={producto.cantidad}
                          onChange={(e) =>
                            actualizarProducto(
                              producto.id,
                              "cantidad",
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="1"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Imagen del Producto
                        </label>
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
                          onPaste={(e) => handleImagePaste(producto.id, e)}
                        >
                          {producto.imagenUrl ? (
                            <div className="relative">
                              <Image
                                src={producto.imagenUrl}
                                alt={producto.nombre}
                                width={200}
                                height={200}
                                className="mx-auto rounded-lg object-cover"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  actualizarProducto(
                                    producto.id,
                                    "imagenUrl",
                                    ""
                                  )
                                }
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="py-8">
                              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">
                                Pega una imagen aquí (Ctrl+V)
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                o escribe la URL de la imagen
                              </p>
                              <input
                                type="text"
                                value={producto.imagenUrl}
                                onChange={(e) =>
                                  actualizarProducto(
                                    producto.id,
                                    "imagenUrl",
                                    e.target.value
                                  )
                                }
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="https://ejemplo.com/imagen.jpg"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2 text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          Subtotal: €
                          {(producto.precio * producto.cantidad).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notas adicionales */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Notas Adicionales
            </h2>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Información adicional, condiciones, garantías, etc."
            />
          </div>

          {/* Total y Acciones */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Total del Presupuesto
              </h2>
              <div className="text-3xl font-bold text-blue-600">
                €{calcularTotal().toFixed(2)}
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                href="/"
                className="flex-1 text-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading || productos.length === 0}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creando..." : "Crear Presupuesto"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


