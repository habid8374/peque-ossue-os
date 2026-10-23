"use client";

import { useMemo, useRef, useState } from "react";
import { IconoDescargar } from "@/components/Iconos";
import { InsigniaEstado } from "@/components/tienda/SeguimientoPedido";
import { fecha, fechaCorta, pesos } from "@/lib/formato";
import { useDatos } from "@/lib/hooks";
import type { ClientePublico } from "@/lib/repositorio";
import { generarCsv } from "@/lib/seguridad";
import type { Pedido } from "@/lib/tipos";

function normalizar(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function VistaClientes() {
  const datos = useDatos(async (r) => ({ clientes: await r.listarClientes(), pedidos: await r.listarPedidos() }));
  const [q, setQ] = useState("");
  const [soloAutorizados, setSoloAutorizados] = useState(false);
  const [sel, setSel] = useState<ClientePublico | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);

  const filas = useMemo(() => {
    if (!datos) return [];
    const porCorreo = new Map<string, Pedido[]>();
    for (const p of datos.pedidos) porCorreo.set(p.contacto.correo, [...(porCorreo.get(p.contacto.correo) ?? []), p]);
    return datos.clientes
      .map((c) => {
        const ps = porCorreo.get(c.correo) ?? [];
        const validos = ps.filter((p) => p.estado !== "cancelado");
        return { c, pedidos: ps, total: validos.reduce((s, p) => s + p.total, 0), ultimo: ps[0]?.creado };
      })
      .sort((a, b) => b.total - a.total);
  }, [datos]);

  if (!datos) return <p>Cargando clientes…</p>;
  const nq = normalizar(q.trim());
  const visibles = filas.filter((f) => (!soloAutorizados || f.c.autorizaCorreos) && (!nq || normalizar(`${f.c.nombre} ${f.c.apellidos} ${f.c.correo} ${f.c.ciudad} ${f.c.celular}`).includes(nq)));
  const autorizados = filas.filter((f) => f.c.autorizaCorreos);

  function descargarCsv() {
    const csv = generarCsv([
      ["Nombre", "Apellidos", "Correo", "Celular", "Ciudad", "Departamento", "Autorizó correos el", "Pedidos", "Total comprado"],
      ...autorizados.map((f) => [f.c.nombre, f.c.apellidos, f.c.correo, f.c.celular, f.c.ciudad, f.c.departamento, f.c.fechaAutorizaCorreos?.slice(0, 10) ?? "", f.pedidos.length, Math.round(f.total)]),
    ]);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `clientes-autorizan-correo-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">Clientes</h1>
          <p className="mt-1 text-cacao-suave">
            {filas.length} clientes · {autorizados.length} autorizaron correos de campañas.
          </p>
        </div>
        <button type="button" className="boton" onClick={descargarCsv}>
          <IconoDescargar /> Descargar CSV ({autorizados.length})
        </button>
      </div>
      <p className="text-sm text-cacao-suave">El CSV incluye solo a quienes autorizaron recibir correos, con la fecha de autorización. Las celdas se protegen contra fórmulas al abrirlas en Excel.</p>
      <div className="flex flex-wrap items-end gap-4" role="search" aria-label="Filtrar clientes">
        <div className="min-w-60 flex-1">
          <label htmlFor="buscar-cliente" className="etiqueta-campo">
            Buscar
          </label>
          <input id="buscar-cliente" type="search" className="campo" placeholder="Nombre, correo, celular o ciudad" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <label className="flex min-h-12 items-center gap-2 font-bold">
          <input type="checkbox" className="size-5 accent-rosa" checked={soloAutorizados} onChange={(e) => setSoloAutorizados(e.target.checked)} />
          Solo autorizaron correos
        </label>
      </div>
      <div className="tarjeta overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">Lista de clientes</caption>
          <thead className="border-b border-linea bg-crema/60">
            <tr>
              {["Cliente", "Ciudad", "Registro", "Pedidos", "Total comprado", "Correos", ""].map((h, i) => (
                <th key={i} scope="col" className={`px-4 py-3 ${["Pedidos", "Total comprado"].includes(h) ? "text-right" : ""}`}>
                  {h || <span className="sr-only">Acciones</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.map((f) => (
              <tr key={f.c.id} className="border-b border-linea/70">
                <th scope="row" className="px-4 py-2 font-normal">
                  <span className="block font-bold">
                    {f.c.nombre} {f.c.apellidos}
                  </span>
                  <span className="text-cacao-suave">{f.c.correo}</span>
                </th>
                <td className="px-4 py-2">{f.c.ciudad}</td>
                <td className="px-4 py-2 whitespace-nowrap">{fechaCorta(f.c.creado)}</td>
                <td className="px-4 py-2 text-right tabular-nums">{f.pedidos.length}</td>
                <td className="px-4 py-2 text-right tabular-nums">{pesos(f.total)}</td>
                <td className="px-4 py-2">{f.c.autorizaCorreos ? "Sí" : "No"}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    type="button"
                    className="min-h-11 rounded-full px-4 font-bold text-rosa underline underline-offset-2"
                    onClick={() => {
                      setSel(f.c);
                      requestAnimationFrame(() => dialogo.current?.showModal());
                    }}
                  >
                    Historial<span className="sr-only"> de {f.c.nombre}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog ref={dialogo} onClose={() => setSel(null)} aria-labelledby="titulo-cliente" className="m-auto max-h-[92dvh] overflow-y-auto w-[min(94vw,680px)] rounded-3xl bg-papel p-0 text-cacao backdrop:bg-cacao/40">
        {sel && (
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 id="titulo-cliente" className="text-3xl">
                {sel.nombre} {sel.apellidos}
              </h2>
              <button type="button" className="boton-sec !min-h-11 !px-4" onClick={() => dialogo.current?.close()}>
                Cerrar
              </button>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-bold text-cacao-suave">Contacto</dt>
                <dd>
                  {sel.correo}
                  <br />
                  {sel.celular}
                  {sel.cedula ? ` · C.C. ${sel.cedula}` : ""}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-cacao-suave">Dirección</dt>
                <dd>
                  {sel.direccion}
                  {sel.complemento ? `, ${sel.complemento}` : ""}, {sel.ciudad}, {sel.departamento}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-cacao-suave">Autorización de datos</dt>
                <dd>
                  {fecha(sel.autorizaDatos.fecha)} · versión {sel.autorizaDatos.version}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-cacao-suave">Correos de campañas</dt>
                <dd>{sel.autorizaCorreos ? `Autorizó el ${fecha(sel.fechaAutorizaCorreos ?? sel.creado)}` : "No autorizó"}</dd>
              </div>
            </dl>
            <h3 className="mt-6 font-sans text-lg font-extrabold tracking-normal">Historial de compras</h3>
            <ul className="mt-2 divide-y divide-linea">
              {(filas.find((f) => f.c.id === sel.id)?.pedidos ?? []).map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                  <span className="font-bold">{p.numero}</span>
                  <span>{fechaCorta(p.creado)}</span>
                  <InsigniaEstado estado={p.estado} />
                  <span className="tabular-nums">{pesos(p.total)}</span>
                </li>
              ))}
              {!filas.find((f) => f.c.id === sel.id)?.pedidos.length && <li className="py-2 text-sm text-cacao-suave">Sin compras todavía.</li>}
            </ul>
          </div>
        )}
      </dialog>
    </div>
  );
}
