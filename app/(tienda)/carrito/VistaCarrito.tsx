"use client";

import Link from "next/link";
import { IconoBasura, IconoMas, IconoMenos } from "@/components/Iconos";
import { ImagenProducto } from "@/components/tienda/ImagenProducto";
import { ResumenCompra } from "@/components/tienda/ResumenCompra";
import { useLineasCarrito } from "@/components/tienda/useLineasCarrito";
import { pesos } from "@/lib/formato";

export function VistaCarrito() {
  const { listo, carrito, lineas, subtotal, envio, config } = useLineasCarrito();
  if (!listo) return <p className="py-10">Cargando tu carrito…</p>;
  if (!lineas.length) {
    return (
      <div className="tarjeta p-10 text-center">
        <p className="titulo text-3xl">Tu carrito está vacío</p>
        <p className="mt-2 text-cacao-suave">Mira lo que acaba de llegar a la tienda.</p>
        <Link href="/tienda" className="boton mt-6">
          Ir a la tienda
        </Link>
      </div>
    );
  }
  const sinStock = lineas.some((l) => l.cantidad > l.stock);
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <ul className="divide-y divide-linea border-y border-linea">
        {lineas.map((l) => (
          <li key={`${l.productoId}-${l.talla}`} className="flex gap-4 py-5">
            <Link href={`/producto/${l.producto.slug}`} className="w-24 shrink-0 sm:w-28" tabIndex={-1} aria-hidden="true">
              <ImagenProducto producto={l.producto} sizes="112px" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex justify-between gap-3">
                <h2 className="font-sans text-base leading-snug font-bold tracking-normal">
                  <Link href={`/producto/${l.producto.slug}`} className="hover:underline">
                    {l.producto.nombre}
                  </Link>
                </h2>
                <p className="shrink-0 font-extrabold">{pesos(l.producto.precio * l.cantidad)}</p>
              </div>
              <p className="text-sm text-cacao-suave">
                Talla {l.talla} · {pesos(l.producto.precio)} c/u
              </p>
              {l.cantidad > l.stock && (
                <p role="alert" className="error-campo">
                  {l.stock === 0 ? "Esta talla se agotó. Quítala para continuar." : `Solo quedan ${l.stock} unidades.`}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center rounded-full border border-linea bg-papel" role="group" aria-label={`Cantidad de ${l.producto.nombre}`}>
                  <button type="button" className="grid size-11 place-items-center rounded-full" aria-label="Quitar una unidad" onClick={() => carrito.cambiar(l.productoId, l.talla, l.cantidad - 1)}>
                    <IconoMenos tam={18} />
                  </button>
                  <span className="min-w-8 text-center font-bold" aria-live="polite">
                    {l.cantidad}
                  </span>
                  <button type="button" className="grid size-11 place-items-center rounded-full disabled:opacity-40" aria-label="Agregar una unidad" disabled={l.cantidad >= l.stock} onClick={() => carrito.cambiar(l.productoId, l.talla, l.cantidad + 1)}>
                    <IconoMas tam={18} />
                  </button>
                </div>
                <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-bold text-cacao-suave hover:text-alerta" onClick={() => carrito.cambiar(l.productoId, l.talla, 0)}>
                  <IconoBasura tam={18} /> Quitar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside aria-label="Resumen del pedido" className="tarjeta h-fit p-6 lg:sticky lg:top-32">
        <h2 className="text-2xl">Resumen</h2>
        <div className="mt-5">
          <ResumenCompra subtotal={subtotal} envio={envio} envioGratisDesde={config.envioGratisDesde} />
        </div>
        {sinStock ? (
          <p className="error-campo mt-5">Ajusta las cantidades marcadas para continuar.</p>
        ) : (
          <Link href="/checkout" className="boton mt-6 w-full">
            Continuar con la compra
          </Link>
        )}
        <Link href="/tienda" className="enlace mt-3 flex min-h-11 items-center justify-center">
          Seguir comprando
        </Link>
      </aside>
    </div>
  );
}
