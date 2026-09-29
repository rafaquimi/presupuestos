"use client";

import { FormEvent, useState } from "react";
import { KeyRound } from "lucide-react";

const emptyPasswords = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function PasswordForm() {
  const [passwords, setPasswords] = useState(emptyPasswords);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/auth/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwords),
    });
    const result = await response.json();

    if (response.ok) {
      setPasswords(emptyPasswords);
      setMessage("Contraseña actualizada");
    } else {
      setMessage(result.error || "No se pudo cambiar la contraseña");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="card max-w-3xl space-y-5 p-6 sm:p-8">
      <div>
        <h2 className="text-xl font-bold">Seguridad de acceso</h2>
        <p className="muted mt-1 text-sm">
          Cambia la contraseña temporal después del primer inicio de sesión.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Contraseña actual</label>
          <input
            className="field"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            maxLength={128}
            value={passwords.currentPassword}
            onChange={(event) =>
              setPasswords({ ...passwords, currentPassword: event.target.value })
            }
          />
        </div>
        <div>
          <label className="label">Nueva contraseña</label>
          <input
            className="field"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={128}
            value={passwords.newPassword}
            onChange={(event) =>
              setPasswords({ ...passwords, newPassword: event.target.value })
            }
          />
        </div>
        <div>
          <label className="label">Repetir nueva contraseña</label>
          <input
            className="field"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={128}
            value={passwords.confirmPassword}
            onChange={(event) =>
              setPasswords({ ...passwords, confirmPassword: event.target.value })
            }
          />
        </div>
      </div>
      {message && (
        <p role="status" className="font-semibold text-slate-600">
          {message}
        </p>
      )}
      <button className="btn btn-primary" disabled={saving}>
        <KeyRound size={18} />
        {saving ? "Actualizando…" : "Cambiar contraseña"}
      </button>
    </form>
  );
}
