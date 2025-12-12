// Script para verificar que todas las variables de entorno estén configuradas
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_APP_URL',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'SMTP_FROM',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD',
  'NEXT_PUBLIC_COMPANY_NAME',
];

console.log('\n🔍 Verificando variables de entorno...\n');

let allPresent = true;
const missing = [];

requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName} - NO CONFIGURADA`);
    missing.push(varName);
    allPresent = false;
  } else {
    // No mostrar valores sensibles completos
    const displayValue = varName.includes('PASSWORD') || varName.includes('DATABASE_URL')
      ? '********'
      : value.length > 30
      ? value.substring(0, 30) + '...'
      : value;
    console.log(`✅ ${varName} - ${displayValue}`);
  }
});

console.log('\n' + '='.repeat(50));

if (allPresent) {
  console.log('\n✅ ¡Todas las variables de entorno están configuradas!\n');
  console.log('Puedes proceder con el despliegue a Vercel.\n');
  process.exit(0);
} else {
  console.log('\n❌ Faltan las siguientes variables de entorno:\n');
  missing.forEach((varName) => {
    console.log(`   - ${varName}`);
  });
  console.log('\nPor favor, configúralas en tu archivo .env\n');
  process.exit(1);
}



