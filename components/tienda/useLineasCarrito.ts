"use client";

import { useCarrito } from "@/lib/carrito";
import { CONFIG_INICIAL } from "@/lib/config-inicial";
import { useDatos, useMontado } from "@/lib/hooks";
import { costoEnvio } from "@/lib/pedidos";

/** Une el carrito con el catálogo vivo y calcula totales. */
export function useLineasCarrito() {
  const montado = useMontado();
  const carrito = useCarrito();
  const productos = useDatos((r) => r.listarProductos());
  const config = useDatos((r) => r.configuracion()) ?? CONFIG_INICIAL;
  const listo = montado && productos !== undefined;
  const lineas = (montado ? carrito.lineas : [])
    .map((l) => {
      const p = productos?.find((x) => x.id === l.productoId);
      if (!p) return null;
      const stock = p.tallas.find((t) => t.talla === l.talla)?.existencias ?? 0;
      return { ...l, producto: p, stock };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
  const subtotal = lineas.reduce((s, l) => s + l.producto.precio * l.cantidad, 0);
  const envio = costoEnvio(subtotal, config);
  return { listo, carrito, lineas, subtotal, envio, total: subtotal + envio, config };
}
