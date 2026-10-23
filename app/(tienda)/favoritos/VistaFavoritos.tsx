"use client";

import Link from "next/link";
import { TarjetaProducto } from "@/components/tienda/TarjetaProducto";
import { useFavoritos } from "@/lib/carrito";
import { useDatos, useMontado } from "@/lib/hooks";

export function VistaFavoritos() {
  const montado = useMontado();
  const { ids } = useFavoritos();
  const productos = useDatos((r) => r.listarProductos());
  if (!montado || !productos) return <p>Cargando…</p>;
  const lista = ids.map((id) => productos.find((p) => p.id === id)).filter((p) => p !== undefined);
  if (!lista.length) {
    return (
      <div className="tarjeta p-10 text-center">
        <p className="titulo text-3xl">Aún no tienes favoritos</p>
        <p className="mt-2 text-cacao-suave">Toca el corazón de cualquier prenda para guardarla aquí.</p>
        <Link href="/tienda" className="boton mt-6">
          Explorar la tienda
        </Link>
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
      {lista.map((p) => (
        <li key={p.id}>
          <TarjetaProducto producto={p} nivel={2} />
        </li>
      ))}
    </ul>
  );
}
