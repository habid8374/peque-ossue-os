"use client";

export type Errores = Record<string, string>;

/** Envía los datos a una ruta de validación (Zod en el servidor). */
export async function validarEnServidor<T>(ruta: string, cuerpo: unknown): Promise<{ ok: true; datos: T } | { ok: false; errores: Errores }> {
  try {
    const r = await fetch(ruta, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cuerpo) });
    const j = (await r.json()) as { ok: boolean; datos?: T; errores?: Errores };
    if (j.ok && j.datos) return { ok: true, datos: j.datos };
    return { ok: false, errores: j.errores ?? { _: "Revisa los datos." } };
  } catch {
    return { ok: false, errores: { _: "No hay conexión. Intenta de nuevo." } };
  }
}
