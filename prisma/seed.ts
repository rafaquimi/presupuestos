import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const nombre = process.env.ADMIN_NAME?.trim() || "Administrador";

  if (!email || !password || password.length < 12) {
    throw new Error("Define ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 12 caracteres) antes de ejecutar el seed");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.usuario.upsert({
    where: { email },
    create: { email, nombre, passwordHash },
    update: { nombre, passwordHash, activo: true },
  });
  await prisma.configuracion.upsert({
    where: { id: "principal" },
    create: { id: "principal", empresaNombre: "Mi empresa", ivaDefault: 21, validezDias: 30 },
    update: {},
  });
  console.log(`Administrador preparado: ${email}`);
}

main().finally(() => prisma.$disconnect());
