import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks = {
    database: false,
    timestamp: new Date().toISOString(),
  };

  try {
    // Intentar una consulta simple a la base de datos
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch {
    // No se devuelven detalles internos de conexión.
  }

  const status = checks.database ? 200 : 500;

  return NextResponse.json(checks, { status });
}
