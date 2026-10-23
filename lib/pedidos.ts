import { ESTADOS_CANCELABLES, ETAPAS } from "./marca";
import type { Configuracion, EstadoPedido, Pedido } from "./tipos";

export function costoEnvio(subtotal: number, config: Configuracion) {
  if (subtotal <= 0) return 0;
  return subtotal >= config.envioGratisDesde ? 0 : config.costoEnvio;
}

/** Días hábiles estimados según destino (Sabanalarga como origen). TODO(CLIENTE): confirmar tiempos reales. */
export function diasDeEntrega(departamento: string, ciudad: string) {
  if (ciudad === "Sabanalarga") return 1;
  if (departamento === "Atlántico") return 2;
  if (["Bolívar", "Magdalena", "Cesar", "Córdoba", "Sucre", "La Guajira"].includes(departamento)) return 3;
  return 5;
}

export function sumarDiasHabiles(desde: Date, dias: number) {
  const d = new Date(desde);
  let n = 0;
  while (n < dias) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0) n++; // la tienda despacha de lunes a sábado (demo)
  }
  return d;
}

export function indiceEtapa(estado: EstadoPedido) {
  return ETAPAS.findIndex((e) => e.estado === estado);
}

export function puedeCancelar(pedido: Pedido) {
  return ESTADOS_CANCELABLES.includes(pedido.estado);
}

export function unidades(pedido: Pedido) {
  return pedido.items.reduce((s, i) => s + i.cantidad, 0);
}
