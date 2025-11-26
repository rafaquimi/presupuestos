import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { PresupuestoPDF } from "@/lib/pdf-generator";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id },
      include: {
        cliente: true,
        productos: true,
      },
    });

    if (!presupuesto) {
      return NextResponse.json(
        { error: "Presupuesto no encontrado" },
        { status: 404 }
      );
    }

    // Generar PDF usando renderToBuffer
    const pdfDoc = PresupuestoPDF({ presupuesto });
    const pdfBuffer = await renderToBuffer(pdfDoc);

    // Retornar PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="presupuesto-${presupuesto.numero}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Error al generar el PDF" },
      { status: 500 }
    );
  }
}

