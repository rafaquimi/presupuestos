import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks = {
    database: false,
    databaseUrl: !!process.env.DATABASE_URL,
    timestamp: new Date().toISOString(),
    error: null as string | null,
  };

  try {
    // Intentar una consulta simple a la base de datos
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (error: any) {
    checks.error = error?.message || "Error de conexión a la base de datos";
  }

  const status = checks.database ? 200 : 500;

  return NextResponse.json(checks, { status });
}

