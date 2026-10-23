"use client";

import { useId, useState } from "react";

// Gráficas del panel según el skill `dataviz`:
// - Paleta categórica validada con validate_palette.js (docs/validacion-paleta-graficas.txt)
// - Marcas delgadas (≤ 24 px), extremo redondeado de 4 px, separación de 2 px
// - Leyenda con 2+ series, tooltip al pasar el mouse o enfocar, tabla alternativa
// - El texto nunca usa el color de la serie
export const SERIES = {
  tarjeta: "#C8506A",
  pse: "#6B58C4",
  contraentrega: "#BD7F14",
} as const;
export const SERIE_UNICA = "#C8506A";

const tinta = { primaria: "#4A3438", secundaria: "#7A6064", grilla: "#EFE6DE", base: "#D8C9C0" };

function techo(max: number) {
  if (max <= 0) return { tope: 1, pasos: [0, 1] };
  const exp = Math.pow(10, Math.floor(Math.log10(max)));
  const paso = [1, 2, 2.5, 5, 10].map((m) => m * exp).find((s) => max / s <= 4) ?? exp * 10;
  const tope = Math.ceil(max / paso) * paso;
  const pasos: number[] = [];
  for (let v = 0; v <= tope + 1e-9; v += paso) pasos.push(v);
  return { tope, pasos };
}

