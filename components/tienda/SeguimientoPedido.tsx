"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { IconoCamion, IconoCheck, IconoUbicacion, IconoWhatsApp } from "@/components/Iconos";
import { diaSemana, fecha, fechaHora, pesos } from "@/lib/formato";
import { ETAPAS, NOMBRE_ESTADO, NOMBRE_PAGO, enlaceWhatsApp } from "@/lib/marca";
import { indiceEtapa, puedeCancelar } from "@/lib/pedidos";
import { ErrorRepositorio, repo } from "@/lib/repositorio";
import type { Pedido } from "@/lib/tipos";

function esHoy(iso: string) {
  const f = (d: Date) => d.toLocaleDateString("es-CO", { timeZone: "America/Bogota" });
  return f(new Date(iso)) === f(new Date());
}

export function InsigniaEstado({ estado }: { estado: Pedido["estado"] }) {
  const estilos: Record<Pedido["estado"], string> = {
    recibido: "bg-durazno text-cacao",
    pagado: "bg-durazno text-cacao",
    preparando: "bg-lila text-cacao",
    enviado: "bg-lila text-cacao",
    en_reparto: "bg-rosa-nube text-cacao",
    entregado: "bg-salvia text-cacao",
    cancelado: "bg-cacao text-white",
  };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-extrabold ${estilos[estado]}`}>{NOMBRE_ESTADO[estado]}</span>;
}

function BarraProgreso({ pedido }: { pedido: Pedido }) {
  const cancelado = pedido.estado === "cancelado";
  const ultimoActivo = cancelado
    ? Math.max(...pedido.historial.filter((h) => h.estado !== "cancelado").map((h) => indiceEtapa(h.estado)))
    : indiceEtapa(pedido.estado);
  const avance = Math.max(0, ultimoActivo) / (ETAPAS.length - 1);
  return (
    <div className="relative">
      {/* Riel */}
      <div className="absolute top-5 right-[8.33%] left-[8.33%] hidden h-1.5 rounded-full bg-linea sm:block" aria-hidden="true">
        <div className={`h-full rounded-full ${cancelado ? "bg-cacao-suave" : "bg-rosa"}`} style={{ width: `${avance * 100}%` }} />
      </div>
      <ol className="relative grid gap-3 sm:grid-cols-6 sm:gap-0">
        {ETAPAS.map((e, i) => {
          const hecho = i <= ultimoActivo;
          const actual = !cancelado && i === ultimoActivo;
          const evento = pedido.historial.filter((h) => h.estado === e.estado).at(-1);
          return (
            <li key={e.estado} aria-current={actual ? "step" : undefined} className="flex items-center gap-3 sm:flex-col sm:gap-2 sm:text-center">
              <span
                className={`relative z-10 grid size-11 shrink-0 place-items-center rounded-full border-2 ${
                  hecho ? (cancelado ? "border-cacao-suave bg-cacao-suave text-white" : "border-rosa bg-rosa text-white") : "border-linea bg-papel text-cacao-suave"
                } ${actual ? "ring-4 ring-rosa-nube" : ""}`}
              >
                {hecho ? <IconoCheck tam={20} /> : <span className="text-sm font-extrabold">{i + 1}</span>}
              </span>
              <span>
                <span className={`block font-extrabold ${hecho ? "" : "text-cacao-suave"}`}>{e.nombre}</span>
                <span className="block text-xs text-cacao-suave">{evento ? fechaHora(evento.fecha) : "Pendiente"}</span>
                <span className="sr-only">{hecho ? (actual ? "(etapa actual)" : "(completada)") : "(pendiente)"}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function SeguimientoPedido({ pedido, correo }: { pedido: Pedido; correo: string }) {
  const [error, setError] = useState("");
  const [cancelando, setCancelando] = useState(false);
  const dialogo = useRef<HTMLDialogElement>(null);
  const cancelado = pedido.estado === "cancelado";
  const entregado = pedido.estado === "entregado";
  const eventoEntrega = pedido.historial.findLast((h) => h.estado === "entregado");

  async function cancelar() {
    setCancelando(true);
    setError("");
    try {
      await repo().cancelarPedido(pedido.numero, correo);
      dialogo.current?.close();
    } catch (e) {
      setError(e instanceof ErrorRepositorio ? e.message : "No pudimos cancelar el pedido.");
    } finally {
      setCancelando(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="tarjeta overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-linea p-6 sm:p-8">
          <div>
            <p className="sobretitulo">Pedido {pedido.numero}</p>
            <h2 className="mt-2 text-3xl sm:text-4xl" aria-live="polite">
              {cancelado ? "Pedido cancelado" : entregado ? `Entregado el ${diaSemana(eventoEntrega?.fecha ?? pedido.fechaEstimada)}` : esHoy(pedido.fechaEstimada) ? <>Llega <em className="acento">hoy</em></> : <>Llega el <em className="acento">{diaSemana(pedido.fechaEstimada)}</em></>}
            </h2>
            <p className="mt-2 text-cacao-suave">Comprado el {fecha(pedido.creado)}</p>
          </div>
          <InsigniaEstado estado={pedido.estado} />
        </div>
        <div className="p-6 sm:p-8">
          <BarraProgreso pedido={pedido} />
          {pedido.notaCliente && (
            <p className="mt-8 rounded-2xl bg-lila px-4 py-3">
              <strong>Nota de la tienda:</strong> {pedido.notaCliente}
            </p>
          )}
          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="flex gap-3">
              <IconoCamion className="mt-0.5 shrink-0 text-rosa" />
              <div>
                <dt className="text-sm font-bold text-cacao-suave">Transportadora</dt>
                <dd className="font-bold">{pedido.transportadora ?? "Por asignar"}</dd>
              </div>
            </div>
            <div>
              <dt className="text-sm font-bold text-cacao-suave">Número de guía</dt>
              <dd className="font-bold">{pedido.guia ?? (pedido.transportadora === "Mensajero local" ? "Entrega directa, sin guía" : "Se asigna al enviar")}</dd>
            </div>
            <div className="flex gap-3">
              <IconoUbicacion className="mt-0.5 shrink-0 text-rosa" />
              <div>
                <dt className="text-sm font-bold text-cacao-suave">Dirección de entrega</dt>
                <dd>
                  {pedido.envio.direccion}
                  {pedido.envio.complemento ? `, ${pedido.envio.complemento}` : ""}
                  <br />
                  {pedido.envio.ciudad}, {pedido.envio.departamento}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <section aria-labelledby="titulo-historial" className="tarjeta p-6 sm:p-8">
          <h2 id="titulo-historial" className="text-2xl">
            Historial
          </h2>
          <ol className="mt-5 space-y-5 border-l-2 border-linea pl-5">
            {[...pedido.historial].reverse().map((h, i) => (
              <li key={`${h.estado}-${h.fecha}`} className="relative">
                <span className={`absolute top-1.5 -left-[27px] size-3 rounded-full ${i === 0 ? "bg-rosa ring-4 ring-rosa-nube" : "bg-cacao-suave"}`} aria-hidden="true" />
                <p className="font-bold">{NOMBRE_ESTADO[h.estado]}</p>
                <p className="text-sm text-cacao-suave">{fechaHora(h.fecha)}</p>
                {h.nota && <p className="mt-1 text-sm">{h.nota}</p>}
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="titulo-detalle" className="tarjeta p-6 sm:p-8">
          <h2 id="titulo-detalle" className="text-2xl">
            Detalle de la compra
          </h2>
          <ul className="mt-5 divide-y divide-linea">
            {pedido.items.map((it) => (
              <li key={`${it.productoId}-${it.talla}`} className="flex justify-between gap-4 py-3">
                <span>
                  <Link href={`/producto/${it.slug}`} className="font-bold hover:underline">
                    {it.nombre}
                  </Link>
                  <span className="block text-sm text-cacao-suave">
                    Talla {it.talla} × {it.cantidad}
                  </span>
                </span>
                <span className="shrink-0">{pesos(it.precio * it.cantidad)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1 border-t border-linea pt-3">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{pesos(pedido.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Envío</dt>
              <dd>{pedido.costoEnvio ? pesos(pedido.costoEnvio) : "Gratis"}</dd>
            </div>
            <div className="flex justify-between text-lg font-extrabold">
              <dt>Total</dt>
              <dd>{pesos(pedido.total)}</dd>
            </div>
            <div className="flex justify-between text-sm text-cacao-suave">
              <dt>Método de pago</dt>
              <dd>{NOMBRE_PAGO[pedido.metodoPago]} (simulado)</dd>
            </div>
          </dl>
        </section>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a href={enlaceWhatsApp(`Hola, Pequeños Sueños. Tengo una pregunta sobre mi pedido ${pedido.numero}.`)} target="_blank" rel="noopener noreferrer" className="boton-sec">
          <IconoWhatsApp tam={22} /> Ayuda con este pedido
        </a>
        {puedeCancelar(pedido) && (
          <button type="button" className="boton-sec !border-alerta !text-alerta" onClick={() => dialogo.current?.showModal()}>
            Cancelar pedido
          </button>
        )}
      </div>

      <dialog ref={dialogo} aria-labelledby="titulo-cancelar" className="m-auto w-[min(92vw,460px)] rounded-3xl bg-papel p-0 text-cacao backdrop:bg-cacao/40">
        <div className="p-6">
          <h2 id="titulo-cancelar" className="text-2xl">
            ¿Cancelar el pedido {pedido.numero}?
          </h2>
          <p className="mt-3 text-cacao-suave">Las prendas vuelven a la tienda y, si pagaste, te devolvemos el dinero (en la demo no hay cobros reales).</p>
          {error && (
            <p role="alert" className="error-campo mt-3">
              {error}
            </p>
          )}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" className="boton-sec" onClick={() => dialogo.current?.close()}>
              No, conservarlo
            </button>
            <button type="button" className="boton !bg-alerta" onClick={cancelar} disabled={cancelando}>
              {cancelando ? "Cancelando…" : "Sí, cancelar"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
