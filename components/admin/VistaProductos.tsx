"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconoBasura, IconoMas } from "@/components/Iconos";
import { ImagenProducto } from "@/components/tienda/ImagenProducto";
import { slugify } from "@/lib/catalogo-semilla";
import { pesos } from "@/lib/formato";
import { useDatos } from "@/lib/hooks";
import { CATEGORIAS, categoriaPorId } from "@/lib/marca";
import { ErrorRepositorio, repo } from "@/lib/repositorio";
import type { CategoriaId, Etiqueta, Ilustracion, Patron, Producto } from "@/lib/tipos";

const ILUSTRACIONES: Ilustracion[] = ["body", "mameluco", "ajuar", "gorro", "jardinera", "vestido", "conjunto", "pijama", "camisa", "polo", "short", "deportivo", "zapato", "tenis", "sandalia", "balaca", "babero", "manta"];
const PATRONES: Patron[] = ["liso", "rayas", "cuadros", "estrellas", "puntos"];

function nuevoProducto(): Producto {
  return {
    id: `p${Date.now().toString(36)}`,
    slug: "",
    nombre: "",
    categoria: "bebe",
    precio: 0,
    tallas: [{ talla: "", existencias: 0 }],
    etiquetas: ["nuevo"],
    descripcion: "",
    detalles: [],
    color: { nombre: "Rosa", hex: "#EDB8BE" },
    acento: "#FFFDF9",
    patron: "liso",
    ilustracion: "body",
    imagenes: [],
    creado: new Date().toISOString(),
  };
}

/** Reduce la imagen subida a WebP de máximo 900 px para que quepa en el navegador. */
async function comprimir(archivo: File): Promise<string> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/webp", 0.78);
}

