"use client";

import Link from "next/link";
import { IconoCorazon } from "@/components/Iconos";
import { useFavoritos } from "@/lib/carrito";
import { pesos } from "@/lib/formato";
import { useMontado } from "@/lib/hooks";
import type { Producto } from "@/lib/tipos";
import { ImagenProducto } from "./ImagenProducto";

export function existenciasTotales(p: Producto) {
  return p.tallas.reduce((s, t) => s + t.existencias, 0);
}

export function TarjetaProducto({ producto, prioridad = false, nivel = 3 }: { producto: Producto; prioridad?: boolean; nivel?: 2 | 3 }) {
  const montado = useMontado();
  const fav = useFavoritos();
  const esFav = montado && fav.es(producto.id);
  const total = existenciasTotales(producto);
  const agotado = total === 0;
  const pocas = !agotado && total <= 4;
  const Titulo = nivel === 2 ? "h2" : "h3";

  return (
    <article className="group relative">
      <div className="relative">
        <Link href={`/producto/${producto.slug}`} className="block rounded-[999px_999px_1.25rem_1.25rem]" tabIndex={-1} aria-hidden="true">
          <ImagenProducto producto={producto} prioridad={prioridad} className="transition-transform duration-500 group-hover:-translate-y-1" />
        </Link>
        <div className="pointer-events-none absolute top-[38%] left-3 flex flex-col items-start gap-1.5">
          {agotado && <span className="rounded-full bg-cacao px-3 py-1 text-xs font-extrabold text-white">Agotado</span>}
          {!agotado && producto.etiquetas.includes("oferta") && <span className="rounded-full bg-rosa px-3 py-1 text-xs font-extrabold text-white">Oferta</span>}
          {!agotado && producto.etiquetas.includes("nuevo") && <span className="rounded-full bg-papel px-3 py-1 text-xs font-extrabold text-lila-hondo">Nuevo</span>}
        </div>
        <button
          type="button"
          onClick={() => fav.alternar(producto.id)}
          aria-pressed={esFav}
          aria-label={esFav ? `Quitar ${producto.nombre} de favoritos` : `Guardar ${producto.nombre} en favoritos`}
          className="absolute right-2 bottom-2 grid size-11 place-items-center rounded-full bg-papel/95 text-rosa shadow-sm hover:bg-papel"
        >
          <IconoCorazon lleno={esFav} />
        </button>
      </div>
      <div className="mt-3 px-1">
        <Titulo className="font-sans text-[1rem] leading-snug font-bold tracking-normal">
          <Link href={`/producto/${producto.slug}`} className="hover:underline">
            {producto.nombre}
          </Link>
        </Titulo>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="font-extrabold">{pesos(producto.precio)}</span>
          {producto.precioAnterior && (
            <span className="text-sm text-cacao-suave line-through">
              <span className="sr-only">Antes </span>
              {pesos(producto.precioAnterior)}
            </span>
          )}
        </p>
        {pocas && <p className="mt-0.5 text-sm font-bold text-durazno-hondo">¡Quedan pocas unidades!</p>}
      </div>
    </article>
  );
}
