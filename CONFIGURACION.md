# Guía de Configuración

## 📧 Configurar Gmail para Envío de Correos

Para poder enviar correos electrónicos desde la aplicación usando Gmail:

### Paso 1: Habilitar verificación en dos pasos

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. En el menú izquierdo, selecciona **Seguridad**
3. En "Cómo inicias sesión en Google", selecciona **Verificación en dos pasos**
4. Sigue los pasos para habilitarla

### Paso 2: Crear una contraseña de aplicación

1. Ve a https://myaccount.google.com/apppasswords
2. En "Selecciona la app", elige **Correo**
3. En "Selecciona el dispositivo", elige **Otro (nombre personalizado)**
4. Escribe "Gestor de Presupuestos" y haz clic en **Generar**
5. Google te mostrará una contraseña de 16 caracteres
6. **Copia esta contraseña** (la necesitarás para el archivo .env)

### Paso 3: Configurar el archivo .env

Añade estas líneas a tu archivo `.env`:

\`\`\`env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASSWORD="xxxx xxxx xxxx xxxx"  # La contraseña de aplicación generada
SMTP_FROM="Tu Tienda <tu-email@gmail.com>"
\`\`\`

## 🚀 Desplegar en Vercel

### Opción 1: Desplegar desde GitHub (Recomendado)

#### 1. Subir a GitHub

\`\`\`bash
# Inicializar git (si no lo has hecho)
git init

# Añadir todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - Gestor de Presupuestos"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git branch -M main
git push -u origin main
\`\`\`

#### 2. Importar en Vercel

1. Ve a https://vercel.com y crea una cuenta (puedes usar tu cuenta de GitHub)
2. Haz clic en **Add New** → **Project**
3. Selecciona tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Next.js
5. Haz clic en **Deploy**

#### 3. Configurar Variables de Entorno en Vercel

**IMPORTANTE**: Necesitas configurar una base de datos PostgreSQL para producción (SQLite no funciona en Vercel).

##### 3.1. Crear Base de Datos PostgreSQL

**Opción A: Railway (Gratis y fácil)**

1. Ve a https://railway.app y crea una cuenta
2. Crea un nuevo proyecto
3. Añade **PostgreSQL** desde la galería
4. Copia la **Connection String** (DATABASE_URL)

**Opción B: Supabase (Gratis con más características)**

1. Ve a https://supabase.com y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a **Settings** → **Database**
4. Copia la **Connection String** en modo "Transaction" o "Session"

**Opción C: Neon (Gratis y serverless)**

1. Ve a https://neon.tech y crea una cuenta
2. Crea un nuevo proyecto
3. Copia la **Connection String**

##### 3.2. Actualizar Prisma para PostgreSQL

En el archivo \`prisma/schema.prisma\`, cambia:

\`\`\`prisma
datasource db {
  provider = "postgresql"  // Cambiar de "sqlite" a "postgresql"
}
\`\`\`

##### 3.3. Configurar Variables en Vercel

1. En tu proyecto de Vercel, ve a **Settings** → **Environment Variables**
2. Añade las siguientes variables:

\`\`\`
DATABASE_URL = postgresql://usuario:password@host:5432/database?schema=public
NEXT_PUBLIC_APP_URL = https://tu-proyecto.vercel.app
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = tu-email@gmail.com
SMTP_PASSWORD = xxxx xxxx xxxx xxxx
SMTP_FROM = Tu Tienda <tu-email@gmail.com>
\`\`\`

3. Asegúrate de seleccionar **Production**, **Preview** y **Development** para cada variable

##### 3.4. Redesplegar

1. Ve a **Deployments**
2. Haz clic en los tres puntos del último despliegue
3. Selecciona **Redeploy**
4. O simplemente haz un nuevo push a tu repositorio

### Opción 2: Desplegar con Vercel CLI

\`\`\`bash
# Instalar Vercel CLI
npm install -g vercel

# Iniciar sesión
vercel login

# Desplegar
vercel

# Configurar variables de entorno
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_APP_URL
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add SMTP_USER
vercel env add SMTP_PASSWORD
vercel env add SMTP_FROM

# Desplegar a producción
vercel --prod
\`\`\`

## 🗄️ Migrar Datos a Producción

Si ya tienes presupuestos en tu base de datos local y quieres migrarlos a producción:

### 1. Exportar datos (opcional)

\`\`\`bash
# Crear un script para exportar
npx prisma db seed
\`\`\`

### 2. Aplicar migraciones en producción

\`\`\`bash
# Configurar DATABASE_URL de producción
$env:DATABASE_URL="tu-postgresql-url"

# Aplicar migraciones
npx prisma migrate deploy

# Generar cliente
npx prisma generate
\`\`\`

## 🔧 Solución de Problemas en Vercel

### Error: "Cannot find module '@prisma/client'"

**Solución**: Asegúrate de que el script \`postinstall\` esté en \`package.json\`:

\`\`\`json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
\`\`\`

### Error: "Database connection failed"

**Solución**: Verifica que:
- La variable \`DATABASE_URL\` esté correctamente configurada
- El proveedor en \`schema.prisma\` sea \`postgresql\`
- La base de datos esté accesible públicamente
- Las migraciones se hayan aplicado

### Error: "Module not found: Can't resolve 'canvas'"

**Solución**: Añade esto a \`next.config.js\`:

\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
\`\`\`

### Los emails no se envían en producción

**Solución**: 
- Verifica que todas las variables SMTP estén configuradas en Vercel
- Usa una App Password de Gmail (no tu contraseña normal)
- Comprueba los logs de Vercel para ver errores específicos

## 📊 Monitoreo y Logs

### Ver logs en Vercel

1. Ve a tu proyecto en Vercel
2. Selecciona **Functions** en el menú
3. Haz clic en cualquier función para ver sus logs
4. O ve a **Deployments** y selecciona un despliegue para ver logs generales

### Ver logs en tiempo real

\`\`\`bash
vercel logs
\`\`\`

## 🔐 Seguridad

### Variables de Entorno

- **NUNCA** subas el archivo \`.env\` a GitHub
- Usa variables de entorno en Vercel para valores sensibles
- Rota las contraseñas de aplicación periódicamente

### Base de Datos

- Usa conexiones SSL para PostgreSQL en producción
- Limita el acceso a la base de datos solo a IPs necesarias
- Haz backups regulares de tu base de datos

## 🎨 Personalización para Producción

### 1. Añadir tu logo

1. Coloca tu logo en \`public/logo.png\`
2. Actualiza los archivos relevantes para usar tu logo

### 2. Cambiar nombre de la tienda

Busca y reemplaza "Tu Tienda de Informática" en:
- \`app/layout.tsx\`
- \`app/api/presupuestos/enviar/route.ts\`
- \`lib/pdf-generator.tsx\`
- README.md

### 3. Personalizar colores

Los colores están definidos con Tailwind CSS. Busca y reemplaza:
- \`blue-600\` → tu color principal
- \`indigo-600\` → tu color secundario

### 4. Añadir Google Analytics (opcional)

1. Crea una propiedad en Google Analytics
2. Instala el paquete:
\`\`\`bash
npm install @next/third-parties
\`\`\`

3. Añade a \`app/layout.tsx\`:
\`\`\`typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
\`\`\`

## 📱 Probar en Producción

Después de desplegar:

1. ✅ Crea un presupuesto de prueba
2. ✅ Verifica que se pueda ver el enlace público
3. ✅ Descarga el PDF
4. ✅ Envía un email de prueba a ti mismo
5. ✅ Prueba en móvil y tablet

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs en Vercel
2. Verifica las variables de entorno
3. Asegúrate de que la base de datos esté accesible
4. Comprueba que todas las dependencias estén instaladas

---

¡Buena suerte con tu aplicación! 🚀


