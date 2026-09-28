"use client";

import { useRouter } from "next/navigation";
import { Copy, Mail, RefreshCcw, Trash2 } from "lucide-react";
import { useState } from "react";

export default function PresupuestoActions({ id, publicToken, publicEnabled }: { id: string; publicToken: string; publicEnabled: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  async function copyLink() {
    if (!publicEnabled) return setMessage("Activa el enlace público antes de copiarlo.");
    await navigator.clipboard.writeText(`${window.location.origin}/ver/${publicToken}`);
    setMessage("Enlace copiado");
  }

  async function sendEmail() {
    setBusy("email"); setMessage("");
    const response = await fetch("/api/presupuestos/enviar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ presupuestoId: id }) });
    const result = await response.json();
    setMessage(response.ok ? "Correo enviado" : result.error || "No se pudo enviar");
    setBusy(""); router.refresh();
  }

  async function rotateLink() {
    if (!confirm("El enlace anterior dejará de funcionar. ¿Continuar?")) return;
    setBusy("rotate"); setMessage("");
    const response = await fetch(`/api/presupuestos/${id}`, { method: "POST" });
    setMessage(response.ok ? "Enlace renovado" : "No se pudo renovar");
    setBusy(""); router.refresh();
  }

  async function remove() {
    if (!confirm("¿Eliminar definitivamente este presupuesto?")) return;
    setBusy("delete");
    const response = await fetch(`/api/presupuestos/${id}`, { method: "DELETE" });
    if (response.ok) { router.push("/"); router.refresh(); return; }
    setMessage("No se pudo eliminar"); setBusy("");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button className="btn btn-secondary" onClick={copyLink}><Copy size={17} /> Copiar enlace</button>
        <button className="btn btn-secondary" onClick={sendEmail} disabled={Boolean(busy)}><Mail size={17} /> {busy === "email" ? "Enviando…" : "Enviar email"}</button>
        <button className="btn btn-ghost" onClick={rotateLink} disabled={Boolean(busy)}><RefreshCcw size={17} /> Renovar enlace</button>
        <button className="btn btn-danger" onClick={remove} disabled={Boolean(busy)}><Trash2 size={17} /> Eliminar</button>
      </div>
      {message && <p className="mt-3 text-sm font-semibold text-slate-600" role="status">{message}</p>}
    </div>
  );
}
