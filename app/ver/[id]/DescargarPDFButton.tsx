"use client";

import { useState } from "react";
import { Download } from "lucide-react";

interface DescargarPDFButtonProps {
  presupuestoId: string;
}

export default function DescargarPDFButton({
  presupuestoId,
}: DescargarPDFButtonProps) {
  const [descargando, setDescargando] = useState(false);

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
    <button
      onClick={descargarPDF}
      disabled={descargando}
      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-5 h-5" />
      <span>{descargando ? "Generando PDF..." : "Descargar PDF"}</span>
    </button>
  );
}



