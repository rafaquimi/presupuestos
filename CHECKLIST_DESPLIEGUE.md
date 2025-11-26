# ✅ Checklist de Despliegue

## Antes de Desplegar

- [x] Base de datos Supabase configurada
- [x] Prisma sincronizado con la base de datos
- [x] Variables de entorno en `.env` configuradas
- [x] Aplicación funcionando en local
- [ ] Cuenta de GitHub creada
- [ ] Cuenta de Vercel creada (puede usar GitHub para login)

---

## Pasos de Despliegue

### 1. GitHub

- [ ] Crear repositorio en GitHub: https://github.com/new
- [ ] Ejecutar comandos:
  ```powershell
  git init
  git add .
  git commit -m "Initial commit: Sistema de presupuestos"
  git remote add origin https://github.com/TU_USUARIO/presupuestos.git
  git branch -M main
  git push -u origin main
  ```

### 2. Vercel

- [ ] Ir a https://vercel.com
- [ ] Hacer login con GitHub
- [ ] Clic en "Add New Project"
- [ ] Importar el repositorio de GitHub
- [ ] Configurar variables de entorno (copiar de `.env`)
- [ ] Clic en "Deploy"
- [ ] Esperar a que termine el despliegue (~2-5 minutos)

### 3. Post-Despliegue

- [ ] Copiar la URL de Vercel (ej: `https://presupuestos-xyz.vercel.app`)
- [ ] En Vercel → Settings → Environment Variables
- [ ] Actualizar `NEXT_PUBLIC_APP_URL` con la URL real
- [ ] Ir a Deployments → Clic en ⋯ → Redeploy

### 4. Verificación

- [ ] Abrir `https://tu-app.vercel.app/login`
- [ ] Iniciar sesión (usuario: `sibox`, contraseña: `Usuario123*`)
- [ ] Crear un presupuesto de prueba
- [ ] Enviar email de prueba
- [ ] Descargar PDF de prueba
- [ ] Ver presupuesto en vista pública (`/ver/[id]`)

---

## 🎉 ¡Completado!

Tu aplicación está desplegada y funcionando en:
- 🌐 **Web**: https://tu-app.vercel.app
- 📧 **Emails**: Enviando correctamente
- 📄 **PDFs**: Generándose correctamente
- 💾 **Base de datos**: Supabase PostgreSQL

---

## 📝 Notas

- Los cambios que hagas en local y subas a GitHub se desplegarán automáticamente en Vercel
- Para cambiar la contraseña de admin, edita `ADMIN_PASSWORD` en Vercel
- Para ver los logs de errores, ve a Vercel → Tu Proyecto → Deployments → Clic en el deployment → Logs
