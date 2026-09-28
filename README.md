# Gestor seguro de presupuestos

Aplicación Next.js para crear, editar, compartir y enviar presupuestos. La reconstrucción de 2026 incorpora PostgreSQL, Prisma, autenticación con contraseñas cifradas, sesiones firmadas, enlaces públicos revocables y validación en servidor.

## Funciones

- Panel con búsqueda, filtros y estados.
- Alta, edición y eliminación de presupuestos.
- Clientes actualizados automáticamente y consulta de historial.
- Cálculo seguro de subtotal, IVA y total en el servidor.
- Enlaces públicos aleatorios, revocables y con caducidad opcional.
- PDF privado y público.
- Envío por SMTP únicamente desde una sesión autorizada.
- Configuración de datos de empresa, IVA y validez.
- Bloqueo temporal después de cinco intentos de acceso fallidos.

## Puesta en marcha

Requisitos: Node.js 22 y una base PostgreSQL vacía.

```bash
npm ci
cp .env.example .env
npx prisma migrate deploy
npm run seed
npm run dev
```

Antes de ejecutar el `seed`, configura `ADMIN_EMAIL`, `ADMIN_NAME` y una `ADMIN_PASSWORD` de al menos 12 caracteres. Después del seed, `ADMIN_PASSWORD` puede retirarse del entorno: la base guarda únicamente el hash bcrypt.

Genera `AUTH_SECRET` con:

```bash
openssl rand -base64 48
```

## Despliegue en Vercel

1. Crea una base PostgreSQL en Supabase, Neon u otro proveedor.
2. Configura en Vercel las variables de `.env.example`.
3. Ejecuta una vez `npx prisma migrate deploy` y `npm run seed` apuntando a producción.
4. Importa este repositorio en Vercel.
5. Establece `APP_URL` con el dominio HTTPS definitivo.

No utilices `prisma db push` en producción. Las migraciones versionadas son la fuente de verdad.

## Imágenes

Las imágenes externas se aceptan solamente por HTTPS y desde los dominios incluidos en `ALLOWED_IMAGE_HOSTS`, separados por comas. No se guardan imágenes base64 dentro de PostgreSQL y el optimizador de imágenes del servidor está desactivado para evitar solicitudes a destinos arbitrarios.

Ejemplo:

```env
ALLOWED_IMAGE_HOSTS="res.cloudinary.com,mi-proyecto.supabase.co"
```

## Seguridad

- No existen credenciales predeterminadas.
- La cookie de sesión es `HttpOnly`, `Secure` en producción y `SameSite=Strict`.
- Las API privadas verifican sesión y origen.
- Los datos recibidos se validan con Zod y tienen límites de tamaño.
- Los totales, numeración y tokens públicos se generan en el servidor.
- Nodemailer tiene desactivado el acceso a archivos y URLs.
- Las cabeceras CSP, anti-frame, anti-MIME y permisos se aplican globalmente.

## Comprobaciones

```bash
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```

GitHub Actions ejecuta estas comprobaciones en cada `push` y `pull request`.
