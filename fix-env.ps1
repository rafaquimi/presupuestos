# Script para limpiar y actualizar el archivo .env

$newContent = @"
# Base de datos Supabase
DATABASE_URL="postgresql://postgres:Usuario123%2A@db.ecksepedyonfzrdmghat.supabase.co:5432/postgres"

# URL de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Configuración de email (Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yosoyelkimiko@gmail.com
SMTP_PASSWORD=mzcsilhvgtclizry
SMTP_FROM=Gestor de Presupuestos <yosoyelkimiko@gmail.com>

# Autenticación
ADMIN_USERNAME=sibox
ADMIN_PASSWORD=Usuario123*

# Personalización de marca
NEXT_PUBLIC_COMPANY_NAME="SIBOX Soluciones Informáticas"
"@

$newContent | Out-File -FilePath ".env" -Encoding UTF8 -NoNewline
Write-Host "✅ Archivo .env actualizado correctamente" -ForegroundColor Green


