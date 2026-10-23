"use client";

import Image from "next/image";
import { useState } from "react";
import { fechaHora } from "@/lib/formato";
import { useDatos } from "@/lib/hooks";
import { repo } from "@/lib/repositorio";
import type { Segmento } from "@/lib/tipos";

const SEGMENTOS: { id: Segmento; nombre: string; detalle: string }[] = [
  { id: "todos", nombre: "Todos", detalle: "Todos los clientes que autorizaron correos" },
  { id: "compradores", nombre: "Compradores", detalle: "Han hecho al menos un pedido" },
  { id: "sin_compra", nombre: "Sin compra", detalle: "Se registraron pero aún no compran" },
];

export function VistaCampanas() {
  const datos = useDatos(async (r) => ({ clientes: await r.listarClientes(), pedidos: await r.listarPedidos(), campanas: await r.listarCampanas() }));
  const [segmento, setSegmento] = useState<Segmento>("todos");
  const [asunto, setAsunto] = useState("Llegó la colección de temporada");
  const [contenido, setContenido] = useState("Hola, {nombre}:\n\nYa están en la tienda las prendas nuevas para esta temporada: vestidos, conjuntos de lino y calzado para los primeros pasos.\n\nTe esperamos en el Cc San Miguel o en nuestra tienda en línea.\n\nCon cariño,\nPequeños Sueños");
  const [estado, setEstado] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (!datos) return <p>Cargando…</p>;
  const compradores = new Set(datos.pedidos.filter((p) => p.estado !== "cancelado").map((p) => p.contacto.correo));
  const autorizados = datos.clientes.filter((c) => c.autorizaCorreos);
  const destino = (s: Segmento) => autorizados.filter((c) => (s === "compradores" ? compradores.has(c.correo) : s === "sin_compra" ? !compradores.has(c.correo) : true));
  const lista = destino(segmento);
  const ejemplo = lista[0]?.nombre.split(" ")[0] ?? "Ana";

  async function enviar() {
    setEnviando(true);
    setEstado(null);
    try {
      const r = await fetch("/api/admin/campanas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asunto, contenido, segmento, destinatarios: lista.map((c) => c.correo) }),
      });
      const j = (await r.json()) as { ok: boolean; enviados?: number; error?: string; mensaje?: string };
      if (!r.ok || !j.ok) throw new Error(j.error ?? "No se pudo enviar.");
      await repo().registrarCampana({ asunto, contenido, segmento, destinatarios: j.enviados ?? lista.length });
      setEstado({ tipo: "ok", texto: `${j.mensaje} Destinatarios: ${j.enviados}.` });
    } catch (e) {
      setEstado({ tipo: "error", texto: e instanceof Error ? e.message : "No se pudo enviar." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl">Campañas de correo</h1>
        <p className="mt-1 text-cacao-suave">Solo se escribe a quienes autorizaron correos ({autorizados.length} de {datos.clientes.length} clientes). En la demo el envío es simulado.</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <form
          className="tarjeta space-y-5 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            enviar();
          }}
        >
          <fieldset>
            <legend className="etiqueta-campo">Segmento</legend>
            <div className="space-y-2">
              {SEGMENTOS.map((s) => (
                <label key={s.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl border border-linea px-4 py-2 has-[:checked]:border-cacao">
                  <input type="radio" name="segmento" className="size-5 accent-rosa" checked={segmento === s.id} onChange={() => setSegmento(s.id)} />
                  <span className="flex-1">
                    <strong>{s.nombre}</strong> <span className="text-sm text-cacao-suave">· {s.detalle}</span>
                  </span>
                  <span className="font-extrabold tabular-nums">{destino(s.id).length}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="c-asunto" className="etiqueta-campo">
              Asunto
            </label>
            <input id="c-asunto" className="campo" value={asunto} onChange={(e) => setAsunto(e.target.value)} maxLength={120} />
          </div>
          <div>
            <label htmlFor="c-contenido" className="etiqueta-campo">
              Mensaje <span className="font-normal text-cacao-suave">(usa {"{nombre}"} para personalizar)</span>
            </label>
            <textarea id="c-contenido" className="campo min-h-56" value={contenido} onChange={(e) => setContenido(e.target.value)} maxLength={5000} />
          </div>
          {estado && (
            <p role={estado.tipo === "error" ? "alert" : "status"} className={estado.tipo === "error" ? "error-campo" : "rounded-2xl bg-salvia px-4 py-2 font-bold"}>
              {estado.texto}
            </p>
          )}
          <button type="submit" className="boton" disabled={enviando || !lista.length}>
            {enviando ? "Enviando…" : `Enviar a ${lista.length} (simulado)`}
          </button>
        </form>

        <section aria-labelledby="titulo-vista" className="space-y-3">
          <h2 id="titulo-vista" className="font-sans text-xl font-extrabold tracking-normal">
            Vista previa
          </h2>
          <div className="overflow-hidden rounded-3xl border border-linea bg-white shadow-sm">
            <div className="border-b border-linea bg-crema px-5 py-3 text-sm">
              <p>
                <strong>De:</strong> Pequeños Sueños
              </p>
              <p>
                <strong>Asunto:</strong> {asunto}
              </p>
            </div>
            <div className="px-6 py-8">
              <Image src="/marca/logo-pequenos-suenos.webp" alt="" width={72} height={72} className="mx-auto rounded-full" />
              <div className="mt-6 whitespace-pre-line">{contenido.replaceAll("{nombre}", ejemplo)}</div>
              <p className="mt-8 border-t border-linea pt-4 text-center text-xs text-cacao-suave">Recibes este correo porque autorizaste novedades de Pequeños Sueños. Darse de baja: enlace de baja (se activa con la integración de correo).</p>
            </div>
          </div>
        </section>
      </div>

      <section aria-labelledby="titulo-historial-c">
        <h2 id="titulo-historial-c" className="font-sans text-xl font-extrabold tracking-normal">
          Historial
        </h2>
        {datos.campanas.length === 0 ? (
          <p className="mt-2 text-cacao-suave">Aún no se ha enviado ninguna campaña.</p>
        ) : (
          <div className="tarjeta mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">Historial de campañas</caption>
              <thead className="border-b border-linea bg-crema/60">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Fecha
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Asunto
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Segmento
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Destinatarios
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {datos.campanas.map((c) => (
                  <tr key={c.id} className="border-b border-linea/70">
                    <td className="px-4 py-2 whitespace-nowrap">{fechaHora(c.fecha)}</td>
                    <th scope="row" className="px-4 py-2 font-bold">
                      {c.asunto}
                    </th>
                    <td className="px-4 py-2">{SEGMENTOS.find((s) => s.id === c.segmento)?.nombre}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{c.destinatarios}</td>
                    <td className="px-4 py-2">Simulado</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
