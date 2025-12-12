# 🚀 Inicio Rápido

## ¡Tu aplicación está lista!

La aplicación de gestión de presupuestos ya está completamente configurada y lista para usar.

## ⚡ Iniciar la Aplicación

1. **Iniciar el servidor de desarrollo**:

\`\`\`bash
npm run dev
\`\`\`

2. **Abrir en el navegador**:

Visita: http://localhost:3000

## 📝 Crear Tu Primer Presupuesto

### Paso 1: Haz clic en "Crear Nuevo Presupuesto"

### Paso 2: Completa los datos del cliente
- **Nombre**: Juan Pérez
- **Email**: juan@ejemplo.com
- **Teléfono**: 612 345 678 (opcional)
- **Empresa**: Mi Empresa S.L. (opcional)

### Paso 3: Agregar productos

Haz clic en "Agregar Producto" y completa:

**Ejemplo de Producto 1:**
- **Nombre**: PC Gaming Avanzado
- **Descripción**: Ordenador de alto rendimiento para gaming
- **Características** (una por línea):
  ```
  Intel Core i7-13700K
  32GB RAM DDR5
  RTX 4070 Ti 12GB
  SSD 1TB NVMe
  Windows 11 Pro
  ```
- **Precio**: 1599.99
- **Cantidad**: 1
- **Imagen**: Pega una imagen con Ctrl+V o usa una URL como:
  `https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400`

**Ejemplo de Producto 2:**
- **Nombre**: Monitor 4K 27"
- **Descripción**: Monitor profesional para gaming y diseño
- **Características**:
  ```
  Panel IPS 4K
  144Hz
  HDR400
  USB-C
  ```
- **Precio**: 549.99
- **Cantidad**: 1
- **Imagen**: `https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400`

### Paso 4: Añadir notas (opcional)

Escribe información adicional como:
```
Presupuesto válido por 30 días.
Incluye instalación y configuración.
Garantía de 2 años en todos los componentes.
```

### Paso 5: Crear el presupuesto

Haz clic en "Crear Presupuesto" y serás redirigido a la página del presupuesto.

## 🔗 Compartir Presupuestos

Desde la página del presupuesto, puedes:

1. **Copiar Enlace**: Copia el enlace público para compartir por WhatsApp, email, etc.
2. **Enviar por Email**: Envía automáticamente el presupuesto (requiere configurar SMTP)
3. **Descargar PDF**: Genera y descarga un PDF profesional

## 📱 Vista Pública

El enlace público (ejemplo: `http://localhost:3000/ver/abc123`) permite que tus clientes:
- Vean todos los productos con imágenes
- Vean el total del presupuesto
- Descarguen el PDF directamente

## 🎨 Características de la Interfaz

### Pegar Imágenes
- En el campo de imagen de cualquier producto, simplemente **pega una imagen** (Ctrl+V)
- La imagen se convierte automáticamente y se guarda en la base de datos
- También puedes usar URLs de imágenes en línea

### Características del Producto
- Escribe una característica por línea
- Se mostrarán como viñetas en el presupuesto
- Usa descripciones cortas y claras

### Cálculo Automático
- El total se calcula automáticamente
- Multiplica precio × cantidad para cada producto
- Suma todos los subtotales

## 🗄️ Base de Datos

La aplicación usa SQLite, que guarda todos los datos en un archivo local: `dev.db`

**Ubicación**: `C:\Users\MOSTRADOR2\presupuestos\dev.db`

Para ver la base de datos:
\`\`\`bash
npx prisma studio
\`\`\`

Esto abre una interfaz web en http://localhost:5555 donde puedes ver y editar los datos directamente.

## 📧 Configurar Email (Opcional)

Para poder enviar presupuestos por email, necesitas configurar SMTP.

### Usando Gmail:

1. Habilita la verificación en dos pasos en tu cuenta de Google
2. Crea una contraseña de aplicación en https://myaccount.google.com/apppasswords
3. Edita el archivo `.env` y añade:

\`\`\`env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASSWORD="tu-contraseña-de-aplicacion"
SMTP_FROM="Tu Tienda <tu-email@gmail.com>"
\`\`\`

4. Reinicia el servidor (`npm run dev`)

Ver guía completa en `CONFIGURACION.md`

## 🚀 Desplegar en Producción

Cuando estés listo para desplegar en Vercel:

1. Sube el código a GitHub
2. Conecta tu repositorio en Vercel
3. Configura una base de datos PostgreSQL (Railway, Supabase, o Neon)
4. Añade las variables de entorno en Vercel
5. Despliega automáticamente

Ver guía completa en `CONFIGURACION.md`

## 📖 Documentación Adicional

- **README.md**: Documentación completa del proyecto
- **CONFIGURACION.md**: Guía detallada de configuración y despliegue

## ⚠️ Notas Importantes

1. **No subas el archivo `.env` a GitHub** (ya está en .gitignore)
2. **La base de datos SQLite es solo para desarrollo**. Para producción usa PostgreSQL
3. **Las imágenes pegadas se guardan en base64**, lo que puede hacer la base de datos grande
4. **Para producción**, considera usar un servicio de almacenamiento de imágenes como Cloudinary

## 🆘 ¿Problemas?

### El servidor no inicia
\`\`\`bash
# Reinstala las dependencias
npm install

# Regenera el cliente de Prisma
$env:DATABASE_URL="file:./dev.db"
npx prisma generate
\`\`\`

### No se pueden crear presupuestos
- Verifica que la base de datos exista: debería estar en `dev.db`
- Ejecuta las migraciones: `$env:DATABASE_URL="file:./dev.db"; npx prisma migrate dev`

### Las imágenes no se muestran
- Verifica que las URLs sean válidas y accesibles
- Para imágenes pegadas, asegúrate de que el navegador permita pegar imágenes

## ✨ Consejos

1. **Usa URLs cortas para imágenes**: Los servicios como Unsplash funcionan muy bien
2. **Mantén las características breves**: Una línea por característica
3. **Usa notas para información importante**: Garantías, condiciones, plazos, etc.
4. **Crea plantillas mentales**: Ten preparados tus productos más comunes

## 📞 Contacto

Si tienes preguntas o necesitas ayuda, consulta la documentación en README.md

---

¡Disfruta creando presupuestos profesionales para tu tienda! 🎉



