# 🔐 Sistema de Autenticación y Logo

## 📋 **¿Qué se ha implementado?**

### ✅ **1. Sistema de Autenticación**
- **Página de login** en `/login`
- **Protección de rutas** administrativas con middleware
- **Sesión con cookies** (dura 7 días)
- **Botón de logout** en el navbar

### ✅ **2. Logo de la Empresa**
- **Componente reutilizable** (`components/Logo.tsx`)
- **Logo en navbar** del panel administrativo
- **Logo en PDF** de presupuestos
- **Logo en emails** enviados a clientes
- **Logo en vista pública** de presupuestos

---

## 🚀 **Configuración Rápida**

### **1. Configurar Variables de Entorno**

Abre tu archivo `.env` y añade estas variables:

```env
# Credenciales de administrador (CÁMBIALAS!)
ADMIN_USERNAME="sibox"
ADMIN_PASSWORD="Usuario123*"

# Información de tu empresa
NEXT_PUBLIC_COMPANY_NAME="Mi Tienda de Informática"
NEXT_PUBLIC_COMPANY_LOGO="/logo.png"
```

> ⚠️ **IMPORTANTE**: Cambia el usuario y contraseña por defecto por seguridad.

### **2. Añadir el Logo de tu Empresa**

#### **Opción A: Logo Local** (Recomendado)

1. Guarda tu logo en la carpeta `public/` con el nombre `logo.png`
2. La variable de entorno ya está configurada: `NEXT_PUBLIC_COMPANY_LOGO="/logo.png"`

#### **Opción B: Logo desde URL**

Si tu logo está en internet, usa la URL completa:

```env
NEXT_PUBLIC_COMPANY_LOGO="https://tusitio.com/logo.png"
```

### **3. Reiniciar el Servidor**

Después de modificar el archivo `.env`, reinicia el servidor:

```bash
# Detener el servidor actual (Ctrl+C) y ejecutar:
npm run dev
```

---

## 🔑 **Cómo Usar el Sistema de Login**

### **Acceder al Panel**

1. Ve a `http://localhost:3000`
2. Si no has iniciado sesión, te redirigirá automáticamente a `/login`
3. **Credenciales por defecto:**
   - Usuario: `admin`
   - Contraseña: `admin123`

### **Cambiar las Credenciales**

Edita el archivo `.env`:

```env
ADMIN_USERNAME="tu-usuario"
ADMIN_PASSWORD="tu-contraseña-segura"
```

### **Cerrar Sesión**

Haz clic en el botón **"Cerrar Sesión"** en la esquina superior derecha del navbar.

---

## 🎨 **Personalización del Logo**

### **Tamaños del Logo**

El componente `Logo` acepta tres tamaños:

- **`sm`** (pequeño): 32px - Usado en el navbar
- **`md`** (mediano): 48px - Usado en vista pública
- **`lg`** (grande): 64px

### **Usar el Logo en Otras Partes**

Si quieres añadir el logo en otras páginas:

```tsx
import Logo from "@/components/Logo";

// Logo pequeño sin texto
<Logo size="sm" showText={false} />

// Logo mediano con texto
<Logo size="md" showText={true} />

// Logo grande con clase personalizada
<Logo size="lg" className="my-4" />
```

---

## 🔒 **Rutas Protegidas**

### **Rutas que Requieren Autenticación:**
- `/` (Dashboard principal)
- `/presupuestos/nuevo` (Crear presupuesto)
- `/presupuestos/[id]` (Ver presupuesto interno)

### **Rutas Públicas (No requieren login):**
- `/login` (Página de inicio de sesión)
- `/ver/[id]` (Vista pública de presupuestos para clientes)
- `/api/presupuestos/[id]/pdf` (Descarga de PDF)

---

## 📧 **Logo en Emails**

El logo se incluye automáticamente en los emails enviados a clientes.

**Requisitos:**
- El logo debe ser accesible públicamente (URL completa)
- Si usas un archivo local (`/logo.png`), asegúrate de que tu servidor esté accesible desde internet cuando despliegues en producción

**Para emails en producción:**

```env
NEXT_PUBLIC_APP_URL="https://tu-dominio.com"
NEXT_PUBLIC_COMPANY_LOGO="https://tu-dominio.com/logo.png"
```

---

## 📄 **Logo en PDF**

El logo también aparece en los PDFs generados. 

**Nota:** Para que el logo funcione en PDFs:
- Debe ser una URL pública completa
- O una ruta local que Next.js pueda resolver

---

## 🛡️ **Seguridad**

### **Mejores Prácticas:**

1. **Nunca compartas tu archivo `.env`**
   - Ya está en `.gitignore` por seguridad

2. **Usa contraseñas fuertes**
   - Mínimo 12 caracteres
   - Combina letras, números y símbolos

3. **Cambia las credenciales por defecto**
   - Las credenciales `admin/admin123` son solo para desarrollo

4. **En producción, considera:**
   - Usar autenticación más robusta (NextAuth.js, Auth0)
   - Implementar autenticación de dos factores
   - Usar una base de datos para usuarios

---

## 🔧 **Solución de Problemas**

### **El login no funciona**

1. Verifica que las variables estén correctamente en `.env`
2. Reinicia el servidor después de cambiar `.env`
3. Borra las cookies del navegador (`Ctrl+Shift+Delete`)

### **El logo no aparece**

1. **Si es local:** Verifica que el archivo exista en `public/logo.png`
2. **Si es URL:** Asegúrate de que la URL sea accesible
3. Verifica que la variable `NEXT_PUBLIC_COMPANY_LOGO` esté en `.env`
4. Reinicia el servidor

### **El logo no aparece en emails**

1. Usa una URL completa y pública
2. No uses rutas relativas (`/logo.png`) para emails
3. Asegúrate de que `NEXT_PUBLIC_APP_URL` esté configurado correctamente

---

## ✨ **Próximos Pasos**

¿Qué más te gustaría añadir?

- [ ] Múltiples usuarios con diferentes roles
- [ ] Recuperación de contraseña
- [ ] Personalización de colores de la empresa
- [ ] Pie de página con datos de contacto
- [ ] Más campos personalizables

**¡Disfruta de tu nuevo sistema de presupuestos!** 🎉



