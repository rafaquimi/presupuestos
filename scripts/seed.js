const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Sembrando base de datos con datos de ejemplo...");

  // Limpiar datos existentes (opcional)
  // await prisma.producto.deleteMany();
  // await prisma.presupuesto.deleteMany();
  // await prisma.cliente.deleteMany();

  // Crear clientes de ejemplo
  const cliente1 = await prisma.cliente.create({
    data: {
      nombre: "Juan Pérez García",
      email: "juan.perez@ejemplo.com",
      telefono: "612 345 678",
      empresa: "Tecnologías Pérez S.L.",
    },
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      nombre: "María López Fernández",
      email: "maria.lopez@ejemplo.com",
      telefono: "698 765 432",
      empresa: "López Consulting",
    },
  });

  const cliente3 = await prisma.cliente.create({
    data: {
      nombre: "Carlos Martínez",
      email: "carlos.martinez@ejemplo.com",
      telefono: "655 123 456",
    },
  });

  // Crear presupuestos de ejemplo
  const presupuesto1 = await prisma.presupuesto.create({
    data: {
      numero: "PRES-000001",
      clienteId: cliente1.id,
      total: 1599.99,
      estado: "enviado",
      notas:
        "Presupuesto válido por 30 días. Incluye instalación y configuración básica del sistema. Garantía de 2 años en todos los componentes.",
      productos: {
        create: [
          {
            nombre: "PC Gaming Avanzado",
            descripcion:
              "Ordenador de sobremesa de alto rendimiento para gaming y edición profesional",
            caracteristicas:
              "Intel Core i7-13700K (16 núcleos, hasta 5.4GHz)\n32GB RAM DDR5 6000MHz\nNVIDIA GeForce RTX 4070 Ti 12GB GDDR6X\nSSD NVMe 1TB PCIe 4.0\nHDD 2TB 7200RPM\nFuente de alimentación 850W 80+ Gold\nCaja ATX RGB con ventiladores incluidos\nWindows 11 Pro",
            precio: 1599.99,
            cantidad: 1,
            imagenUrl:
              "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400",
          },
        ],
      },
    },
  });

  const presupuesto2 = await prisma.presupuesto.create({
    data: {
      numero: "PRES-000002",
      clienteId: cliente2.id,
      total: 3849.97,
      estado: "aceptado",
      notas:
        "Setup completo de oficina. Incluye configuración de red y transferencia de datos. Instalación programada para la semana del 25 de noviembre.",
      productos: {
        create: [
          {
            nombre: "Portátil Profesional Dell XPS 15",
            descripcion:
              "Portátil premium para trabajo profesional con pantalla táctil 4K",
            caracteristicas:
              "Intel Core i9-13900H\n32GB RAM DDR5\nSSD 1TB NVMe\nNVIDIA RTX 4060 8GB\nPantalla 15.6 OLED 4K Táctil\nTeclado retroiluminado\nLector de huellas\nWindows 11 Pro\nIncluye mochila y mouse inalámbrico",
            precio: 2299.99,
            cantidad: 1,
            imagenUrl:
              "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
          },
          {
            nombre: "Monitor 4K Dell UltraSharp 27",
            descripcion:
              "Monitor profesional con calibración de color de fábrica",
            caracteristicas:
              "27 pulgadas 4K UHD (3840x2160)\nPanel IPS con 99% sRGB\nHDR400\nUSB-C con 90W Power Delivery\nHub USB integrado\nAltura ajustable y pivotante",
            precio: 549.99,
            cantidad: 2,
            imagenUrl:
              "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
          },
          {
            nombre: "Teclado Mecánico Logitech MX Keys",
            descripcion: "Teclado inalámbrico premium para productividad",
            caracteristicas:
              "Switches mecánicos silenciosos\nRetroiluminación inteligente\nConexión Bluetooth o USB\nBatería recargable (hasta 10 días)\nCompatible con 3 dispositivos\nDiseño de teclas cóncavas",
            precio: 129.99,
            cantidad: 2,
            imagenUrl:
              "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
          },
          {
            nombre: "Mouse Ergonómico Logitech MX Master 3S",
            descripcion: "Mouse inalámbrico ergonómico de alta precisión",
            caracteristicas:
              "Sensor de 8000 DPI\n7 botones personalizables\nRueda de desplazamiento electromagnética\nBatería recargable (hasta 70 días)\nConexión Bluetooth o USB\nCompatible con 3 dispositivos",
            precio: 109.99,
            cantidad: 2,
            imagenUrl:
              "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
          },
        ],
      },
    },
  });

  const presupuesto3 = await prisma.presupuesto.create({
    data: {
      numero: "PRES-000003",
      clienteId: cliente3.id,
      total: 899.99,
      estado: "borrador",
      notas:
        "Cliente interesado en PC para uso doméstico y trabajo remoto básico.",
      productos: {
        create: [
          {
            nombre: "PC Oficina Estándar",
            descripcion:
              "Ordenador completo para tareas de oficina y trabajo remoto",
            caracteristicas:
              "Intel Core i5-12400 (6 núcleos)\n16GB RAM DDR4\nSSD 512GB NVMe\nGráficos integrados Intel UHD 730\nWiFi 6 y Bluetooth 5.2\nFuente 500W 80+ Bronze\nCaja Micro-ATX compacta\nWindows 11 Home",
            precio: 699.99,
            cantidad: 1,
            imagenUrl:
              "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400",
          },
          {
            nombre: "Webcam Full HD Logitech C920",
            descripcion: "Cámara web profesional para videoconferencias",
            caracteristicas:
              "Resolución 1080p a 30fps\nCorrección automática de luz\nMicrófono estéreo integrado\nCompatible con todas las plataformas\nClip universal para monitor",
            precio: 79.99,
            cantidad: 1,
            imagenUrl:
              "https://images.unsplash.com/photo-1614963280804-924b8d3ad4b3?w=400",
          },
          {
            nombre: "Auriculares con Micrófono USB",
            descripcion: "Auriculares profesionales para videollamadas",
            caracteristicas:
              "Conexión USB plug-and-play\nCancelación de ruido del micrófono\nAlmohadillas acolchadas\nControles en el cable\nCompatible con Windows/Mac/Linux",
            precio: 49.99,
            cantidad: 1,
            imagenUrl:
              "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
          },
          {
            nombre: "Alfombrilla de ratón XXL",
            descripcion: "Alfombrilla grande para teclado y ratón",
            caracteristicas:
              "90cm x 40cm\nBase de goma antideslizante\nSuperficie lisa para precisión\nBorde cosido\nLavable",
            precio: 19.99,
            cantidad: 1,
            imagenUrl:
              "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=400",
          },
          {
            nombre: "Hub USB 3.0 de 7 puertos",
            descripcion: "Expansor USB con carga rápida",
            caracteristicas:
              "7 puertos USB 3.0\nTransferencia hasta 5Gbps\n3 puertos con carga rápida\nLED indicador\nCable de 1 metro incluido",
            precio: 29.99,
            cantidad: 1,
            imagenUrl:
              "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400",
          },
        ],
      },
    },
  });

  console.log("✅ Base de datos poblada con éxito!");
  console.log(`📊 Creados 3 clientes`);
  console.log(`📊 Creados 3 presupuestos`);
  const totalProductos = await prisma.producto.count();
  console.log(`📊 Total de productos: ${totalProductos}`);
  console.log("\n🎉 Puedes acceder a la aplicación en http://localhost:3000");
}

main()
  .catch((e) => {
    console.error("❌ Error al sembrar la base de datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



