import "server-only";
import { prisma } from "@/lib/prisma";

export async function getConfiguracion() {
  return prisma.configuracion.upsert({
    where: { id: "principal" },
    create: {
      id: "principal",
      empresaNombre: "Mi empresa",
      ivaDefault: 21,
      validezDias: 30,
    },
    update: {},
  });
}
