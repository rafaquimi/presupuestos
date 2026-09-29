const required = [
  "DATABASE_URL",
  "DIRECT_URL",
  "AUTH_SECRET",
  "CRON_SECRET",
  "APP_URL",
];
const missing = required.filter((name) => !process.env[name]);

if (missing.length) {
  console.error(`Faltan variables: ${missing.join(", ")}`);
  process.exit(1);
}
if (process.env.AUTH_SECRET.length < 32) {
  console.error("AUTH_SECRET debe tener al menos 32 caracteres");
  process.exit(1);
}
if (process.env.CRON_SECRET.length < 32) {
  console.error("CRON_SECRET debe tener al menos 32 caracteres");
  process.exit(1);
}
console.log("Variables esenciales correctas");
