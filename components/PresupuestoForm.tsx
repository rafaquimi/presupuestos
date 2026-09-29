"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";

type ProductoForm = {
  key: string;
  nombre: string;
  descripcion: string;
  caracteristicas: string;
  precio: number;
  cantidad: number;
  imagenUrl: string;
};

export type PresupuestoInicial = {
  id: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string | null;
  clienteEmpresa?: string | null;
  notas?: string | null;
  ivaPorcentaje: number;
  estado: "BORRADOR" | "ENVIADO" | "ACEPTADO" | "RECHAZADO";
  publicEnabled: boolean;
  publicExpiresAt?: string | Date | null;
  productos: Array<Omit<ProductoForm, "key"> & { id?: string }>;
};

const emptyProduct = (): ProductoForm => ({
  key: crypto.randomUUID(), nombre: "", descripcion: "", caracteristicas: "", precio: 0, cantidad: 1, imagenUrl: "",
});

export default function PresupuestoForm({ initial, defaultVat = 21 }: { initial?: PresupuestoInicial; defaultVat?: number }) {
  const router = useRouter();
  const [cliente, setCliente] = useState({
    nombre: initial?.clienteNombre || "", email: initial?.clienteEmail || "", telefono: initial?.clienteTelefono || "", empresa: initial?.clienteEmpresa || "",
  });
  const [productos, setProductos] = useState<ProductoForm[]>(
    initial?.productos.map((p) => ({ ...p, key: p.id || crypto.randomUUID() })) || [emptyProduct()],
  );
  const [notas, setNotas] = useState(initial?.notas || "");
  const [iva, setIva] = useState(initial?.ivaPorcentaje ?? defaultVat);
  const [estado, setEstado] = useState(initial?.estado || "BORRADOR");
  const [publicEnabled, setPublicEnabled] = useState(initial?.publicEnabled ?? true);
  const [expires, setExpires] = useState(initial?.publicExpiresAt ? new Date(initial.publicExpiresAt).toISOString().slice(0, 10) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  const totals = useMemo(() => {
    const subtotal = productos.reduce((sum, p) => sum + (Number(p.precio) || 0) * (Number(p.cantidad) || 0), 0);
    const tax = subtotal * (Number(iva) || 0) / 100;
    return { subtotal, tax, total: subtotal + tax };
  }, [productos, iva]);

  function updateProduct(key: string, field: keyof ProductoForm, value: string | number) {
    setProductos((current) => current.map((p) => p.key === key ? { ...p, [field]: value } : p));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setErrorDetails([]);
    try {
      const response = await fetch(initial ? `/api/presupuestos/${initial.id}` : "/api/presupuestos", {
        method: initial ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente,
          productos: productos.map((product) => ({
            nombre: product.nombre,
            descripcion: product.descripcion,
            caracteristicas: product.caracteristicas,
            precio: product.precio,
            cantidad: product.cantidad,
            imagenUrl: product.imagenUrl,
          })),
          notas,
          ivaPorcentaje: Number(iva),
          estado,
          publicEnabled,
          publicExpiresAt: expires ? new Date(`${expires}T23:59:59.999Z`).toISOString() : null,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (Array.isArray(result.details)) {
          setErrorDetails(result.details.filter((detail: unknown): detail is string => typeof detail === "string"));
        }
        throw new Error(result.error || "No se pudo guardar");
      }
      router.push(`/presupuestos/${result.id}`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo guardar");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-semibold">{error}</p>
          {errorDetails.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {errorDetails.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
          )}
        </div>
      )}

      <section className="card p-5 sm:p-7">
        <h2 className="mb-5 text-xl font-extrabold">Cliente</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Nombre *</label><input className="field" required maxLength={160} value={cliente.nombre} onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })} /></div>
          <div><label className="label">Correo *</label><input className="field" type="email" required maxLength={254} value={cliente.email} onChange={(e) => setCliente({ ...cliente, email: e.target.value })} /></div>
          <div><label className="label">Teléfono</label><input className="field" maxLength={40} value={cliente.telefono} onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })} /></div>
          <div><label className="label">Empresa</label><input className="field" maxLength={160} value={cliente.empresa} onChange={(e) => setCliente({ ...cliente, empresa: e.target.value })} /></div>
        </div>
      </section>

      <section className="card p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3 mobile-stack"><div><h2 className="text-xl font-extrabold">Productos</h2><p className="muted mt-1 text-sm">Hasta 50 líneas por presupuesto.</p></div><button type="button" className="btn btn-secondary" onClick={() => setProductos([...productos, emptyProduct()])}><Plus size={18} /> Añadir producto</button></div>
        <div className="space-y-5">
          {productos.map((product, index) => (
            <article key={product.key} className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between"><h3 className="font-extrabold">Producto {index + 1}</h3><button type="button" className="btn btn-danger px-3" aria-label={`Eliminar producto ${index + 1}`} disabled={productos.length === 1} onClick={() => setProductos(productos.filter((p) => p.key !== product.key))}><Trash2 size={17} /></button></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><label className="label">Nombre *</label><input className="field" required maxLength={160} value={product.nombre} onChange={(e) => updateProduct(product.key, "nombre", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className="label">Descripción</label><textarea className="field" rows={2} maxLength={2000} value={product.descripcion} onChange={(e) => updateProduct(product.key, "descripcion", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className="label">Características (una por línea)</label><textarea className="field" rows={4} maxLength={5000} value={product.caracteristicas} onChange={(e) => updateProduct(product.key, "caracteristicas", e.target.value)} /></div>
                <div><label className="label">Precio sin IVA *</label><input className="field" type="number" min="0" max="10000000" step="0.01" required value={product.precio} onChange={(e) => updateProduct(product.key, "precio", Number(e.target.value))} /></div>
                <div><label className="label">Cantidad *</label><input className="field" type="number" min="1" max="100000" step="1" required value={product.cantidad} onChange={(e) => updateProduct(product.key, "cantidad", Number(e.target.value))} /></div>
                <div className="sm:col-span-2"><label className="label">URL HTTPS de imagen</label><input className="field" type="url" maxLength={2000} placeholder="Debe pertenecer a un dominio autorizado" value={product.imagenUrl} onChange={(e) => updateProduct(product.key, "imagenUrl", e.target.value)} /><p className="muted mt-1 text-xs">Los dominios permitidos se configuran en ALLOWED_IMAGE_HOSTS.</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card p-5 sm:p-7">
        <h2 className="mb-5 text-xl font-extrabold">Condiciones</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label className="label">IVA (%)</label><input className="field" type="number" min="0" max="100" step="0.01" value={iva} onChange={(e) => setIva(Number(e.target.value))} /></div>
          <div><label className="label">Estado</label><select className="field" value={estado} onChange={(e) => setEstado(e.target.value as typeof estado)}><option value="BORRADOR">Borrador</option><option value="ENVIADO">Enviado</option><option value="ACEPTADO">Aceptado</option><option value="RECHAZADO">Rechazado</option></select></div>
          <div><label className="label">Caducidad del enlace</label><input className="field" type="date" value={expires} onChange={(e) => setExpires(e.target.value)} /></div>
          <div className="sm:col-span-3"><label className="flex items-center gap-3 font-semibold"><input type="checkbox" checked={publicEnabled} onChange={(e) => setPublicEnabled(e.target.checked)} /> Permitir acceso mediante enlace público seguro</label></div>
          <div className="sm:col-span-3"><label className="label">Notas</label><textarea className="field" rows={4} maxLength={5000} value={notas} onChange={(e) => setNotas(e.target.value)} /></div>
        </div>
      </section>

      <section className="card flex items-center justify-between gap-5 p-5 mobile-stack">
        <div className="space-y-1 text-right sm:ml-auto"><p className="muted">Subtotal: {totals.subtotal.toFixed(2)} €</p><p className="muted">IVA: {totals.tax.toFixed(2)} €</p><p className="text-2xl font-extrabold text-blue-700">Total: {totals.total.toFixed(2)} €</p></div>
        <button className="btn btn-primary min-w-48" disabled={saving}><Save size={18} /> {saving ? "Guardando…" : initial ? "Guardar cambios" : "Crear presupuesto"}</button>
      </section>
    </form>
  );
}
