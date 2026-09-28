"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo iniciar sesión");
      window.location.assign(nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="label" htmlFor="email">Correo electrónico</label>
        <div className="relative"><Mail className="absolute left-3 top-3 text-slate-400" size={19} /><input id="email" className="field pl-10" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      </div>
      <div>
        <label className="label" htmlFor="password">Contraseña</label>
        <div className="relative"><LockKeyhole className="absolute left-3 top-3 text-slate-400" size={19} /><input id="password" className="field pl-10" type="password" autoComplete="current-password" required minLength={8} maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
      <button className="btn btn-primary w-full" disabled={loading}>{loading ? "Comprobando…" : "Entrar"}</button>
    </form>
  );
}
