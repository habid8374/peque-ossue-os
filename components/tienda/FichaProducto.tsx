"use client";

import Link from "next/link";
import { useState } from "react";
import { IconoBolsa, IconoCamion, IconoCheck, IconoCorazon, IconoWhatsApp } from "@/components/Iconos";
import { useCarrito, useFavoritos } from "@/lib/carrito";
import { pesos } from "@/lib/formato";
import { useDatos, useMontado } from "@/lib/hooks";
import { categoriaPorId, enlaceWhatsApp } from "@/lib/marca";
import type { Producto } from "@/lib/tipos";
import { Migas } from "./Encabezado";
import { ImagenProducto } from "./ImagenProducto";
import { TarjetaProducto, existenciasTotales } from "./TarjetaProducto";

export function FichaProducto({ slug, inicial, relacionadosIniciales }: { slug: string; inicial?: Producto; relacionadosIniciales: Producto[] }) {
  const todos = useDatos((r) => r.listarProductos());
  const config = useDatos((r) => r.configuracion());
  const montado = useMontado();
  const vivo = todos?.find((p) => p.slug === slug);
  const producto = todos ? vivo : inicial;
  const carrito = useCarrito();
  const fav = useFavoritos();
  const [talla, setTalla] = useState<string>("");
  const [errorTalla, setErrorTalla] = useState(false);
  const [agregado, setAgregado] = useState(false);
  const [imagen, setImagen] = useState(0);

  if (!producto) {
    if (!todos) return <div className="contenedor py-20">Cargando…</div>;
    return (
      <div className="contenedor py-20 text-center">
        <h1 className="text-4xl">No encontramos esta prenda</h1>
        <p className="mt-3 text-cacao-suave">Puede que se haya agotado o cambiado de nombre.</p>
        <Link href="/tienda" className="boton mt-6">
          Ver la tienda
        </Link>
      </div>
    );
  }

  const cat = categoriaPorId(producto.categoria);
  const total = existenciasTotales(producto);
  const tallaSel = producto.tallas.find((t) => t.talla === talla);
  const relacionados = (todos ?? relacionadosIniciales)
    .filter((p) => p.id !== producto.id && (p.categoria === producto.categoria || p.categoria === "accesorios"))
    .slice(0, 4);
  const esFav = montado && fav.es(producto.id);
  const mensajeWa = `Hola, Pequeños Sueños. Quiero preguntar por "${producto.nombre}"${talla ? ` en talla ${talla}` : ""}. ¿Está disponible?`;

  function agregar() {
    if (!producto) return;
    if (!tallaSel) {
      setErrorTalla(true);
      document.getElementById("selector-talla")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    carrito.agregar(producto.id, tallaSel.talla, 1);
    setAgregado(true);
  }

  return (
    <div className="contenedor pt-4">
      <Migas items={[{ href: "/", nombre: "Inicio" }, { href: `/coleccion/${producto.categoria}`, nombre: cat?.nombre ?? "Tienda" }, { nombre: producto.nombre }]} />
      <div className="mt-4 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <ImagenProducto producto={producto} indice={imagen} prioridad sizes="(min-width: 1024px) 50vw, 100vw" className="mx-auto max-w-[560px]" />
          {producto.imagenes.length > 1 && (
            <div className="mt-4 flex justify-center gap-3">
              {producto.imagenes.map((_, i) => (
                <button key={i} type="button" onClick={() => setImagen(i)} aria-label={`Ver imagen ${i + 1}`} aria-pressed={imagen === i} className="w-16 rounded-xl ring-cacao aria-pressed:ring-2">
                  <ImagenProducto producto={producto} indice={i} sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:pt-6">
          <p className="sobretitulo">{cat?.nombre} · {cat?.edad}</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">{producto.nombre}</h1>
          <p className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold">{pesos(producto.precio)}</span>
            {producto.precioAnterior && (
              <span className="text-lg text-cacao-suave line-through">
                <span className="sr-only">Antes </span>
                {pesos(producto.precioAnterior)}
              </span>
            )}
          </p>
          <p className="mt-5 text-lg leading-relaxed">{producto.descripcion}</p>

          <fieldset id="selector-talla" className="mt-8" aria-describedby={errorTalla ? "error-talla" : undefined}>
            <legend className="etiqueta-campo flex w-full justify-between">
              <span>Talla{tallaSel ? `: ${tallaSel.talla}` : ""}</span>
              <span className="font-normal text-cacao-suave">Color: {producto.color.nombre}</span>
            </legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {producto.tallas.map((t) => {
                const sin = t.existencias === 0;
                return (
                  <button
                    key={t.talla}
                    type="button"
                    disabled={sin}
                    aria-pressed={talla === t.talla}
                    aria-label={`Talla ${t.talla}${sin ? ", agotada" : ""}`}
                    onClick={() => {
                      setTalla(t.talla);
                      setErrorTalla(false);
                      setAgregado(false);
                    }}
                    className="relative min-h-12 min-w-14 rounded-2xl border-[1.5px] border-[#d8c9c0] bg-papel px-4 font-bold hover:border-cacao disabled:cursor-not-allowed disabled:text-cacao-suave/70 disabled:line-through aria-pressed:border-cacao aria-pressed:bg-cacao aria-pressed:text-white"
                  >
                    {t.talla}
                  </button>
                );
              })}
            </div>
            {errorTalla && (
              <p id="error-talla" role="alert" className="error-campo">
                Elige una talla para agregar al carrito.
              </p>
            )}
            <p className="mt-3 text-sm font-bold" aria-live="polite">
              {total === 0 ? (
                <span className="text-alerta">Agotado por ahora. Pregúntanos por WhatsApp cuándo vuelve.</span>
              ) : tallaSel ? (
                tallaSel.existencias <= 2 ? (
                  <span className="text-durazno-hondo">Solo {tallaSel.existencias === 1 ? "queda 1 unidad" : `quedan ${tallaSel.existencias} unidades`} en talla {tallaSel.talla}.</span>
                ) : (
                  <span className="text-salvia-honda">Disponible en talla {tallaSel.talla} ({tallaSel.existencias} unidades).</span>
                )
              ) : (
                <span className="text-cacao-suave">{total} unidades disponibles entre todas las tallas.</span>
              )}
            </p>
          </fieldset>

          <div className="mt-6 hidden gap-3 lg:flex">
            <button type="button" className="boton flex-1" onClick={agregar} disabled={total === 0}>
              <IconoBolsa /> {total === 0 ? "Agotado" : "Agregar al carrito"}
            </button>
            <button
              type="button"
              onClick={() => fav.alternar(producto.id)}
              aria-pressed={esFav}
              aria-label={esFav ? "Quitar de favoritos" : "Guardar en favoritos"}
              className="grid size-12 place-items-center rounded-full border-[1.5px] border-cacao text-rosa"
            >
              <IconoCorazon lleno={esFav} />
            </button>
          </div>
          {agregado && (
            <div role="status" className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-salvia px-4 py-3 font-bold">
              <IconoCheck /> Agregado al carrito.
              <Link href="/carrito" className="enlace">
                Ver carrito
              </Link>
            </div>
          )}
          <a href={enlaceWhatsApp(mensajeWa)} target="_blank" rel="noopener noreferrer" className="boton-sec mt-3 w-full">
            <IconoWhatsApp tam={22} /> Preguntar por WhatsApp
          </a>

          <ul className="mt-8 space-y-3 border-t border-linea pt-6">
            <li className="flex gap-3">
              <IconoCamion className="mt-0.5 shrink-0 text-salvia-honda" />
              <span>
                Envío gratis desde <strong>{pesos(config?.envioGratisDesde ?? 200000)}</strong>. Entregas en Sabanalarga en 1 día hábil.
              </span>
            </li>
            {producto.detalles.map((d) => (
              <li key={d} className="flex gap-3">
                <IconoCheck className="mt-0.5 shrink-0 text-salvia-honda" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section aria-labelledby="titulo-relacionados" className="mt-24">
          <h2 id="titulo-relacionados" className="text-3xl sm:text-4xl">
            Combínalo con
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {relacionados.map((p) => (
              <li key={p.id}>
                <TarjetaProducto producto={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Barra de compra fija en celular */}
      <div className="barra-fija fixed inset-x-0 bottom-0 z-30 border-t border-linea bg-papel px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{producto.nombre}</p>
            <p className="text-sm">
              {pesos(producto.precio)}
              {tallaSel ? ` · Talla ${tallaSel.talla}` : ""}
            </p>
          </div>
          <button type="button" className="boton shrink-0 !px-5" onClick={agregar} disabled={total === 0}>
            {total === 0 ? "Agotado" : tallaSel ? "Agregar" : "Elegir talla"}
          </button>
        </div>
      </div>
    </div>
  );
}
