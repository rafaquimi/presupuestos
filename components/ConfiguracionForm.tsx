"use client";

import { FormEvent, useState } from "react";
import { Save } from "lucide-react";

type Config = { empresaNombre: string; nif: string; direccion: string; telefono: string; email: string; logoUrl: string; ivaDefault: number; validezDias: number };

export default function ConfiguracionForm({ initial }: { initial: Config }) {
  const [config, setConfig] = useState(initial);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage("");
    const response = await fetch("/api/configuracion", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
    const result = await response.json();
    setMessage(response.ok ? "Configuración guardada" : result.error || "No se pudo guardar");
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="card max-w-3xl space-y-5 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="label">Nombre de empresa *</label><input className="field" required maxLength={160} value={config.empresaNombre} onChange={(e) => setConfig({ ...config, empresaNombre: e.target.value })} /></div>
        <div><label className="label">NIF/CIF</label><input className="field" maxLength={30} value={config.nif} onChange={(e) => setConfig({ ...config, nif: e.target.value })} /></div>
        <div><label className="label">Correo</label><input className="field" type="email" maxLength={254} value={config.email} onChange={(e) => setConfig({ ...config, email: e.target.value })} /></div>
        <div><label className="label">Teléfono</label><input className="field" maxLength={40} value={config.telefono} onChange={(e) => setConfig({ ...config, telefono: e.target.value })} /></div>
        <div><label className="label">Dirección</label><input className="field" maxLength={300} value={config.direccion} onChange={(e) => setConfig({ ...config, direccion: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className="label">URL HTTPS del logotipo</label><input className="field" type="url" maxLength={2000} value={config.logoUrl} onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })} /><p className="muted mt-1 text-xs">Debe pertenecer a ALLOWED_IMAGE_HOSTS.</p></div>
        <div><label className="label">IVA predeterminado (%)</label><input className="field" type="number" min="0" max="100" step="0.01" value={config.ivaDefault} onChange={(e) => setConfig({ ...config, ivaDefault: Number(e.target.value) })} /></div>
        <div><label className="label">Validez predeterminada (días)</label><input className="field" type="number" min="1" max="365" value={config.validezDias} onChange={(e) => setConfig({ ...config, validezDias: Number(e.target.value) })} /></div>
      </div>
      {message && <p role="status" className="font-semibold text-slate-600">{message}</p>}
      <button className="btn btn-primary" disabled={saving}><Save size={18} /> {saving ? "Guardando…" : "Guardar configuración"}</button>
    </form>
  );
}
