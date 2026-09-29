import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) {
    return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 });
  }

  const image = await prisma.imagenProducto.findUnique({
    where: { token },
    select: { datos: true, mimeType: true },
  });
  if (!image) return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 });

  return new NextResponse(image.datos as unknown as BodyInit, {
    headers: {
      "Content-Type": image.mimeType,
      "Content-Length": String(image.datos.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    },
  });
}