export function VistaProductos() {
  const productos = useDatos((r) => r.listarProductos());
  const params = useSearchParams();
  const router = useRouter();
  const ruta = usePathname();
  const [q, setQ] = useState("");
  const editar = params.get("editar");
  const enEdicion = editar === "nuevo" ? null : productos?.find((p) => p.id === editar);

  if (!productos) return <p>Cargando productos…</p>;
  const lista = productos.filter((p) => !q || slugify(`${p.nombre} ${p.categoria}`).includes(slugify(q)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">Productos</h1>
          <p className="mt-1 text-cacao-suave">{productos.length} productos en el catálogo.</p>
        </div>
        <button type="button" className="boton" onClick={() => router.replace(`${ruta}?editar=nuevo`, { scroll: false })}>
          <IconoMas /> Nuevo producto
        </button>
      </div>
      <div className="max-w-md">
        <label htmlFor="buscar-producto" className="etiqueta-campo">
          Buscar
        </label>
        <input id="buscar-producto" type="search" className="campo" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nombre o categoría" />
      </div>
      <div className="tarjeta overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <caption className="sr-only">Lista de productos</caption>
          <thead className="border-b border-linea bg-crema/60">
            <tr>
              <th scope="col" className="px-4 py-3">
                Producto
              </th>
              <th scope="col" className="px-4 py-3">
                Categoría
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Precio
              </th>
              <th scope="col" className="px-4 py-3">
                Existencias por talla
              </th>
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {lista.map((p) => {
              const total = p.tallas.reduce((s, t) => s + t.existencias, 0);
              return (
                <tr key={p.id} className="border-b border-linea/70">
                  <th scope="row" className="px-4 py-2 font-normal">
                    <div className="flex items-center gap-3">
                      <div className="w-10 shrink-0">
                        <ImagenProducto producto={p} sizes="40px" />
                      </div>
                      <div>
                        <Link href={`/producto/${p.slug}`} className="font-bold hover:underline" target="_blank">
                          {p.nombre}
                        </Link>
                        <div className="flex gap-1">
                          {p.etiquetas.map((e) => (
                            <span key={e} className="rounded-full bg-lila px-2 text-xs font-bold">
                              {e}
                            </span>
                          ))}
                          {total === 0 && <span className="rounded-full bg-cacao px-2 text-xs font-bold text-white">agotado</span>}
                        </div>
                      </div>
                    </div>
                  </th>
                  <td className="px-4 py-2">{categoriaPorId(p.categoria)?.nombre}</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {pesos(p.precio)}
                    {p.precioAnterior && <span className="block text-xs text-cacao-suave line-through">{pesos(p.precioAnterior)}</span>}
                  </td>
                  <td className="px-4 py-2">
                    <span className="flex flex-wrap gap-1">
                      {p.tallas.map((t) => (
                        <span key={t.talla} className={`rounded-md px-1.5 py-0.5 text-xs tabular-nums ${t.existencias === 0 ? "bg-[#FBEDEC] font-bold text-alerta" : t.existencias <= 1 ? "bg-durazno font-bold" : "bg-crema"}`}>
                          {t.talla}: {t.existencias}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button type="button" className="min-h-11 rounded-full px-4 font-bold text-rosa underline underline-offset-2" onClick={() => router.replace(`${ruta}?editar=${p.id}`, { scroll: false })}>
                      Editar<span className="sr-only"> {p.nombre}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {(editar === "nuevo" || enEdicion) && <EditorProducto key={editar} inicial={enEdicion ?? nuevoProducto()} esNuevo={editar === "nuevo"} alCerrar={() => router.replace(ruta, { scroll: false })} />}
    </div>
  );
}

function EditorProducto({ inicial, esNuevo, alCerrar }: { inicial: Producto; esNuevo: boolean; alCerrar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [p, setP] = useState<Producto>(inicial);
  const [error, setError] = useState("");
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);

  useEffect(() => {
    dialogo.current?.showModal();
  }, []);

  const fijar = <K extends keyof Producto>(k: K, v: Producto[K]) => setP((x) => ({ ...x, [k]: v }));

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    const tallas = p.tallas.filter((t) => t.talla.trim()).map((t) => ({ talla: t.talla.trim(), existencias: Math.max(0, Math.floor(t.existencias)) }));
    if (p.nombre.trim().length < 3) return setError("Escribe el nombre del producto.");
    if (!(p.precio > 0)) return setError("El precio debe ser mayor que cero.");
    if (p.precioAnterior && p.precioAnterior <= p.precio) return setError("El precio anterior debe ser mayor que el precio actual.");
    if (!tallas.length) return setError("Agrega al menos una talla.");
    try {
      await repo().guardarProducto({ ...p, nombre: p.nombre.trim(), slug: slugify(p.nombre), tallas, detalles: p.detalles.filter(Boolean) });
      dialogo.current?.close();
    } catch (err) {
      setError(err instanceof ErrorRepositorio ? err.message : "No se pudo guardar.");
    }
  }

  async function subir(e: React.ChangeEvent<HTMLInputElement>) {
    const archivos = Array.from(e.target.files ?? []).slice(0, 4 - p.imagenes.length);
    try {
      const nuevas = await Promise.all(archivos.map(comprimir));
      fijar("imagenes", [...p.imagenes, ...nuevas]);
    } catch {
      setError("No se pudo leer la imagen. Usa JPG, PNG o WebP.");
    }
    e.target.value = "";
  }

  return (
    <dialog ref={dialogo} onClose={alCerrar} aria-labelledby="titulo-producto" className="m-auto max-h-[94dvh] overflow-y-auto w-[min(96vw,900px)] rounded-3xl bg-papel p-0 text-cacao backdrop:bg-cacao/40">
      <form onSubmit={guardar} className="p-6 sm:p-8" noValidate>
        <div className="flex items-start justify-between gap-4">
          <h2 id="titulo-producto" className="text-3xl">
            {esNuevo ? "Nuevo producto" : "Editar producto"}
          </h2>
          <button type="button" className="boton-sec !min-h-11 !px-4" onClick={() => dialogo.current?.close()}>
            Cerrar
          </button>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-[200px_1fr]">
          <div>
            <ImagenProducto producto={p} sizes="200px" />
            <p className="mt-2 text-xs text-cacao-suave">Vista previa. Si no subes fotos, se muestra un dibujo de la prenda.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="pr-nombre" className="etiqueta-campo">
                Nombre
              </label>
              <input id="pr-nombre" className="campo" value={p.nombre} onChange={(e) => fijar("nombre", e.target.value)} maxLength={80} required />
            </div>
            <div>
              <label htmlFor="pr-cat" className="etiqueta-campo">
                Categoría
              </label>
              <select id="pr-cat" className="campo" value={p.categoria} onChange={(e) => fijar("categoria", e.target.value as CategoriaId)}>
                {CATEGORIAS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <fieldset>
              <legend className="etiqueta-campo">Etiquetas</legend>
              <div className="flex gap-4">
                {(["nuevo", "oferta"] as Etiqueta[]).map((et) => (
                  <label key={et} className="flex min-h-11 items-center gap-2">
                    <input type="checkbox" className="size-5 accent-rosa" checked={p.etiquetas.includes(et)} onChange={(e) => fijar("etiquetas", e.target.checked ? [...p.etiquetas, et] : p.etiquetas.filter((x) => x !== et))} />
                    {et === "nuevo" ? "Nuevo" : "Oferta"}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="pr-precio" className="etiqueta-campo">
                Precio (COP)
              </label>
              <input id="pr-precio" type="number" min={0} step={100} className="campo" value={p.precio || ""} onChange={(e) => fijar("precio", Number(e.target.value))} />
            </div>
            <div>
              <label htmlFor="pr-anterior" className="etiqueta-campo">
                Precio anterior <span className="font-normal text-cacao-suave">(opcional, para ofertas)</span>
              </label>
              <input id="pr-anterior" type="number" min={0} step={100} className="campo" value={p.precioAnterior ?? ""} onChange={(e) => fijar("precioAnterior", e.target.value ? Number(e.target.value) : undefined)} />
            </div>
          </div>
        </div>

        <fieldset className="mt-6">
          <legend className="etiqueta-campo">Tallas y existencias</legend>
          <ul className="space-y-2">
            {p.tallas.map((t, i) => (
              <li key={i} className="flex items-end gap-2">
                <div className="w-32">
                  <label htmlFor={`pr-talla-${i}`} className="sr-only">
                    Talla {i + 1}
                  </label>
                  <input id={`pr-talla-${i}`} className="campo" placeholder="Talla" value={t.talla} onChange={(e) => fijar("tallas", p.tallas.map((x, j) => (j === i ? { ...x, talla: e.target.value } : x)))} />
                </div>
                <div className="w-32">
                  <label htmlFor={`pr-stock-${i}`} className="sr-only">
                    Existencias de la talla {t.talla || i + 1}
                  </label>
                  <input id={`pr-stock-${i}`} type="number" min={0} className="campo" value={t.existencias} onChange={(e) => fijar("tallas", p.tallas.map((x, j) => (j === i ? { ...x, existencias: Number(e.target.value) } : x)))} />
                </div>
                <button type="button" className="grid size-12 place-items-center rounded-full hover:bg-crema" aria-label={`Quitar talla ${t.talla || i + 1}`} onClick={() => fijar("tallas", p.tallas.filter((_, j) => j !== i))}>
                  <IconoBasura tam={18} />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="enlace mt-2 min-h-11" onClick={() => fijar("tallas", [...p.tallas, { talla: "", existencias: 0 }])}>
            + Agregar talla
          </button>
        </fieldset>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="pr-desc" className="etiqueta-campo">
              Descripción
            </label>
            <textarea id="pr-desc" className="campo min-h-24" value={p.descripcion} onChange={(e) => fijar("descripcion", e.target.value)} maxLength={600} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="pr-det" className="etiqueta-campo">
              Detalles <span className="font-normal text-cacao-suave">(uno por línea)</span>
            </label>
            <textarea id="pr-det" className="campo min-h-20" value={p.detalles.join("\n")} onChange={(e) => fijar("detalles", e.target.value.split("\n"))} />
          </div>
          <div>
            <label htmlFor="pr-color" className="etiqueta-campo">
              Color (nombre)
            </label>
            <input id="pr-color" className="campo" value={p.color.nombre} onChange={(e) => fijar("color", { ...p.color, nombre: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <div>
              <label htmlFor="pr-hex" className="etiqueta-campo">
                Tono
              </label>
              <input id="pr-hex" type="color" className="h-12 w-16 rounded-xl border border-linea" value={p.color.hex} onChange={(e) => fijar("color", { ...p.color, hex: e.target.value })} />
            </div>
            <div className="flex-1">
              <label htmlFor="pr-il" className="etiqueta-campo">
                Dibujo
              </label>
              <select id="pr-il" className="campo" value={p.ilustracion} onChange={(e) => fijar("ilustracion", e.target.value as Ilustracion)}>
                {ILUSTRACIONES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="pr-pat" className="etiqueta-campo">
                Estampado
              </label>
              <select id="pr-pat" className="campo" value={p.patron} onChange={(e) => fijar("patron", e.target.value as Patron)}>
                {PATRONES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <fieldset className="mt-6">
          <legend className="etiqueta-campo">Imágenes (hasta 4)</legend>
          <div className="flex flex-wrap items-center gap-3">
            {p.imagenes.map((src, i) => (
              <div key={i} className="relative w-20">
                <ImagenProducto producto={p} indice={i} sizes="80px" />
                <button type="button" className="absolute -top-2 -right-2 grid size-9 place-items-center rounded-full bg-cacao text-white" aria-label={`Quitar imagen ${i + 1}`} onClick={() => fijar("imagenes", p.imagenes.filter((_, j) => j !== i))}>
                  ×
                </button>
              </div>
            ))}
            {p.imagenes.length < 4 && (
              <label className="boton-sec cursor-pointer">
                Subir fotos
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={subir} />
              </label>
            )}
          </div>
          <p className="mt-1 text-xs text-cacao-suave">Formatos JPG, PNG o WebP. Las fotos se ajustan solas al tamaño adecuado.</p>
        </fieldset>

        {error && (
          <p role="alert" className="error-campo mt-4">
            {error}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button type="submit" className="boton">
            Guardar producto
          </button>
          {!esNuevo &&
            (confirmarBorrado ? (
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-bold">¿Eliminar definitivamente?</span>
                <button
                  type="button"
                  className="boton !bg-alerta"
                  onClick={async () => {
                    await repo().eliminarProducto(p.id);
                    dialogo.current?.close();
                  }}
                >
                  Sí, eliminar
                </button>
                <button type="button" className="boton-sec" onClick={() => setConfirmarBorrado(false)}>
                  No
                </button>
              </span>
            ) : (
              <button type="button" className="boton-sec !border-alerta !text-alerta" onClick={() => setConfirmarBorrado(true)}>
                Eliminar
              </button>
            ))}
        </div>
      </form>
    </dialog>
  );
}
