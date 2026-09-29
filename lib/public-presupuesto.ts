import "server-only";
import { prisma } from "@/lib/prisma";

export async function getPublicPresupuesto(token: string) {
  const presupuesto = await prisma.presupuesto.findUnique({
    where: { publicToken: token },
    include: { productos: true },
  });
  if (!presupuesto || !presupuesto.publicEnabled) return null;
  if (presupuesto.publicExpiresAt && presupuesto.publicExpiresAt < new Date()) return null;
  return presupuesto;
}
