const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Sembrando base de datos con datos de ejemplo...");

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
            caracteristicas: `Intel Core i7-13700K (16 núcleos, hasta 5.4GHz)
32GB RAM DDR5 6000MHz
NVIDIA GeForce RTX 4070 Ti 12GB GDDR6X
SSD NVMe 1TB PCIe 4.0
HDD 2TB 7200RPM
Fuente de alimentación 850W 80+ Gold
Caja ATX RGB con ventiladores incluidos
Windows 11 Pro`,
            precio: 1599.99,
            cantidad: 1,
            imagenUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400",
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
            caracteristicas: `Intel Core i9-13900H
32GB RAM DDR5
SSD 1TB NVMe
NVIDIA RTX 4060 8GB
Pantalla 15.6" OLED 4K Táctil
Teclado retroiluminado
Lector de huellas
Windows 11 Pro
Incluye mochila y mouse inalámbrico`,
            precio: 2299.99,
            cantidad: 1,
            imagenUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
          },
          {
            nombre: "Monitor 4K Dell UltraSharp 27",
            descripcion: "Monitor profesional con calibración de color de fábrica",
            caracteristicas: `27 pulgadas 4K UHD (3840x2160)
Panel IPS con 99% sRGB
HDR400
USB-C con 90W Power Delivery
Hub USB integrado
Altura ajustable y pivotante`,
            precio: 549.99,
            cantidad: 2,
            imagenUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
          },
          {
            nombre: "Teclado Mecánico Logitech MX Keys",
            descripcion: "Teclado inalámbrico premium para productividad",
            caracteristicas: `Switches mecánicos silenciosos
Retroiluminación inteligente
Conexión Bluetooth o USB
Batería recargable (hasta 10 días)
Compatible con 3 dispositivos
Diseño de teclas cóncavas`,
            precio: 129.99,
            cantidad: 2,
            imagenUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
          },
          {
            nombre: "Mouse Ergonómico Logitech MX Master 3S",
            descripcion: "Mouse inalámbrico ergonómico de alta precisión",
            caracteristicas: `Sensor de 8000 DPI
7 botones personalizables
Rueda de desplazamiento electromagnética
Batería recargable (hasta 70 días)
Conexión Bluetooth o USB
Compatible con 3 dispositivos`,
            precio: 109.99,
            cantidad: 2,
            imagenUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
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
      notas: "Cliente interesado en PC para uso doméstico y trabajo remoto básico.",
      productos: {
        create: [
          {
            nombre: "PC Oficina Estándar",
            descripcion: "Ordenador completo para tareas de oficina y trabajo remoto",
            caracteristicas: `Intel Core i5-12400 (6 núcleos)
16GB RAM DDR4
SSD 512GB NVMe
Gráficos integrados Intel UHD 730
WiFi 6 y Bluetooth 5.2
Fuente 500W 80+ Bronze
Caja Micro-ATX compacta
Windows 11 Home`,
            precio: 699.99,
            cantidad: 1,
            imagenUrl: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400",
          },
          {
            nombre: "Webcam Full HD Logitech C920",
            descripcion: "Cámara web profesional para videoconferencias",
            caracteristicas: `Resolución 1080p a 30fps
Corrección automática de luz
Micrófono estéreo integrado
Compatible con todas las plataformas
Clip universal para monitor`,
            precio: 79.99,
            cantidad: 1,
            imagenUrl: "https://images.unsplash.com/photo-1614963280804-924b8d3ad4b3?w=400",
          },
          {
            nombre: "Auriculares con Micrófono USB",
            descripcion: "Auriculares profesionales para videollamadas",
            caracteristicas: `Conexión USB plug-and-play
Cancelación de ruido del micrófono
Almohadillas acolchadas
Controles en el cable
Compatible con Windows/Mac/Linux`,
            precio: 49.99,
            cantidad: 1,
            imagenUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
          },
          {
            nombre: "Alfombrilla de ratón XXL",
            descripcion: "Alfombrilla grande para teclado y ratón",
            caracteristicas: `90cm x 40cm
Base de goma antideslizante
Superficie lisa para precisión
Borde cosido
Lavable`,
            precio: 19.99,
            cantidad: 1,
            imagenUrl: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=400",
          },
          {
            nombre: "Hub USB 3.0 de 7 puertos",
            descripcion: "Expansor USB con carga rápida",
            caracteristicas: `7 puertos USB 3.0
Transferencia hasta 5Gbps
3 puertos con carga rápida
LED indicador
Cable de 1 metro incluido`,
            precio: 29.99,
            cantidad: 1,
            imagenUrl: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400",
          },
        ],
      },
    },
  });

  console.log("✅ Base de datos poblada con éxito!");
  console.log(`📊 Creados ${3} clientes`);
  console.log(`📊 Creados ${3} presupuestos`);
  console.log(
    `📊 Total de productos: ${
      (await prisma.producto.count())
    }`
  );
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

