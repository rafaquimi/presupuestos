import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cliente, productos, notas, total } = body;

    // Generar número de presupuesto único
    const count = await prisma.presupuesto.count();
    const numero = `PRES-${String(count + 1).padStart(6, "0")}`;

    // Crear o buscar cliente
    let clienteDb = await prisma.cliente.findFirst({
      where: { email: cliente.email },
    });

    if (!clienteDb) {
      clienteDb = await prisma.cliente.create({
        data: {
          nombre: cliente.nombre,
          email: cliente.email,
          telefono: cliente.telefono || "",
          empresa: cliente.empresa || "",
        },
      });
    }

    // Crear presupuesto con productos
    const presupuesto = await prisma.presupuesto.create({
      data: {
        numero,
        clienteId: clienteDb.id,
        total,
        notas: notas || "",
        estado: "borrador",
        productos: {
          create: productos.map((p: any) => ({
            nombre: p.nombre,
            descripcion: p.descripcion || "",
            caracteristicas: p.caracteristicas || "",
            precio: p.precio,
            cantidad: p.cantidad,
            imagenUrl: p.imagenUrl || "",
          })),
        },
      },
      include: {
        cliente: true,
        productos: true,
      },
    });

    return NextResponse.json(presupuesto, { status: 201 });
  } catch (error) {
    console.error("Error creating presupuesto:", error);
    return NextResponse.json(
      { error: "Error al crear el presupuesto" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const presupuestos = await prisma.presupuesto.findMany({
      include: {
        cliente: true,
        productos: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(presupuestos);
  } catch (error) {
    console.error("Error fetching presupuestos:", error);
    return NextResponse.json(
      { error: "Error al obtener presupuestos" },
      { status: 500 }
    );
  }
}


