CREATE TYPE "RolUsuario" AS ENUM ('ADMIN');
CREATE TYPE "EstadoPresupuesto" AS ENUM ('BORRADOR', 'ENVIADO', 'ACEPTADO', 'RECHAZADO');

CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'ADMIN',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "IntentoLogin" (
    "clave" TEXT NOT NULL,
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "primerIntentoAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bloqueadoHasta" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "IntentoLogin_pkey" PRIMARY KEY ("clave")
);
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "empresa" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Presupuesto" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "publicToken" TEXT NOT NULL,
    "publicEnabled" BOOLEAN NOT NULL DEFAULT true,
    "publicExpiresAt" TIMESTAMP(3),
    "clienteId" TEXT NOT NULL,
    "clienteNombre" TEXT NOT NULL,
    "clienteEmail" TEXT NOT NULL,
    "clienteTelefono" TEXT,
    "clienteEmpresa" TEXT,
    "notas" TEXT,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "ivaPorcentaje" DECIMAL(5,2) NOT NULL DEFAULT 21,
    "iva" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "estado" "EstadoPresupuesto" NOT NULL DEFAULT 'BORRADOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Presupuesto_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "presupuestoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "caracteristicas" TEXT NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "imagenUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Contador" (
    "id" TEXT NOT NULL,
    "valor" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Contador_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Configuracion" (
    "id" TEXT NOT NULL DEFAULT 'principal',
    "empresaNombre" TEXT NOT NULL,
    "nif" TEXT,
    "direccion" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "logoUrl" TEXT,
    "ivaDefault" DECIMAL(5,2) NOT NULL DEFAULT 21,
    "validezDias" INTEGER NOT NULL DEFAULT 30,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");
CREATE INDEX "Cliente_nombre_idx" ON "Cliente"("nombre");
CREATE UNIQUE INDEX "Presupuesto_numero_key" ON "Presupuesto"("numero");
CREATE UNIQUE INDEX "Presupuesto_publicToken_key" ON "Presupuesto"("publicToken");
CREATE INDEX "Presupuesto_createdAt_idx" ON "Presupuesto"("createdAt");
CREATE INDEX "Presupuesto_estado_idx" ON "Presupuesto"("estado");
CREATE INDEX "Presupuesto_clienteId_idx" ON "Presupuesto"("clienteId");
CREATE INDEX "Producto_presupuestoId_idx" ON "Producto"("presupuestoId");

ALTER TABLE "Presupuesto" ADD CONSTRAINT "Presupuesto_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
