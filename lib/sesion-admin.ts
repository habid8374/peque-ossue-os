// Sesión del panel de administración: cookie httpOnly firmada con HMAC-SHA256.
// Demo: una sola contraseña por variable de entorno. Producción: usuarios reales
// con un proveedor de autenticación (Supabase Auth, Auth.js…).

export const COOKIE_ADMIN = "ps_admin";
const DURACION_MS = 8 * 60 * 60 * 1000;

export function claveAdmin() {
  return process.env.ADMIN_DEMO_PASSWORD || "suenos-demo-2026";
}

function secreto() {
  return process.env.ADMIN_SESSION_SECRET || `dev-only:${claveAdmin()}`;
}

async function firmar(datos: string) {
  const llave = await crypto.subtle.importKey("raw", new TextEncoder().encode(secreto()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const firma = await crypto.subtle.sign("HMAC", llave, new TextEncoder().encode(datos));
  return Buffer.from(firma).toString("base64url");
}

export async function crearToken() {
  const vence = Date.now() + DURACION_MS;
  const datos = `admin.${vence}`;
  return { token: `${datos}.${await firmar(datos)}`, vence };
}

function igualesTiempoConstante(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function tokenValido(token: string | undefined) {
  if (!token) return false;
  const partes = token.split(".");
  if (partes.length !== 3 || partes[0] !== "admin") return false;
  const vence = Number(partes[1]);
  if (!Number.isFinite(vence) || vence < Date.now()) return false;
  return igualesTiempoConstante(partes[2], await firmar(`${partes[0]}.${partes[1]}`));
}

export function claveCorrecta(intento: string) {
  return igualesTiempoConstante(intento, claveAdmin());
}
