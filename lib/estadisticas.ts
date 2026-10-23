import { CATEGORIAS, NOMBRE_ESTADO } from "./marca";
import type { ClientePublico } from "./repositorio";
import type { EstadoPedido, MetodoPago, Pedido, Producto } from "./tipos";

const DIA = 86400000;
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export interface Estadisticas {
  ventas30: number;
  ventas30Previo: number;
  pedidos30: number;
  pedidos30Previo: number;
  ticket30: number;
  ticket30Previo: number;
  clientesNuevos30: number;
  clientesNuevos30Previo: number;
  tasaRecompra: number;
  compradores: number;
  porMes: { clave: string; etiqueta: string; total: number; porMetodo: Record<MetodoPago, number> }[];
  porCategoria: { nombre: string; total: number }[];
  topProductos: { nombre: string; unidades: number; total: number }[];
  porEstado: { estado: EstadoPedido; nombre: string; cantidad: number }[];
  porCiudad: { nombre: string; cantidad: number }[];
  pendientes: Pedido[];
  bajoInventario: { producto: Producto; talla: string; existencias: number }[];
}

const vale = (p: Pedido) => p.estado !== "cancelado";

export function calcularEstadisticas(pedidos: Pedido[], clientes: ClientePublico[], productos: Producto[], ahora = new Date()): Estadisticas {
  const t = ahora.getTime();
  const en = (p: { creado: string }, desde: number, hasta: number) => {
    const x = new Date(p.creado).getTime();
    return x > t - desde * DIA && x <= t - hasta * DIA;
  };
  const validos = pedidos.filter(vale);
  const act = validos.filter((p) => en(p, 30, 0));
  const prev = validos.filter((p) => en(p, 60, 30));
  const suma = (l: Pedido[]) => l.reduce((s, p) => s + p.total, 0);

  // Ventas por mes (últimos 12 meses, incluido el actual)
  const porMes: Estadisticas["porMes"] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const clave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    porMes.push({ clave, etiqueta: `${MESES[d.getMonth()]}${d.getMonth() === 0 || i === 11 ? ` ${String(d.getFullYear()).slice(2)}` : ""}`, total: 0, porMetodo: { tarjeta: 0, pse: 0, contraentrega: 0 } });
  }
  for (const p of validos) {
    const d = new Date(p.creado);
    const clave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const m = porMes.find((x) => x.clave === clave);
    if (m) {
      m.total += p.total;
      m.porMetodo[p.metodoPago] += p.total;
    }
  }

  // Categorías y productos (últimos 12 meses)
  const desde12 = t - 365 * DIA;
  const recientes = validos.filter((p) => new Date(p.creado).getTime() > desde12);
  const cat = new Map<string, number>();
  const prod = new Map<string, { nombre: string; unidades: number; total: number }>();
  for (const p of recientes) {
    for (const it of p.items) {
      cat.set(it.categoria, (cat.get(it.categoria) ?? 0) + it.precio * it.cantidad);
      const e = prod.get(it.productoId) ?? { nombre: it.nombre, unidades: 0, total: 0 };
      e.unidades += it.cantidad;
      e.total += it.precio * it.cantidad;
      prod.set(it.productoId, e);
    }
  }
  const porCategoria = CATEGORIAS.map((c) => ({ nombre: c.nombre, total: cat.get(c.id) ?? 0 })).sort((a, b) => b.total - a.total);
  const topProductos = [...prod.values()].sort((a, b) => b.unidades - a.unidades || b.total - a.total).slice(0, 6);

  const estados: EstadoPedido[] = ["recibido", "pagado", "preparando", "enviado", "en_reparto", "entregado", "cancelado"];
  const porEstado = estados.map((e) => ({ estado: e, nombre: NOMBRE_ESTADO[e], cantidad: pedidos.filter((p) => p.estado === e).length }));

  const ciu = new Map<string, number>();
  for (const p of recientes) ciu.set(p.envio.ciudad, (ciu.get(p.envio.ciudad) ?? 0) + 1);
  const porCiudad = [...ciu.entries()].map(([nombre, cantidad]) => ({ nombre, cantidad })).sort((a, b) => b.cantidad - a.cantidad).slice(0, 7);

  // Recompra: compradores con 2 o más pedidos válidos
  const porCliente = new Map<string, number>();
  for (const p of validos) {
    const k = p.contacto.correo;
    porCliente.set(k, (porCliente.get(k) ?? 0) + 1);
  }
  const compradores = porCliente.size;
  const recompra = [...porCliente.values()].filter((n) => n >= 2).length;

  const pendientes = pedidos.filter((p) => ["recibido", "pagado", "preparando"].includes(p.estado)).sort((a, b) => a.creado.localeCompare(b.creado));
  const bajoInventario = productos
    .flatMap((p) => p.tallas.map((tl) => ({ producto: p, talla: tl.talla, existencias: tl.existencias })))
    .filter((x) => x.existencias <= 1)
    .sort((a, b) => a.existencias - b.existencias);

  return {
    ventas30: suma(act),
    ventas30Previo: suma(prev),
    pedidos30: act.length,
    pedidos30Previo: prev.length,
    ticket30: act.length ? suma(act) / act.length : 0,
    ticket30Previo: prev.length ? suma(prev) / prev.length : 0,
    clientesNuevos30: clientes.filter((c) => en(c, 30, 0)).length,
    clientesNuevos30Previo: clientes.filter((c) => en(c, 60, 30)).length,
    tasaRecompra: compradores ? recompra / compradores : 0,
    compradores,
    porMes,
    porCategoria,
    topProductos,
    porEstado,
    porCiudad,
    pendientes,
    bajoInventario,
  };
}
