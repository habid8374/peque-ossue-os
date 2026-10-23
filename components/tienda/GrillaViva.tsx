"use client";

import { useDatos } from "@/lib/hooks";
import type { Producto } from "@/lib/tipos";
import { TarjetaProducto } from "./TarjetaProducto";

type Modo = { tipo: "nuevos"; n: number } | { tipo: "ids"; ids: string[] };

function seleccionar(lista: Producto[], modo: Modo) {
  if (modo.tipo === "nuevos") return [...lista].sort((a, b) => b.creado.localeCompare(a.creado)).slice(0, modo.n);
  return modo.ids.map((id) => lista.find((p) => p.id === id)).filter((p): p is Producto => Boolean(p));
}

/** Grilla que pinta el catálogo semilla en el servidor y se actualiza con los datos vivos. */
export function GrillaViva({ iniciales, modo, columnas = "grid-cols-2 md:grid-cols-4" }: { iniciales: Producto[]; modo: Modo; columnas?: string }) {
  const vivos = useDatos((r) => r.listarProductos());
  const lista = seleccionar(vivos ?? iniciales, modo);
  return (
    <ul className={`grid gap-x-4 gap-y-10 ${columnas}`}>
      {lista.map((p) => (
        <li key={p.id}>
          <TarjetaProducto producto={p} />
        </li>
      ))}
    </ul>
  );
}
