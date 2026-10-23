"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { IconoBolsa, IconoBuscar, IconoCerrar, IconoCorazon, IconoCuenta, IconoMenu, IconoCaja } from "@/components/Iconos";
import { useCarrito, useFavoritos } from "@/lib/carrito";
import { CONFIG_INICIAL } from "@/lib/demo/generar";
import { useDatos, useMontado } from "@/lib/hooks";
import { CATEGORIAS } from "@/lib/marca";

export const MENU = [
  { href: "/tienda?orden=nuevos", nombre: "Lo nuevo" },
  ...CATEGORIAS.map((c) => ({ href: `/coleccion/${c.id}`, nombre: c.corto })),
];

function Contador({ n, etiqueta }: { n: number; etiqueta: string }) {
  if (!n) return null;
  return (
    <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rosa px-1 text-[0.7rem] font-extrabold text-white" aria-label={etiqueta}>
      {n}
    </span>
  );
}

export function Cabecera() {
  const montado = useMontado();
  const { unidades } = useCarrito();
  const { ids } = useFavoritos();
  const config = useDatos((r) => r.configuracion());
  const ruta = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busquedaAbierta, setBusquedaAbierta] = useState(false);
  const dialogo = useRef<HTMLDialogElement>(null);
  const rutaPrevia = useRef(ruta);

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (menuAbierto && !d.open) d.showModal();
    if (!menuAbierto && d.open) d.close();
  }, [menuAbierto]);

  // Cierra el menú al navegar.
  useEffect(() => {
    if (rutaPrevia.current !== ruta) {
      rutaPrevia.current = ruta;
      dialogo.current?.close();
    }
  }, [ruta]);

  const anuncio = config?.anuncio ?? CONFIG_INICIAL.anuncio;
  const nCarrito = montado ? unidades : 0;
  const nFav = montado ? ids.length : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-linea bg-crema/95 backdrop-blur supports-[backdrop-filter]:bg-crema/85">
      <p className="bg-cacao px-4 py-2 text-center text-[0.8rem] font-semibold tracking-wide text-crema">{anuncio}</p>
      <div className="contenedor flex h-[72px] items-center gap-2 lg:h-20">
        <button
          type="button"
          className="-ml-2 grid size-11 place-items-center rounded-full hover:bg-papel lg:hidden"
          aria-label="Abrir menú"
          aria-haspopup="dialog"
          onClick={() => setMenuAbierto(true)}
        >
          <IconoMenu />
        </button>
        <div className="flex flex-1 justify-center lg:flex-none lg:justify-start">
          <Logo tam={52} />
        </div>
        <nav aria-label="Principal" className="ml-6 hidden flex-1 lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {MENU.map((m) => {
              const activo = ruta !== "/" && m.href.startsWith(ruta) && ruta.length > 1;
              return (
                <li key={m.href}>
                  <Link
                    href={m.href}
                    aria-current={activo ? "page" : undefined}
                    className="inline-flex min-h-11 items-center rounded-full px-3 text-[0.95rem] font-bold hover:bg-papel aria-[current=page]:bg-rosa-nube"
                  >
                    {m.nombre}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full hover:bg-papel"
            aria-label="Buscar"
            aria-expanded={busquedaAbierta}
            aria-controls="busqueda-cabecera"
            onClick={() => setBusquedaAbierta((v) => !v)}
          >
            <IconoBuscar />
          </button>
          <Link href="/cuenta" className="hidden size-11 place-items-center rounded-full hover:bg-papel sm:grid" aria-label="Mi cuenta">
            <IconoCuenta />
          </Link>
          <Link href="/favoritos" className="relative hidden size-11 place-items-center rounded-full hover:bg-papel sm:grid" aria-label="Favoritos">
            <IconoCorazon />
            <Contador n={nFav} etiqueta={`${nFav} favoritos`} />
          </Link>
          <Link href="/carrito" className="relative grid size-11 place-items-center rounded-full hover:bg-papel" aria-label={`Carrito, ${nCarrito} productos`}>
            <IconoBolsa />
            <Contador n={nCarrito} etiqueta={`${nCarrito} en el carrito`} />
          </Link>
        </div>
      </div>
      <div id="busqueda-cabecera" hidden={!busquedaAbierta} className="border-t border-linea bg-papel">
        <form action="/tienda" role="search" className="contenedor flex gap-2 py-3">
          <label htmlFor="q-cabecera" className="sr-only">
            Buscar productos
          </label>
          <input id="q-cabecera" name="q" type="search" className="campo" placeholder="Busca vestidos, bodies, baletas…" autoComplete="off" />
          <button className="boton shrink-0" type="submit">
            Buscar
          </button>
        </form>
      </div>

      <dialog
        ref={dialogo}
        aria-label="Menú"
        onClose={() => setMenuAbierto(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setMenuAbierto(false);
        }}
        className="m-0 h-dvh max-h-none w-[min(88vw,380px)] max-w-none bg-crema p-0 text-cacao backdrop:bg-cacao/40"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-linea px-4 py-3">
            <Logo tam={44} />
            <button type="button" className="grid size-11 place-items-center rounded-full hover:bg-papel" aria-label="Cerrar menú" onClick={() => setMenuAbierto(false)}>
              <IconoCerrar />
            </button>
          </div>
          <nav aria-label="Menú del celular" className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {MENU.map((m) => (
                <li key={m.href}>
                  <Link href={m.href} className="titulo flex min-h-12 items-center rounded-2xl px-3 text-2xl hover:bg-papel" onClick={() => setMenuAbierto(false)}>
                    {m.nombre}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6 space-y-1 border-t border-linea pt-4 font-bold">
              {[
                { href: "/cuenta", nombre: "Mi cuenta", icono: <IconoCuenta /> },
                { href: "/favoritos", nombre: "Favoritos", icono: <IconoCorazon /> },
                { href: "/seguimiento", nombre: "Seguir mi pedido", icono: <IconoCaja /> },
              ].map((m) => (
                <li key={m.href}>
                  <Link href={m.href} className="flex min-h-12 items-center gap-3 rounded-2xl px-3 hover:bg-papel" onClick={() => setMenuAbierto(false)}>
                    {m.icono}
                    {m.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </header>
  );
}
