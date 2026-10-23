"use client";

import Link from "next/link";
import { IconoAlerta } from "@/components/Iconos";
import { calcularEstadisticas } from "@/lib/estadisticas";
import { fechaCorta, pesos, pesosCompactos } from "@/lib/formato";
import { useDatos } from "@/lib/hooks";
import { NOMBRE_ESTADO, NOMBRE_PAGO } from "@/lib/marca";
import { BarrasHorizontales, ColumnasApiladas, SERIES, TarjetaDato } from "./Graficas";

export function VistaResumen() {
  const datos = useDatos(async (r) => {
    const [pedidos, clientes, productos] = await Promise.all([r.listarPedidos(), r.listarClientes(), r.listarProductos()]);
    return calcularEstadisticas(pedidos, clientes, productos);
  });
  if (!datos) return <p>Cargando estadísticas…</p>;
  const e = datos;
  const num = (n: number) => n.toLocaleString("es-CO");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl">Resumen</h1>
        <p className="mt-1 text-cacao-suave">Últimos 30 días frente a los 30 anteriores. Pedidos cancelados excluidos de las ventas.</p>
      </div>

      <section aria-label="Indicadores principales" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <TarjetaDato etiqueta="Ventas (30 días)" valor={pesos(e.ventas30)} actual={e.ventas30} previo={e.ventas30Previo} formato={pesosCompactos} />
        <TarjetaDato etiqueta="Pedidos" valor={num(e.pedidos30)} actual={e.pedidos30} previo={e.pedidos30Previo} formato={num} />
        <TarjetaDato etiqueta="Ticket promedio" valor={pesos(e.ticket30)} actual={e.ticket30} previo={e.ticket30Previo} formato={pesosCompactos} />
        <TarjetaDato etiqueta="Clientes nuevos" valor={num(e.clientesNuevos30)} actual={e.clientesNuevos30} previo={e.clientesNuevos30Previo} formato={num} />
        <div className="tarjeta p-5">
          <p className="text-sm font-bold text-cacao-suave">Tasa de recompra</p>
          <p className="mt-1 text-[1.65rem] leading-tight font-extrabold tracking-tight">{Math.round(e.tasaRecompra * 100)} %</p>
          <p className="mt-1 text-sm text-cacao-suave">de {e.compradores} compradores tiene 2 o más pedidos</p>
        </div>
      </section>

      {(e.pendientes.length > 0 || e.bajoInventario.length > 0) && (
        <section aria-labelledby="titulo-alertas" className="grid gap-4 lg:grid-cols-2">
          <h2 id="titulo-alertas" className="sr-only">
            Alertas
          </h2>
          <div className="tarjeta border-durazno-hondo/40 p-5">
            <h3 className="flex items-center gap-2 font-sans text-lg font-extrabold tracking-normal">
              <IconoAlerta className="text-durazno-hondo" /> {e.pendientes.length} pedidos por despachar
            </h3>
            <ul className="mt-3 divide-y divide-linea text-sm">
              {e.pendientes.slice(0, 5).map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <Link href={`/admin/pedidos?n=${p.numero}`} className="font-bold underline underline-offset-2">
                    {p.numero}
                  </Link>
                  <span>
                    {p.contacto.nombre} · {p.envio.ciudad}
                  </span>
                  <span className="text-cacao-suave">
                    {NOMBRE_ESTADO[p.estado]} desde {fechaCorta(p.historial.at(-1)!.fecha)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="tarjeta border-alerta/30 p-5">
            <h3 className="flex items-center gap-2 font-sans text-lg font-extrabold tracking-normal">
              <IconoAlerta className="text-alerta" /> Inventario bajo o agotado ({e.bajoInventario.length})
            </h3>
            <ul className="mt-3 max-h-56 divide-y divide-linea overflow-y-auto text-sm">
              {e.bajoInventario.slice(0, 12).map((x) => (
                <li key={`${x.producto.id}-${x.talla}`} className="flex justify-between gap-2 py-2">
                  <Link href={`/admin/productos?editar=${x.producto.id}`} className="underline underline-offset-2">
                    {x.producto.nombre} · talla {x.talla}
                  </Link>
                  <span className={`shrink-0 font-bold ${x.existencias === 0 ? "text-alerta" : "text-durazno-hondo"}`}>{x.existencias === 0 ? "Agotado" : "Queda 1"}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="titulo-mes" className="tarjeta p-5 sm:p-6">
        <h2 id="titulo-mes" className="font-sans text-xl font-extrabold tracking-normal">
          Ventas por mes y método de pago
        </h2>
        <p className="mb-4 text-sm text-cacao-suave">Últimos 12 meses. Diciembre es la temporada alta.</p>
        <ColumnasApiladas
          titulo="Ventas por mes y método de pago, últimos 12 meses"
          datos={e.porMes.map((m) => ({ etiqueta: m.etiqueta, valores: m.porMetodo }))}
          series={(["tarjeta", "pse", "contraentrega"] as const).map((k) => ({ clave: k, nombre: NOMBRE_PAGO[k], color: SERIES[k] }))}
          formato={pesos}
          formatoEje={pesosCompactos}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section aria-labelledby="titulo-cat" className="tarjeta p-5 sm:p-6">
          <h2 id="titulo-cat" className="mb-4 font-sans text-xl font-extrabold tracking-normal">
            Ventas por categoría (12 meses)
          </h2>
          <BarrasHorizontales titulo="Ventas por categoría" datos={e.porCategoria.map((c) => ({ nombre: c.nombre, valor: c.total }))} formato={pesosCompactos} columnaValor="Ventas" />
        </section>
        <section aria-labelledby="titulo-top" className="tarjeta p-5 sm:p-6">
          <h2 id="titulo-top" className="mb-4 font-sans text-xl font-extrabold tracking-normal">
            Productos más vendidos (unidades)
          </h2>
          <BarrasHorizontales
            titulo="Productos más vendidos"
            datos={e.topProductos.map((p) => ({ nombre: p.nombre, valor: p.unidades, detalle: pesos(p.total) }))}
            formato={(n) => `${n} u.`}
            columnaValor="Unidades"
          />
        </section>
        <section aria-labelledby="titulo-estado" className="tarjeta p-5 sm:p-6">
          <h2 id="titulo-estado" className="mb-4 font-sans text-xl font-extrabold tracking-normal">
            Pedidos por estado
          </h2>
          <BarrasHorizontales titulo="Pedidos por estado" datos={e.porEstado.map((x) => ({ nombre: x.nombre, valor: x.cantidad }))} formato={(n) => String(n)} columnaValor="Pedidos" />
        </section>
        <section aria-labelledby="titulo-ciudad" className="tarjeta p-5 sm:p-6">
          <h2 id="titulo-ciudad" className="mb-4 font-sans text-xl font-extrabold tracking-normal">
            Ciudades con más pedidos (12 meses)
          </h2>
          <BarrasHorizontales titulo="Ciudades con más pedidos" datos={e.porCiudad.map((x) => ({ nombre: x.nombre, valor: x.cantidad }))} formato={(n) => String(n)} columnaValor="Pedidos" />
        </section>
      </div>
    </div>
  );
}
