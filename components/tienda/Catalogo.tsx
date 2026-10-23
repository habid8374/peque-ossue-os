"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useDatos } from "@/lib/hooks";
import { CATEGORIAS } from "@/lib/marca";
import type { CategoriaId, Producto } from "@/lib/tipos";
import { TarjetaProducto, existenciasTotales } from "./TarjetaProducto";

const PRECIOS = [
  { id: "0-40000", nombre: "Hasta $40.000", min: 0, max: 40000 },
  { id: "40000-80000", nombre: "$40.000 a $80.000", min: 40000, max: 80000 },
  { id: "80000-120000", nombre: "$80.000 a $120.000", min: 80000, max: 120000 },
  { id: "120000-", nombre: "Más de $120.000", min: 120000, max: Infinity },
];

const ORDENES = [
  { id: "recomendados", nombre: "Recomendados" },
  { id: "nuevos", nombre: "Lo más nuevo" },
  { id: "precio-asc", nombre: "Menor precio" },
  { id: "precio-desc", nombre: "Mayor precio" },
];

function normalizar(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function Catalogo({ iniciales, categoriaFija }: { iniciales: Producto[]; categoriaFija?: CategoriaId }) {
  const vivos = useDatos((r) => r.listarProductos());
  const productos = vivos ?? iniciales;
  const params = useSearchParams();
  const router = useRouter();
  const ruta = usePathname();

  const q = params.get("q") ?? "";
  const categoria = categoriaFija ?? (params.get("categoria") as CategoriaId | null) ?? "";
  const talla = params.get("talla") ?? "";
  const precio = params.get("precio") ?? "";
  const orden = params.get("orden") ?? "recomendados";
  const disponibles = params.get("disponibles") === "1";

  function fijar(clave: string, valor: string) {
    const p = new URLSearchParams(params.toString());
    if (valor) p.set(clave, valor);
    else p.delete(clave);
    const s = p.toString();
    router.replace(s ? `${ruta}?${s}` : ruta, { scroll: false });
  }

  const base = useMemo(() => (categoria ? productos.filter((p) => p.categoria === categoria) : productos), [productos, categoria]);
  const tallas = useMemo(() => {
    const set = new Set<string>();
    base.forEach((p) => p.tallas.forEach((t) => set.add(t.talla)));
    const orden = (t: string) => {
      const n = parseFloat(t);
      if (t.includes("M")) return n / 100;
      return Number.isNaN(n) ? 999 : n;
    };
    return [...set].sort((a, b) => orden(a) - orden(b));
  }, [base]);

  const lista = useMemo(() => {
    const rango = PRECIOS.find((r) => r.id === precio);
    const nq = normalizar(q.trim());
    let r = base.filter((p) => {
      if (nq && !normalizar(`${p.nombre} ${p.descripcion} ${p.color.nombre}`).includes(nq)) return false;
      if (talla && !p.tallas.some((t) => t.talla === talla && (!disponibles || t.existencias > 0))) return false;
      if (rango && (p.precio < rango.min || p.precio >= rango.max)) return false;
      if (disponibles && existenciasTotales(p) === 0) return false;
      return true;
    });
    r = [...r];
    if (orden === "nuevos") r.sort((a, b) => b.creado.localeCompare(a.creado));
    else if (orden === "precio-asc") r.sort((a, b) => a.precio - b.precio);
    else if (orden === "precio-desc") r.sort((a, b) => b.precio - a.precio);
    else r.sort((a, b) => Number(existenciasTotales(b) > 0) - Number(existenciasTotales(a) > 0));
    return r;
  }, [base, q, talla, precio, orden, disponibles]);

  const hayFiltros = Boolean(q || (!categoriaFija && categoria) || talla || precio || disponibles);

  const filtros = (
    <div className="space-y-7">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          fijar("q", String(new FormData(e.currentTarget).get("q") ?? "").trim());
        }}
      >
        <label htmlFor="q-catalogo" className="etiqueta-campo">
          Buscar
        </label>
        <div className="flex gap-2">
          <input key={q} id="q-catalogo" name="q" type="search" defaultValue={q} className="campo" placeholder="Ej.: vestido lila" />
          <button type="submit" className="boton-sec shrink-0 !px-4">
            Ir
          </button>
        </div>
      </form>

      {!categoriaFija && (
        <fieldset>
          <legend className="etiqueta-campo">Categoría</legend>
          <div className="flex flex-wrap gap-2">
            {[{ id: "", nombre: "Todas" }, ...CATEGORIAS].map((c) => (
              <button
                key={c.id || "todas"}
                type="button"
                aria-pressed={categoria === c.id}
                onClick={() => fijar("categoria", c.id)}
                className="min-h-11 rounded-full border border-linea bg-papel px-4 text-sm font-bold aria-pressed:border-cacao aria-pressed:bg-cacao aria-pressed:text-white"
              >
                {c.nombre}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className="etiqueta-campo">Talla</legend>
        <div className="flex flex-wrap gap-2">
          {tallas.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={talla === t}
              onClick={() => fijar("talla", talla === t ? "" : t)}
              className="min-h-11 min-w-11 rounded-full border border-linea bg-papel px-3 text-sm font-bold aria-pressed:border-cacao aria-pressed:bg-cacao aria-pressed:text-white"
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="etiqueta-campo">Precio</legend>
        <div className="space-y-1">
          {[{ id: "", nombre: "Cualquier precio" }, ...PRECIOS].map((r) => (
            <label key={r.id || "todos"} className="flex min-h-11 cursor-pointer items-center gap-3">
              <input type="radio" name="precio" checked={precio === r.id} onChange={() => fijar("precio", r.id)} className="size-5 accent-rosa" />
              {r.nombre}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex min-h-11 cursor-pointer items-center gap-3 font-bold">
        <input type="checkbox" checked={disponibles} onChange={(e) => fijar("disponibles", e.target.checked ? "1" : "")} className="size-5 accent-rosa" />
        Solo disponibles
      </label>

      {hayFiltros && (
        <button type="button" className="enlace min-h-11" onClick={() => router.replace(ruta, { scroll: false })}>
          Quitar filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
      <aside aria-label="Filtros" className="hidden lg:block">
        <div className="sticky top-32">{filtros}</div>
      </aside>
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="font-bold" role="status" aria-live="polite">
            {lista.length} {lista.length === 1 ? "producto" : "productos"}
            {q && (
              <span className="font-normal text-cacao-suave">
                {" "}
                para “{q}”
              </span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <details className="lg:hidden">
              <summary className="boton-sec cursor-pointer list-none !min-h-11 !py-2">Filtrar</summary>
              <div className="fixed inset-x-0 bottom-0 z-50 max-h-[80dvh] overflow-y-auto rounded-t-3xl border-t border-linea bg-crema p-5 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <p className="titulo text-2xl">Filtrar</p>
                  <button
                    type="button"
                    className="boton !min-h-11 !py-2"
                    onClick={(e) => (e.currentTarget.closest("details") as HTMLDetailsElement).removeAttribute("open")}
                  >
                    Ver {lista.length}
                  </button>
                </div>
                {filtros}
              </div>
            </details>
            <label htmlFor="orden" className="sr-only">
              Ordenar por
            </label>
            <select id="orden" value={orden} onChange={(e) => fijar("orden", e.target.value === "recomendados" ? "" : e.target.value)} className="campo !min-h-11 !w-auto !py-2">
              {ORDENES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        {lista.length ? (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
            {lista.map((p, i) => (
              <li key={p.id}>
                <TarjetaProducto producto={p} prioridad={i < 4} nivel={2} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="tarjeta p-10 text-center">
            <p className="titulo text-2xl">No encontramos prendas con esos filtros.</p>
            <p className="mt-2 text-cacao-suave">Prueba con otra talla o escríbenos: muchas veces tenemos más en la tienda física.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** Versión sin filtros para el HTML del servidor (evita el salto de diseño y deja los productos indexables). */
export function CatalogoRespaldo({ iniciales, categoriaFija }: { iniciales: Producto[]; categoriaFija?: CategoriaId }) {
  const lista = categoriaFija ? iniciales.filter((p) => p.categoria === categoriaFija) : iniciales;
  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
      <div className="hidden lg:block" />
      <div>
        <p className="mb-6 flex min-h-11 items-center font-bold">{lista.length} productos</p>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
          {lista.map((p, i) => (
            <li key={p.id}>
              <TarjetaProducto producto={p} prioridad={i < 4} nivel={2} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
