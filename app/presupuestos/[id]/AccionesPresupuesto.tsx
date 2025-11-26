"use client";

import { useState } from "react";
import { Download, Send, Link2, Check } from "lucide-react";

interface AccionesPresupuestoProps {
  presupuestoId: string;
  clienteEmail: string;
  enlacePublico: string;
}

export default function AccionesPresupuesto({
  presupuestoId,
  clienteEmail,
  enlacePublico,
}: AccionesPresupuestoProps) {
  const [copiado, setCopiado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [descargando, setDescargando] = useState(false);

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(enlacePublico);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (error) {
      alert("Error al copiar el enlace");
    }
  };

  const enviarEmail = async () => {
    if (!confirm(`¿Enviar presupuesto a ${clienteEmail}?`)) {
      return;
    }

    setEnviando(true);
    try {
      const response = await fetch("/api/presupuestos/enviar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          presupuestoId,
          email: clienteEmail,
          enlacePublico,
        }),
      });

      if (response.ok) {
        alert("Presupuesto enviado correctamente");
      } else {
        alert("Error al enviar el presupuesto");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar el presupuesto");
    } finally {
      setEnviando(false);
    }
  };

  const descargarPDF = async () => {
    setDescargando(true);
    try {
      const response = await fetch(`/api/presupuestos/${presupuestoId}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `presupuesto-${presupuestoId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Error al descargar el PDF");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al descargar el PDF");
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acciones</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={copiarEnlace}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {copiado ? (
            <>
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-600">¡Copiado!</span>
            </>
          ) : (
            <>
              <Link2 className="w-5 h-5" />
              <span>Copiar Enlace</span>
            </>
          )}
        </button>

        <button
          onClick={enviarEmail}
          disabled={enviando}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
          <span>{enviando ? "Enviando..." : "Enviar por Email"}</span>
        </button>

        <button
          onClick={descargarPDF}
          disabled={descargando}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          <span>{descargando ? "Descargando..." : "Descargar PDF"}</span>
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Enlace público:</p>
        <code className="text-sm text-blue-600 break-all">{enlacePublico}</code>
      </div>
    </div>
  );
}


