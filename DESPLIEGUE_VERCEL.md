# 🚀 Guía de Despliegue en Vercel

## ✅ Ya Configurado

- ✅ Base de datos PostgreSQL en Supabase
- ✅ Tablas creadas (`Cliente`, `Presupuesto`, `Producto`)
- ✅ Conexión funcionando con Session Pooler

---

## 📋 Pasos para Desplegar

### 1️⃣ Preparar el Repositorio en GitHub

```powershell
# Inicializar Git (si no lo has hecho)
git init

# Añadir todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Sistema de presupuestos"

# Crear repositorio en GitHub (ve a https://github.com/new)
# Luego conecta tu repositorio local:
git remote add origin https://github.com/TU_USUARIO/presupuestos.git
git branch -M main
git push -u origin main
```

### 2️⃣ Desplegar en Vercel

1. Ve a https://vercel.com
2. Haz clic en **"Add New Project"**
3. Importa tu repositorio de GitHub
4. Configura las **Environment Variables** (variables de entorno):

```env
DATABASE_URL=postgresql://postgres.ecksepedyonfzrdmghat:Usuario123%2A@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yosoyelkimiko@gmail.com
SMTP_PASSWORD=mzcsilhvgtclizry
SMTP_FROM=Gestor de Presupuestos <yosoyelkimiko@gmail.com>
ADMIN_USERNAME=sibox
ADMIN_PASSWORD=Usuario123*
NEXT_PUBLIC_COMPANY_NAME=SIBOX Soluciones Informáticas
```

⚠️ **IMPORTANTE**: Actualiza `NEXT_PUBLIC_APP_URL` con la URL que te dé Vercel después del despliegue.

5. Haz clic en **"Deploy"**

### 3️⃣ Actualizar la URL de la Aplicación

Después del primer despliegue:

1. Copia la URL de tu app (ej: `https://presupuestos-sibox.vercel.app`)
2. En Vercel, ve a **Settings** → **Environment Variables**
3. Edita `NEXT_PUBLIC_APP_URL` y pon la URL real
4. Vuelve a desplegar: **Deployments** → **⋯** → **Redeploy**

---

## 🔧 Comandos Útiles

```powershell
# Ver el estado de Git
git status

# Hacer cambios y actualizar
git add .
git commit -m "Descripción del cambio"
git push

# Vercel hará el despliegue automático
```

---

## 🎯 Verificar el Despliegue

1. Abre tu app en `https://tu-app.vercel.app/login`
2. Inicia sesión con:
   - **Usuario**: `sibox`
   - **Contraseña**: `Usuario123*`
3. Crea un presupuesto de prueba
4. Envía un email de prueba
5. Genera un PDF

---

## 🐛 Solución de Problemas

### Error: "Database connection failed"
- Verifica que las variables de entorno estén correctas en Vercel
- Asegúrate de que `DATABASE_URL` tenga el `%2A` en lugar del `*`

### Error: "Email not sending"
- Verifica que `SMTP_PASSWORD` sea tu App Password de Gmail
- Confirma que `SMTP_USER` sea tu email correcto

### Los PDF no se generan
- Verifica que `NEXT_PUBLIC_APP_URL` apunte a tu dominio de Vercel
- Asegúrate de haber vuelto a desplegar después de actualizar la URL

---

## 📚 Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Supabase Dashboard](https://app.supabase.com)
- [GitHub](https://github.com)

---

## 🎉 ¡Listo!

Tu aplicación estará disponible públicamente en Vercel, usando Supabase como base de datos.

**URL de ejemplo**: `https://presupuestos-sibox.vercel.app`


