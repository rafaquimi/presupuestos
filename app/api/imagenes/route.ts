import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  assertSameOrigin,
  csrfRejected,
  generatePublicToken,
  requireApiUser,
  unauthorized,
} from "@/lib/security";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

function detectedMime(bytes: Uint8Array) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) return "image/png";
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return "image/webp";
  return null;
}

export async function POST(request: Request) {
  if (!(await requireApiUser())) return unauthorized();
  if (!assertSameOrigin(request)) return csrfRejected();

  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > MAX_IMAGE_BYTES + 100_000) {
    return NextResponse.json({ error: "La imagen supera el máximo de 3 MB" }, { status: 413 });
  }

  try {
    const form = await request.formData();
    const file = form.get("imagen");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Selecciona una imagen" }, { status: 400 });
    }
    if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "La imagen debe ocupar entre 1 byte y 3 MB" }, { status: 400 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const mimeType = detectedMime(bytes);
    if (!mimeType) {
      return NextResponse.json({ error: "Formato no permitido. Usa JPG, PNG o WebP" }, { status: 400 });
    }

    const token = generatePublicToken();
    await prisma.imagenProducto.create({
      data: {
        token,
        mimeType,
        datos: Buffer.from(bytes),
        tamano: file.size,
      },
    });

    return NextResponse.json({ url: `/api/public/imagenes/${token}` }, { status: 201 });
  } catch (error) {
    console.error("Error subiendo imagen", error);
    return NextResponse.json({ error: "No se pudo guardar la imagen" }, { status: 500 });
  }
}
