import { z } from "zod";
import { isAllowedImageUrl } from "@/lib/security";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(128),
});

export const productoSchema = z.object({
  nombre: z.string().trim().min(1).max(160),
  descripcion: optionalText(2000),
  caracteristicas: optionalText(5000),
  precio: z.number().finite().min(0).max(10_000_000),
  cantidad: z.number().int().min(1).max(100_000),
  imagenUrl: optionalText(2000).refine(
    (value) => isAllowedImageUrl(value),
    "La imagen no pertenece a un dominio autorizado",
  ),
});

export const presupuestoSchema = z.object({
  cliente: z.object({
    nombre: z.string().trim().min(1).max(160),
    email: z.email().max(254),
    telefono: optionalText(40),
    empresa: optionalText(160),
  }),
  productos: z.array(productoSchema).min(1).max(50),
  notas: optionalText(5000),
  ivaPorcentaje: z.number().finite().min(0).max(100),
  estado: z
    .enum(["BORRADOR", "ENVIADO", "ACEPTADO", "RECHAZADO"])
    .optional(),
  publicEnabled: z.boolean().optional(),
  publicExpiresAt: z.iso.datetime().nullable().optional(),
});

export const configuracionSchema = z.object({
  empresaNombre: z.string().trim().min(1).max(160),
  nif: optionalText(30),
  direccion: optionalText(300),
  telefono: optionalText(40),
  email: z.union([z.email().max(254), z.literal("")]).optional(),
  logoUrl: optionalText(2000).refine(
    (value) => isAllowedImageUrl(value),
    "El logo no pertenece a un dominio autorizado",
  ),
  ivaDefault: z.number().finite().min(0).max(100),
  validezDias: z.number().int().min(1).max(365),
});
