import type { Repositorio } from "./interfaz";
import { RepositorioLocal } from "./local";

export * from "./interfaz";
export { EVENTO_CAMBIO } from "./local";

let instancia: Repositorio | null = null;

/** Punto único para cambiar de implementación (p. ej. `new RepositorioSupabase()`). */
export function repo(): Repositorio {
  if (!instancia) instancia = new RepositorioLocal();
  return instancia;
}
