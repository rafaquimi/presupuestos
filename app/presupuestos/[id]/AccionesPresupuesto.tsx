"use client";

import { useState } from "react";
import { Download, Send, Link2, Check, MessageCircle } from "lucide-react";

interface AccionesPresupuestoProps {
  presupuestoId: string;
  clienteEmail: string;
  clienteTelefono?: string;
  numeroPresupuesto: string;
  total: number;
  enlacePublico: string;
}

export default function AccionesPresupuesto({
  presupuestoId,
  clienteEmail,
  clienteTelefono,
  numeroPresupuesto,
  total,
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

  const enviarPorWhatsApp = () => {
    if (!clienteTelefono) {
      alert("El cliente no tiene un número de teléfono registrado");
      return;
    }

    // Limpiar el número de teléfono (quitar espacios, guiones, etc)
    const telefonoLimpio = clienteTelefono.replace(/\D/g, "");
    
    // Crear el mensaje
    const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "Su Tienda de Informática";
    const mensaje = `Hola! 👋

Le enviamos el presupuesto #${numeroPresupuesto} que solicitó.

💰 Total: €${total.toFixed(2)}

📄 Puede ver el presupuesto completo aquí:
${enlacePublico}

Quedamos a su disposición para cualquier consulta.

Saludos,
${companyName}`;

    // Crear la URL de WhatsApp
    const mensajeCodificado = encodeURIComponent(mensaje);
    const whatsappUrl = `https://wa.me/${telefonoLimpio}?text=${mensajeCodificado}`;
    
    // Abrir WhatsApp en una nueva ventana
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acciones</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          onClick={enviarPorWhatsApp}
          disabled={!clienteTelefono}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={!clienteTelefono ? "El cliente no tiene teléfono registrado" : "Enviar por WhatsApp"}
        >
          <MessageCircle className="w-5 h-5" />
          <span>Enviar por WhatsApp</span>
        </button>

        <button
          onClick={descargarPDF}
          disabled={descargando}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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


