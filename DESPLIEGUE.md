# 🚀 Guía de Despliegue a Vercel + Supabase

Esta guía te ayudará a desplegar tu aplicación de presupuestos en Vercel con una base de datos PostgreSQL en Supabase.

---

## 📦 **Paso 1: Preparar Supabase (Base de Datos)**

### 1.1 Crear cuenta en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Inicia sesión con GitHub (recomendado)

### 1.2 Crear un nuevo proyecto
1. Haz clic en "New Project"
2. Rellena los datos:
   - **Name**: `presupuestos` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (¡GUÁRDALA!)
   - **Region**: Elige la más cercana a ti (Europe West recomendado para España)
3. Haz clic en "Create new project"
4. Espera 2-3 minutos a que se cree el proyecto

### 1.3 Obtener la URL de conexión
1. En tu proyecto de Supabase, ve a **Settings** (⚙️ abajo a la izquierda)
2. Haz clic en **Database**
3. Desplázate hasta la sección **Connection string**
4. Selecciona **URI** y copia la URL que empieza con `postgresql://`
5. **IMPORTANTE**: Reemplaza `[YOUR-PASSWORD]` con la contraseña que creaste
6. La URL debe verse así:
   ```
   postgresql://postgres.xxxxx:TU_CONTRASEÑA@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```

---

## 🔧 **Paso 2: Actualizar tu proyecto local**

### 2.1 Instalar dependencia de PostgreSQL
Abre PowerShell en tu proyecto y ejecuta:
```powershell
npm install @prisma/adapter-neon
```

### 2.2 Crear archivo .env.production
Crea un nuevo archivo llamado `.env.production` con este contenido:

```env
# Base de datos Supabase
DATABASE_URL="postgresql://postgres.xxxxx:TU_CONTRASEÑA@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# URL de tu aplicación (lo configurarás después del despliegue)
NEXT_PUBLIC_APP_URL="https://tu-app.vercel.app"

# Configuración de email (Gmail App Password)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="yosoyelkimiko@gmail.com"
SMTP_PASSWORD="tu_app_password_de_gmail"
SMTP_FROM="yosoyelkimiko@gmail.com"

# Autenticación
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="tu_contraseña_segura"

# Empresa
NEXT_PUBLIC_COMPANY_NAME="SIBOX Soluciones Informáticas"
```

**⚠️ IMPORTANTE**: Reemplaza:
- `DATABASE_URL` con la URL que copiaste de Supabase
- `SMTP_PASSWORD` con tu Gmail App Password
- `ADMIN_PASSWORD` con una contraseña segura

### 2.3 Aplicar el schema a Supabase
Ejecuta estos comandos en PowerShell:

```powershell
# Detener el servidor local si está corriendo
taskkill /F /IM node.exe 2>$null

# Aplicar el schema a Supabase
npx prisma db push

# Generar el cliente de Prisma
npx prisma generate
```

Si todo va bien, verás un mensaje de confirmación.

---

## 🌐 **Paso 3: Desplegar en Vercel**

### 3.1 Preparar el repositorio Git
1. Ve a [https://github.com](https://github.com) e inicia sesión
2. Crea un nuevo repositorio:
   - Haz clic en el "+" arriba a la derecha → "New repository"
   - **Nombre**: `presupuestos-app`
   - **Visibilidad**: Privado
   - **NO** marques "Add a README file"
3. Copia los comandos que aparecen (parecidos a estos):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/presupuestos-app.git
git push -u origin main
```

4. Ejecuta esos comandos en PowerShell desde tu carpeta del proyecto

### 3.2 Crear cuenta en Vercel
1. Ve a [https://vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Inicia sesión con tu cuenta de GitHub

### 3.3 Importar tu proyecto
1. En Vercel, haz clic en "Add New..." → "Project"
2. Busca tu repositorio `presupuestos-app` y haz clic en "Import"
3. En la configuración:
   - **Framework Preset**: Next.js (detectado automáticamente)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (por defecto)
   - **Output Directory**: `.next` (por defecto)

### 3.4 Configurar Variables de Entorno
1. Antes de hacer clic en "Deploy", ve a la sección **Environment Variables**
2. Agrega cada variable **UNA POR UNA**:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | Tu URL de Supabase completa |
| `NEXT_PUBLIC_APP_URL` | `https://tu-proyecto.vercel.app` (lo obtendrás después) |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `yosoyelkimiko@gmail.com` |
| `SMTP_PASSWORD` | Tu Gmail App Password |
| `SMTP_FROM` | `yosoyelkimiko@gmail.com` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | Tu contraseña de admin |
| `NEXT_PUBLIC_COMPANY_NAME` | `SIBOX Soluciones Informáticas` |

3. Haz clic en "Deploy"

### 3.5 Esperar el despliegue
- Vercel tomará 2-3 minutos para construir y desplegar tu aplicación
- Verás un progreso en tiempo real
- Cuando termine, verás "🎉 Congratulations!"

### 3.6 Actualizar NEXT_PUBLIC_APP_URL
1. Copia la URL de tu proyecto (algo como `https://presupuestos-app-xxx.vercel.app`)
2. Ve a **Settings** → **Environment Variables**
3. Busca `NEXT_PUBLIC_APP_URL` y haz clic en el menú (⋯) → "Edit"
4. Reemplaza con tu URL real de Vercel
5. Haz clic en "Save"
6. Ve a **Deployments** → haz clic en el menú (⋯) de tu último deployment → "Redeploy"

---

## ✅ **Paso 4: Verificar que todo funciona**

### 4.1 Probar el login
1. Abre tu aplicación en Vercel
2. Deberías ver la página de login
3. Inicia sesión con el usuario y contraseña que configuraste

### 4.2 Crear un presupuesto de prueba
1. Crea un nuevo presupuesto con todos los datos
2. Envíalo por email
3. Descarga el PDF
4. Comprueba que el enlace público funciona

---

## 🔄 **Actualizaciones futuras**

Cada vez que hagas cambios en tu código:

```powershell
# Guardar cambios
git add .
git commit -m "Descripción de los cambios"
git push

# Vercel desplegará automáticamente
```

---

## 🐛 **Solución de problemas**

### Error: "Can't connect to database"
- Verifica que la URL de Supabase sea correcta
- Asegúrate de haber reemplazado `[YOUR-PASSWORD]` con tu contraseña real
- Comprueba que el proyecto de Supabase esté activo

### Error: "Environment variable not found"
- Ve a Vercel → Settings → Environment Variables
- Verifica que todas las variables estén configuradas
- Haz un "Redeploy" después de añadir variables

### Los emails no se envían
- Verifica que `SMTP_PASSWORD` sea un Gmail App Password válido
- Asegúrate de que Gmail tenga habilitada la verificación en dos pasos
- Comprueba que la cuenta `yosoyelkimiko@gmail.com` sea correcta

### El PDF no se genera
- Verifica que `NEXT_PUBLIC_APP_URL` apunte a tu dominio de Vercel
- Asegúrate de haber hecho "Redeploy" después de actualizar esta variable

---

## 📞 **Recursos útiles**

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Guía de despliegue de Next.js](https://nextjs.org/docs/deployment)

---

## 🎉 **¡Listo!**

Tu aplicación ya está en producción y accesible desde cualquier lugar. Puedes compartir la URL con tus clientes y empezar a crear presupuestos profesionales. 🚀



