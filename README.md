# Gestor de Presupuestos - Tienda de Informática

Una aplicación web moderna para crear y gestionar presupuestos de productos informáticos. Permite crear presupuestos con imágenes, compartirlos mediante enlace público y generar PDFs.

## 🚀 Características

- ✨ **Crear presupuestos** con múltiples productos
- 📸 **Agregar imágenes** pegándolas directamente (Ctrl+V) o mediante URL
- 📝 **Características detalladas** para cada producto
- 💰 **Cálculo automático** de totales y subtotales
- 🔗 **Enlaces compartibles** para que los clientes vean el presupuesto
- 📧 **Envío por email** con diseño profesional
- 📄 **Generación de PDF** con diseño atractivo
- 📱 **Diseño responsive** que funciona en móviles y tablets
- 🎨 **Interfaz moderna** con Tailwind CSS

## 🛠️ Tecnologías Utilizadas

- **Next.js 16** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos modernos
- **Prisma** - ORM para base de datos
- **SQLite** - Base de datos (fácil de cambiar a PostgreSQL para producción)
- **@react-pdf/renderer** - Generación de PDFs
- **Nodemailer** - Envío de correos
- **Lucide React** - Iconos

## 📦 Instalación

1. **Clonar el repositorio** (si aplica) o usar este directorio

2. **Instalar dependencias**:
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**:
Crea un archivo \`.env\` en la raíz del proyecto:

\`\`\`env
# Base de datos
DATABASE_URL="file:./dev.db"

# URL de la aplicación
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Configuración de correo (opcional - solo si quieres enviar emails)
# Para Gmail, debes crear una "App Password" en tu cuenta de Google
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASSWORD="tu-app-password"
SMTP_FROM="Tu Tienda <tu-email@gmail.com>"
\`\`\`

4. **Configurar la base de datos**:
\`\`\`bash
$env:DATABASE_URL="file:./dev.db"; npx prisma migrate dev --name init
npx prisma generate
\`\`\`

5. **Iniciar el servidor de desarrollo**:
\`\`\`bash
npm run dev
\`\`\`

6. **Abrir en el navegador**:
Visita [http://localhost:3000](http://localhost:3000)

## 📖 Cómo Usar

### Crear un Presupuesto

1. Haz clic en **"Crear Nuevo Presupuesto"** en la página principal
2. Completa los **datos del cliente** (nombre, email, teléfono, empresa)
3. Haz clic en **"Agregar Producto"** para añadir productos
4. Para cada producto:
   - Escribe el nombre y descripción
   - Añade características (una por línea)
   - Establece el precio y cantidad
   - Pega una imagen (Ctrl+V) o ingresa la URL de una imagen
5. Añade **notas adicionales** si es necesario
6. Haz clic en **"Crear Presupuesto"**

### Compartir un Presupuesto

1. Abre el presupuesto que deseas compartir
2. Usa el botón **"Copiar Enlace"** para copiar la URL pública
3. Envía el enlace al cliente por WhatsApp, email, etc.
4. O usa el botón **"Enviar por Email"** para enviarlo automáticamente

### Descargar PDF

1. Abre el presupuesto
2. Haz clic en **"Descargar PDF"**
3. El PDF se generará y descargará automáticamente

## 🚀 Despliegue en Vercel

1. **Subir a GitHub**:
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <tu-repositorio>
git push -u origin main
\`\`\`

2. **Conectar con Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Next.js

3. **Configurar variables de entorno** en Vercel:
   - Ve a Settings → Environment Variables
   - Añade todas las variables del archivo \`.env\`
   - Para producción, usa PostgreSQL en lugar de SQLite:
     - Crea una base de datos en [Supabase](https://supabase.com) o [Railway](https://railway.app)
     - Actualiza \`DATABASE_URL\` con la URL de PostgreSQL
     - En \`prisma/schema.prisma\`, cambia \`provider = "sqlite"\` a \`provider = "postgresql"\`

4. **Desplegar**:
   - Vercel desplegará automáticamente tu aplicación
   - Cada push a \`main\` creará un nuevo despliegue

## 📁 Estructura del Proyecto

\`\`\`
presupuestos/
├── app/
│   ├── api/
│   │   └── presupuestos/
│   │       ├── route.ts              # API para listar/crear presupuestos
│   │       ├── enviar/route.ts       # API para enviar emails
│   │       └── [id]/pdf/route.ts     # API para generar PDFs
│   ├── presupuestos/
│   │   ├── nuevo/page.tsx            # Página para crear presupuesto
│   │   └── [id]/
│   │       ├── page.tsx              # Página de detalle del presupuesto
│   │       └── AccionesPresupuesto.tsx
│   ├── ver/[id]/
│   │   ├── page.tsx                  # Vista pública del presupuesto
│   │   └── DescargarPDFButton.tsx
│   ├── layout.tsx
│   ├── page.tsx                      # Página principal
│   └── globals.css
├── lib/
│   ├── prisma.ts                     # Cliente de Prisma
│   └── pdf-generator.tsx             # Generador de PDFs
├── prisma/
│   └── schema.prisma                 # Esquema de base de datos
├── .env                              # Variables de entorno (no subir a git)
├── package.json
└── README.md
\`\`\`

## 🗄️ Modelos de Datos

### Cliente
- Nombre
- Email
- Teléfono (opcional)
- Empresa (opcional)

### Presupuesto
- Número único (auto-generado)
- Cliente (relación)
- Productos (relación)
- Total
- Estado (borrador, enviado, aceptado, rechazado)
- Notas adicionales
- Fechas de creación/actualización

### Producto
- Nombre
- Descripción
- Características
- Precio
- Cantidad
- Imagen URL

## 🎨 Personalización

### Cambiar Colores
Los colores principales están en las clases de Tailwind. Busca y reemplaza:
- \`blue-600\` por tu color principal
- \`indigo-600\` por tu color secundario

### Logo y Nombre
1. Actualiza el título en \`app/layout.tsx\`
2. Cambia "Tu Tienda de Informática" en los archivos relevantes
3. Añade tu logo en la carpeta \`public/\`

### Email Template
Modifica el HTML en \`app/api/presupuestos/enviar/route.ts\`

## 📝 Notas Importantes

- **SQLite** es solo para desarrollo. Para producción usa **PostgreSQL**
- Configura el **SMTP** para poder enviar correos reales
- Las imágenes se guardan como **URLs** o **base64** (para imágenes pegadas)
- Para producción, considera usar un servicio de almacenamiento como **Cloudinary** o **S3**

## 🐛 Solución de Problemas

### La base de datos no se crea
\`\`\`bash
$env:DATABASE_URL="file:./dev.db"
npx prisma migrate reset
npx prisma migrate dev --name init
npx prisma generate
\`\`\`

### Los emails no se envían
- Verifica que las variables SMTP_* estén configuradas
- Para Gmail, usa una "App Password" en lugar de tu contraseña normal
- La aplicación funcionará sin SMTP, solo que no enviará correos

### Error al generar PDF
- Asegúrate de que las imágenes sean URLs válidas
- Las imágenes en base64 pueden causar PDFs grandes

## 📄 Licencia

Este proyecto es de uso libre para tu tienda de informática.

## 🤝 Soporte

Si necesitas ayuda o tienes preguntas, no dudes en contactar.

---

¡Disfruta gestionando tus presupuestos! 🎉
