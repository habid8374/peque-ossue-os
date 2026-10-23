const cop = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export function pesos(valor: number) {
  return cop.format(Math.round(valor)).replace(/ /g, " ");
}

export function pesosCompactos(valor: number) {
  if (Math.abs(valor) >= 1_000_000) return `$${(valor / 1_000_000).toLocaleString("es-CO", { maximumFractionDigits: 1 })} M`;
  if (Math.abs(valor) >= 1_000) return `$${Math.round(valor / 1_000).toLocaleString("es-CO")} mil`;
  return `$${Math.round(valor)}`;
}

const zona = "America/Bogota";

export function fecha(iso: string, opciones: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  return new Date(iso).toLocaleDateString("es-CO", { timeZone: zona, ...opciones });
}

export function fechaCorta(iso: string) {
  return fecha(iso, { day: "numeric", month: "short" });
}

export function fechaHora(iso: string) {
  return new Date(iso).toLocaleString("es-CO", {
    timeZone: zona,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function diaSemana(iso: string) {
  return fecha(iso, { weekday: "long", day: "numeric", month: "long" });
}
