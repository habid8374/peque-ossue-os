// Solo para la demo: el hash se calcula en el navegador. En producción la
// autenticación debe vivir en el servidor (Supabase Auth, Auth.js, etc.).
export async function hashClave(clave: string, sal: string) {
  const datos = new TextEncoder().encode(`${sal}:${clave}`);
  const digest = await crypto.subtle.digest("SHA-256", datos);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function nuevaSal() {
  const b = new Uint8Array(12);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}
