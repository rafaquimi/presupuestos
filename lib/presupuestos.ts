import { Prisma } from "@prisma/client";

export function calculateTotals(
  productos: Array<{ precio: number; cantidad: number }>,
  ivaPorcentaje: number,
) {
  const subtotalCents = productos.reduce(
    (sum, producto) =>
      sum + Math.round(producto.precio * 100) * producto.cantidad,
    0,
  );
  const ivaCents = Math.round((subtotalCents * ivaPorcentaje) / 100);
  return {
    subtotal: new Prisma.Decimal(subtotalCents).div(100),
    iva: new Prisma.Decimal(ivaCents).div(100),
    total: new Prisma.Decimal(subtotalCents + ivaCents).div(100),
  };
}

export function toNumber(value: Prisma.Decimal | number) {
  return typeof value === "number" ? value : value.toNumber();
}

type ProductoSerializable = Record<string, unknown> & {
  precio: Prisma.Decimal | number;
};

type PresupuestoSerializable = Record<string, unknown> & {
  subtotal: Prisma.Decimal | number;
  iva: Prisma.Decimal | number;
  total: Prisma.Decimal | number;
  ivaPorcentaje: Prisma.Decimal | number;
  productos: ProductoSerializable[];
};

export function serializePresupuesto<T extends PresupuestoSerializable>(presupuesto: T) {
  return {
    ...presupuesto,
    subtotal: toNumber(presupuesto.subtotal),
    iva: toNumber(presupuesto.iva),
    total: toNumber(presupuesto.total),
    ivaPorcentaje: toNumber(presupuesto.ivaPorcentaje),
    productos: presupuesto.productos.map((producto) => ({
      ...producto,
      precio: toNumber(producto.precio),
    })),
  };
}
