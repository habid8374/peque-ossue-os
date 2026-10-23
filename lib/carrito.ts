"use client";

import { crearAlmacen, useAlmacen } from "./hooks";

export interface LineaCarrito {
  productoId: string;
  talla: string;
  cantidad: number;
}

export const almacenCarrito = crearAlmacen<LineaCarrito[]>("ps:carrito", []);
export const almacenFavoritos = crearAlmacen<string[]>("ps:favoritos", []);

export function useCarrito() {
  const lineas = useAlmacen(almacenCarrito);
  return {
    lineas,
    unidades: lineas.reduce((s, l) => s + l.cantidad, 0),
    agregar(productoId: string, talla: string, cantidad = 1) {
      almacenCarrito.fijar((prev) => {
        const i = prev.findIndex((l) => l.productoId === productoId && l.talla === talla);
        if (i >= 0) return prev.map((l, j) => (j === i ? { ...l, cantidad: l.cantidad + cantidad } : l));
        return [...prev, { productoId, talla, cantidad }];
      });
    },
    cambiar(productoId: string, talla: string, cantidad: number) {
      almacenCarrito.fijar((prev) =>
        cantidad <= 0
          ? prev.filter((l) => !(l.productoId === productoId && l.talla === talla))
          : prev.map((l) => (l.productoId === productoId && l.talla === talla ? { ...l, cantidad } : l)),
      );
    },
    vaciar() {
      almacenCarrito.fijar(() => []);
    },
  };
}

export function useFavoritos() {
  const ids = useAlmacen(almacenFavoritos);
  return {
    ids,
    es: (id: string) => ids.includes(id),
    alternar(id: string) {
      almacenFavoritos.fijar((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    },
  };
}
