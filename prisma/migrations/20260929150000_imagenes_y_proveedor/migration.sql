ALTER TABLE "Presupuesto"
ADD COLUMN "proveedor" TEXT;

CREATE TABLE "ImagenProducto" (
  "id" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "datos" BYTEA NOT NULL,
  "tamano" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ImagenProducto_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ImagenProducto_token_key" ON "ImagenProducto"("token");
CREATE INDEX "ImagenProducto_createdAt_idx" ON "ImagenProducto"("createdAt");
