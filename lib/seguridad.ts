/** Solo permite redirecciones a rutas internas del sitio. */
export function rutaInternaSegura(destino: string | null | undefined, porDefecto = "/") {
  if (!destino) return porDefecto;
  if (!destino.startsWith("/") || destino.startsWith("//") || destino.startsWith("/\\")) return porDefecto;
  if (/[\r\n\t]/.test(destino)) return porDefecto;
  try {
    const u = new URL(destino, "https://interno.local");
    if (u.origin !== "https://interno.local") return porDefecto;
    return u.pathname + u.search + u.hash;
  } catch {
    return porDefecto;
  }
}

/** Escapa un valor para CSV y neutraliza fórmulas (=, +, -, @, tab, retorno). */
export function celdaCsv(valor: unknown) {
  let s = valor === undefined || valor === null ? "" : String(valor);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function generarCsv(filas: unknown[][]) {
  return "﻿" + filas.map((f) => f.map(celdaCsv).join(",")).join("\r\n");
}
