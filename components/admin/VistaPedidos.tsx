"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { InsigniaEstado } from "@/components/tienda/SeguimientoPedido";
import { fechaCorta, fechaHora, pesos } from "@/lib/formato";
import { useDatos } from "@/lib/hooks";
import { NOMBRE_ESTADO, NOMBRE_PAGO } from "@/lib/marca";
import { ErrorRepositorio, repo } from "@/lib/repositorio";
import type { EstadoPedido, Pedido } from "@/lib/tipos";

const ESTADOS = Object.keys(NOMBRE_ESTADO) as EstadoPedido[];

function normalizar(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function VistaPedidos() {
  const pedidos = useDatos((r) => r.listarPedidos());
  const config = useDatos((r) => r.configuracion());
  const params = useSearchParams();
  const router = useRouter();
  const ruta = usePathname();
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState("");
  const [pago, setPago] = useState("");
  const [limite, setLimite] = useState(30);
  const seleccionado = params.get("n");

  const lista = useMemo(() => {
    if (!pedidos) return [];
    const nq = normalizar(q.trim());
    return pedidos.filter((p) => {
      if (estado && p.estado !== estado) return false;
      if (pago && p.metodoPago !== pago) return false;
      if (nq && !normalizar(`${p.numero} ${p.contacto.nombre} ${p.contacto.apellidos} ${p.contacto.correo} ${p.envio.ciudad} ${p.guia ?? ""}`).includes(nq)) return false;
      return true;
    });
  }, [pedidos, q, estado, pago]);

  const pedidoSel = pedidos?.find((p) => p.numero === seleccionado);

  if (!pedidos || !config) return <p>Cargando pedidos…</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">Pedidos</h1>
          <p className="mt-1 text-cacao-suave">{pedidos.length} pedidos en total.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3" role="search" aria-label="Filtrar pedidos">
        <div className="min-w-60 flex-1">
          <label htmlFor="buscar-pedido" className="etiqueta-campo">
            Buscar
          </label>
          <input id="buscar-pedido" type="search" className="campo" placeholder="Número, cliente, correo, ciudad o guía" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div>
          <label htmlFor="filtro-estado" className="etiqueta-campo">
            Estado
          </label>
          <select id="filtro-estado" className="campo" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos</option>
            {ESTADOS.map((s) => (
              <option key={s} value={s}>
                {NOMBRE_ESTADO[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filtro-pago" className="etiqueta-campo">
            Pago
          </label>
          <select id="filtro-pago" className="campo" value={pago} onChange={(e) => setPago(e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(NOMBRE_PAGO).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p role="status" className="text-sm font-bold">
        {lista.length} {lista.length === 1 ? "resultado" : "resultados"}
      </p>
      <div className="tarjeta overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">Lista de pedidos</caption>
          <thead className="border-b border-linea bg-crema/60">
            <tr>
              {["Pedido", "Fecha", "Cliente", "Ciudad", "Total", "Pago", "Estado", ""].map((h, i) => (
                <th key={i} scope="col" className={`px-4 py-3 font-bold ${h === "Total" ? "text-right" : ""}`}>
                  {h || <span className="sr-only">Acciones</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lista.slice(0, limite).map((p) => (
              <tr key={p.id} className="border-b border-linea/70 hover:bg-crema/50">
                <th scope="row" className="px-4 py-2 font-extrabold">
                  {p.numero}
                </th>
                <td className="px-4 py-2 whitespace-nowrap">{fechaCorta(p.creado)}</td>
                <td className="px-4 py-2">
                  {p.contacto.nombre} {p.contacto.apellidos.split(" ")[0]}
                </td>
                <td className="px-4 py-2">{p.envio.ciudad}</td>
                <td className="px-4 py-2 text-right tabular-nums">{pesos(p.total)}</td>
                <td className="px-4 py-2">{NOMBRE_PAGO[p.metodoPago]}</td>
                <td className="px-4 py-2">
                  <InsigniaEstado estado={p.estado} />
                </td>
                <td className="px-4 py-2 text-right">
                  <button type="button" className="min-h-11 rounded-full px-4 font-bold text-rosa underline underline-offset-2" onClick={() => router.replace(`${ruta}?n=${p.numero}`, { scroll: false })}>
                    Gestionar<span className="sr-only"> {p.numero}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {lista.length > limite && (
        <button type="button" className="boton-sec" onClick={() => setLimite((l) => l + 30)}>
          Ver más pedidos
        </button>
      )}

      {pedidoSel && <EditorPedido key={pedidoSel.numero} pedido={pedidoSel} transportadoras={config.transportadoras} alCerrar={() => router.replace(ruta, { scroll: false })} />}
    </div>
  );
}

function EditorPedido({ pedido, transportadoras, alCerrar }: { pedido: Pedido; transportadoras: string[]; alCerrar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    dialogo.current?.showModal();
  }, []);

  async function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setGuardando(true);
    setError("");
    try {
      await repo().actualizarPedido(pedido.numero, {
        estado: String(f.get("estado")) as EstadoPedido,
        transportadora: String(f.get("transportadora") ?? ""),
        guia: String(f.get("guia") ?? "").slice(0, 40),
        notaCliente: String(f.get("notaCliente") ?? "").slice(0, 300),
        notaHistorial: String(f.get("notaHistorial") ?? "").slice(0, 200),
      });
      setOk("Cambios guardados. El cliente ya ve el nuevo estado en su seguimiento.");
    } catch (err) {
      setError(err instanceof ErrorRepositorio ? err.message : "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <dialog ref={dialogo} onClose={alCerrar} aria-labelledby="titulo-editor" className="m-auto max-h-[92dvh] overflow-y-auto w-[min(94vw,760px)] rounded-3xl bg-papel p-0 text-cacao backdrop:bg-cacao/40">
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="titulo-editor" className="text-3xl">
              Pedido {pedido.numero}
            </h2>
            <p className="text-cacao-suave">
              {fechaHora(pedido.creado)} · {NOMBRE_PAGO[pedido.metodoPago]} · {pesos(pedido.total)}
            </p>
          </div>
          <button type="button" className="boton-sec !min-h-11 !px-4" onClick={() => dialogo.current?.close()}>
            Cerrar
          </button>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-sans text-base font-extrabold tracking-normal">Cliente</h3>
            <p>
              {pedido.contacto.nombre} {pedido.contacto.apellidos}
              <br />
              {pedido.contacto.correo}
              <br />
              {pedido.contacto.celular}
            </p>
          </div>
          <div>
            <h3 className="font-sans text-base font-extrabold tracking-normal">Entrega</h3>
            <p>
              {pedido.envio.direccion}
              {pedido.envio.complemento ? `, ${pedido.envio.complemento}` : ""}
              <br />
              {pedido.envio.ciudad}, {pedido.envio.departamento}
            </p>
          </div>
        </div>
        <ul className="mt-4 divide-y divide-linea border-y border-linea text-sm">
          {pedido.items.map((it) => (
            <li key={`${it.productoId}-${it.talla}`} className="flex justify-between py-2">
              <span>
                {it.nombre} · talla {it.talla} × {it.cantidad}
              </span>
              <span className="tabular-nums">{pesos(it.precio * it.cantidad)}</span>
            </li>
          ))}
        </ul>

        <form onSubmit={guardar} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ed-estado" className="etiqueta-campo">
              Estado
            </label>
            <select id="ed-estado" name="estado" defaultValue={pedido.estado} className="campo">
              {ESTADOS.map((s) => (
                <option key={s} value={s}>
                  {NOMBRE_ESTADO[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ed-transp" className="etiqueta-campo">
              Transportadora
            </label>
            <select id="ed-transp" name="transportadora" defaultValue={pedido.transportadora ?? ""} className="campo">
              <option value="">Sin asignar</option>
              {[...new Set([...transportadoras, ...(pedido.transportadora ? [pedido.transportadora] : [])])].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ed-guia" className="etiqueta-campo">
              Número de guía
            </label>
            <input id="ed-guia" name="guia" defaultValue={pedido.guia} className="campo" maxLength={40} />
          </div>
          <div>
            <label htmlFor="ed-nota-h" className="etiqueta-campo">
              Nota para el historial <span className="font-normal text-cacao-suave">(opcional)</span>
            </label>
            <input id="ed-nota-h" name="notaHistorial" className="campo" maxLength={200} placeholder="Ej.: Salió con el mensajero" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="ed-nota" className="etiqueta-campo">
              Nota visible para el cliente
            </label>
            <textarea id="ed-nota" name="notaCliente" defaultValue={pedido.notaCliente} className="campo min-h-24" maxLength={300} />
          </div>
          {error && (
            <p role="alert" className="error-campo sm:col-span-2">
              {error}
            </p>
          )}
          {ok && (
            <p role="status" className="rounded-2xl bg-salvia px-4 py-2 font-bold sm:col-span-2">
              {ok}
            </p>
          )}
          <div className="sm:col-span-2">
            <button type="submit" className="boton" disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>

        <h3 className="mt-8 font-sans text-base font-extrabold tracking-normal">Historial</h3>
        <ol className="mt-2 space-y-1 text-sm">
          {[...pedido.historial].reverse().map((h) => (
            <li key={h.fecha + h.estado}>
              <strong>{NOMBRE_ESTADO[h.estado]}</strong> · {fechaHora(h.fecha)}
              {h.nota ? ` · ${h.nota}` : ""}
            </li>
          ))}
        </ol>
      </div>
    </dialog>
  );
}
