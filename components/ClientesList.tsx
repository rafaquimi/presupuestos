"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type Cliente = { id: string; nombre: string; email: string; telefono: string | null; empresa: string | null; _count: { presupuestos: number } };

export default function ClientesList({ clientes }: { clientes: Cliente[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function remove(id: string) {
    if (!confirm("¿Eliminar este cliente?")) return;
    const response = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
    if (!response.ok) { const result = await response.json(); setMessage(result.error || "No se pudo eliminar"); return; }
    router.refresh();
  }
  return <>{message && <p className="mb-4 rounded-lg bg-amber-50 p-3 font-semibold text-amber-800">{message}</p>}<div className="card overflow-x-auto"><table className="w-full min-w-160 border-collapse text-left"><thead className="bg-slate-50 text-sm text-slate-600"><tr><th className="p-4">Cliente</th><th className="p-4">Contacto</th><th className="p-4">Presupuestos</th><th className="p-4 text-right">Acciones</th></tr></thead><tbody>{clientes.map((c) => <tr key={c.id} className="border-t border-slate-100"><td className="p-4"><strong>{c.nombre}</strong>{c.empresa && <p className="muted text-sm">{c.empresa}</p>}</td><td className="p-4 text-sm"><p>{c.email}</p>{c.telefono && <p className="muted">{c.telefono}</p>}</td><td className="p-4">{c._count.presupuestos}</td><td className="p-4 text-right"><button className="btn btn-danger px-3" disabled={c._count.presupuestos > 0} onClick={() => remove(c.id)} title={c._count.presupuestos ? "Tiene presupuestos asociados" : "Eliminar"}><Trash2 size={17} /></button></td></tr>)}</tbody></table>{!clientes.length && <p className="p-10 text-center text-slate-500">No hay clientes.</p>}</div></>;
}
