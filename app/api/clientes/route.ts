import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiUser, unauthorized } from "@/lib/security";

export async function GET(request: Request) {
  if (!(await requireApiUser())) return unauthorized();
  const query = new URL(request.url).searchParams.get("q")?.trim().slice(0, 100) || "";
  const clientes = await prisma.cliente.findMany({
    where: query
      ? { OR: [
          { nombre: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { empresa: { contains: query, mode: "insensitive" } },
        ] }
      : undefined,
    include: { _count: { select: { presupuestos: true } } },
    orderBy: { nombre: "asc" },
    take: 100,
  });
  return NextResponse.json(clientes);
}