export function TablaAlternativa({ titulo, columnas, filas }: { titulo: string; columnas: string[]; filas: (string | number)[][] }) {
  const [abierta, setAbierta] = useState(false);
  const id = useId();
  return (
    <div className="mt-3">
      <button type="button" className="text-sm font-bold text-rosa underline underline-offset-2" aria-expanded={abierta} aria-controls={id} onClick={() => setAbierta((v) => !v)}>
        {abierta ? "Ocultar tabla" : "Ver como tabla"}
      </button>
      <div id={id} className={abierta ? "mt-3 overflow-x-auto" : "sr-only"}>
        <table className="w-full text-left text-sm tabular-nums">
          <caption className="sr-only">{titulo}</caption>
          <thead>
            <tr className="border-b border-linea">
              {columnas.map((c, i) => (
                <th key={c} scope="col" className={`py-2 pr-4 font-bold ${i > 0 ? "text-right" : ""}`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr key={i} className="border-b border-linea/60">
                {f.map((v, j) =>
                  j === 0 ? (
                    <th key={j} scope="row" className="py-1.5 pr-4 font-normal">
                      {v}
                    </th>
                  ) : (
                    <td key={j} className="py-1.5 pr-4 text-right">
                      {v}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TarjetaDato({ etiqueta, valor, actual, previo, formato, invertido = false }: { etiqueta: string; valor: string; actual?: number; previo?: number; formato?: (n: number) => string; invertido?: boolean }) {
  let delta: React.ReactNode = null;
  if (actual !== undefined && previo !== undefined) {
    const cambio = previo === 0 ? (actual > 0 ? 1 : 0) : (actual - previo) / previo;
    const sube = cambio > 0.0005;
    const baja = cambio < -0.0005;
    const bueno = invertido ? baja : sube;
    const malo = invertido ? sube : baja;
    delta = (
      <p className={`mt-1 text-sm font-bold ${bueno ? "text-salvia-honda" : malo ? "text-alerta" : "text-cacao-suave"}`}>
        <span aria-hidden="true">{sube ? "▲" : baja ? "▼" : "■"}</span> {sube ? "+" : ""}
        {(cambio * 100).toLocaleString("es-CO", { maximumFractionDigits: 0 })} %{" "}
        <span className="font-normal text-cacao-suave">vs. 30 días anteriores{formato ? ` (${formato(previo)})` : ""}</span>
      </p>
    );
  }
  return (
    <div className="tarjeta p-5">
      <p className="text-sm font-bold text-cacao-suave">{etiqueta}</p>
      <p className="mt-1 text-[1.65rem] leading-tight font-extrabold tracking-tight whitespace-nowrap">{valor}</p>
      {delta}
    </div>
  );
}

interface Serie {
  clave: string;
  nombre: string;
  color: string;
}

/** Columnas apiladas (una por mes), con leyenda, tooltip y tabla. */
export function ColumnasApiladas({
  titulo,
  datos,
  series,
  formato,
  formatoEje,
}: {
  titulo: string;
  datos: { etiqueta: string; valores: Record<string, number> }[];
  series: Serie[];
  formato: (n: number) => string;
  formatoEje: (n: number) => string;
}) {
  const [activo, setActivo] = useState<number | null>(null);
  const totales = datos.map((d) => series.reduce((s, x) => s + (d.valores[x.clave] ?? 0), 0));
  const { tope, pasos } = techo(Math.max(...totales));
  const alto = 220;
  return (
    <figure>
      <ul className="mb-7 flex flex-wrap gap-x-5 gap-y-1 text-sm" aria-label="Leyenda">
        {series.map((s) => (
          <li key={s.clave} className="flex items-center gap-2">
            <span className="size-3 rounded-[3px]" style={{ background: s.color }} aria-hidden="true" />
            {s.nombre}
          </li>
        ))}
      </ul>
      <div className="relative flex gap-2">
        <div className="relative w-12 shrink-0 text-right text-xs tabular-nums" style={{ height: alto, color: tinta.secundaria }} aria-hidden="true">
          {pasos.map((v) => (
            <span key={v} className="absolute right-0 -translate-y-1/2" style={{ bottom: `${(v / tope) * 100}%` }}>
              {formatoEje(v)}
            </span>
          ))}
        </div>
        <div className="relative min-w-0 flex-1">
          <div className="relative" style={{ height: alto }}>
            {pasos.map((v) => (
              <div key={v} className="absolute inset-x-0 h-px" style={{ bottom: `${(v / tope) * 100}%`, background: v === 0 ? tinta.base : tinta.grilla }} aria-hidden="true" />
            ))}
            <div className="absolute inset-0 flex items-end justify-around">
              {datos.map((d, i) => (
                <div
                  key={d.etiqueta}
                  tabIndex={0}
                  role="img"
                  aria-label={`${d.etiqueta}: ${formato(totales[i])}. ${series.map((s) => `${s.nombre} ${formato(d.valores[s.clave] ?? 0)}`).join(", ")}`}
                  onPointerEnter={() => setActivo(i)}
                  onPointerLeave={() => setActivo(null)}
                  onFocus={() => setActivo(i)}
                  onBlur={() => setActivo(null)}
                  className="relative flex h-full flex-1 cursor-default flex-col items-center justify-end rounded-md outline-offset-0"
                >
                  <div className={`flex w-full max-w-6 flex-col-reverse gap-[2px] transition-opacity ${activo !== null && activo !== i ? "opacity-55" : ""}`} style={{ height: `${(totales[i] / tope) * 100}%` }}>
                    {series.map((s, j) => {
                      const v = d.valores[s.clave] ?? 0;
                      if (!v) return null;
                      const ultimo = series.slice(j + 1).every((x) => !(d.valores[x.clave] ?? 0));
                      return <div key={s.clave} style={{ flexGrow: v, background: s.color, borderRadius: ultimo ? "4px 4px 0 0" : 0 }} />;
                    })}
                  </div>
                  {activo === i && (
                    <div role="tooltip" className={`pointer-events-none absolute bottom-[calc(100%+6px)] z-10 w-max min-w-40 rounded-xl border border-linea bg-papel px-3 py-2 text-sm shadow-lg ${i > datos.length / 2 ? "right-0" : "left-0"}`} style={{ bottom: `calc(${(totales[i] / tope) * 100}% + 8px)` }}>
                      <p className="font-extrabold">{formato(totales[i])}</p>
                      <p className="mb-1 text-cacao-suave">{d.etiqueta}</p>
                      {series.map((s) => (
                        <p key={s.clave} className="flex items-center gap-2">
                          <span className="h-0.5 w-3 rounded" style={{ background: s.color }} aria-hidden="true" />
                          <span className="font-bold tabular-nums">{formato(d.valores[s.clave] ?? 0)}</span>
                          <span className="text-cacao-suave">{s.nombre}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 flex justify-around text-xs" style={{ color: tinta.secundaria }} aria-hidden="true">
            {datos.map((d) => (
              <span key={d.etiqueta} className="flex-1 text-center whitespace-nowrap max-sm:[&:nth-child(even)]:invisible">
                {d.etiqueta}
              </span>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="sr-only">{titulo}</figcaption>
      <TablaAlternativa
        titulo={titulo}
        columnas={["Mes", ...series.map((s) => s.nombre), "Total"]}
        filas={datos.map((d, i) => [d.etiqueta, ...series.map((s) => formato(d.valores[s.clave] ?? 0)), formato(totales[i])])}
      />
    </figure>
  );
}

/** Barras horizontales de una sola serie, con el valor en la punta. */
export function BarrasHorizontales({ titulo, datos, formato, columnaValor = "Valor" }: { titulo: string; datos: { nombre: string; valor: number; detalle?: string }[]; formato: (n: number) => string; columnaValor?: string }) {
  const [activo, setActivo] = useState<number | null>(null);
  const max = Math.max(1, ...datos.map((d) => d.valor));
  const total = datos.reduce((s, d) => s + d.valor, 0);
  return (
    <figure>
      <ul className="space-y-2.5">
        {datos.map((d, i) => (
          <li
            key={d.nombre}
            tabIndex={0}
            aria-label={`${d.nombre}: ${formato(d.valor)}${d.detalle ? `, ${d.detalle}` : ""}`}
            onPointerEnter={() => setActivo(i)}
            onPointerLeave={() => setActivo(null)}
            onFocus={() => setActivo(i)}
            onBlur={() => setActivo(null)}
            className="relative grid grid-cols-[minmax(0,9.5rem)_1fr] items-center gap-3 rounded-md text-sm"
          >
            <span className="truncate" title={d.nombre}>
              {d.nombre}
            </span>
            <span className="flex min-w-0 items-center gap-2">
              <span className={`block h-4 shrink-0 rounded-r-[4px] transition-opacity ${activo !== null && activo !== i ? "opacity-55" : ""}`} style={{ width: `calc(${(d.valor / max) * 100}% - 4.5rem)`, minWidth: 2, background: SERIE_UNICA }} aria-hidden="true" />
              <span className="shrink-0 font-bold tabular-nums">{formato(d.valor)}</span>
            </span>
            {activo === i && (
              <span role="tooltip" className="pointer-events-none absolute right-0 bottom-[calc(100%+4px)] z-10 rounded-xl border border-linea bg-papel px-3 py-1.5 text-sm shadow-lg">
                <strong className="tabular-nums">{formato(d.valor)}</strong> <span className="text-cacao-suave">· {d.nombre}</span>
                {total > 0 && <span className="text-cacao-suave"> · {Math.round((d.valor / total) * 100)} % del total</span>}
                {d.detalle && <span className="text-cacao-suave"> · {d.detalle}</span>}
              </span>
            )}
          </li>
        ))}
      </ul>
      <figcaption className="sr-only">{titulo}</figcaption>
      <TablaAlternativa titulo={titulo} columnas={["Nombre", columnaValor]} filas={datos.map((d) => [d.nombre, formato(d.valor)])} />
    </figure>
  );
}
