"use client";

import { useState } from "react";
import { useDatos } from "@/lib/hooks";
import { repo } from "@/lib/repositorio";
import { rutaInternaSegura } from "@/lib/seguridad";
import type { Configuracion } from "@/lib/tipos";

export function VistaConfiguracion() {
  const config = useDatos((r) => r.configuracion());
  if (!config) return <p>Cargando…</p>;
  return <Formulario key={JSON.stringify(config)} inicial={config} />;
}

function Formulario({ inicial }: { inicial: Configuracion }) {
  const [c, setC] = useState(inicial);
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!(c.envioGratisDesde >= 0) || !(c.costoEnvio >= 0)) return setAviso({ ok: false, texto: "Los valores de envío deben ser números positivos." });
    for (const b of c.banners) {
      if (rutaInternaSegura(b.enlace, "") !== b.enlace) return setAviso({ ok: false, texto: `El enlace “${b.enlace}” debe llevar a una página de esta tienda, por ejemplo /tienda o /coleccion/bautizo.` });
    }
    const transportadoras = c.transportadoras.map((t) => t.trim()).filter(Boolean);
    if (!transportadoras.length) return setAviso({ ok: false, texto: "Agrega al menos una transportadora." });
    await repo().guardarConfiguracion({ ...c, transportadoras });
    setAviso({ ok: true, texto: "Configuración guardada. La tienda ya muestra los cambios." });
  }

  const banner = (i: number, k: keyof Configuracion["banners"][number], v: string) => setC((x) => ({ ...x, banners: x.banners.map((b, j) => (j === i ? { ...b, [k]: v } : b)) }));

  return (
    <form onSubmit={guardar} className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl">Configuración</h1>
        <p className="mt-1 text-cacao-suave">Envíos, transportadoras y textos de la portada.</p>
      </div>
      <section aria-labelledby="t-envios" className="tarjeta grid gap-4 p-6 sm:grid-cols-2">
        <h2 id="t-envios" className="font-sans text-xl font-extrabold tracking-normal sm:col-span-2">
          Envíos
        </h2>
        <div>
          <label htmlFor="cf-gratis" className="etiqueta-campo">
            Envío gratis desde (COP)
          </label>
          <input id="cf-gratis" type="number" min={0} step={1000} className="campo" value={c.envioGratisDesde} onChange={(e) => setC({ ...c, envioGratisDesde: Number(e.target.value) })} />
        </div>
        <div>
          <label htmlFor="cf-costo" className="etiqueta-campo">
            Costo de envío (COP)
          </label>
          <input id="cf-costo" type="number" min={0} step={500} className="campo" value={c.costoEnvio} onChange={(e) => setC({ ...c, costoEnvio: Number(e.target.value) })} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-transp" className="etiqueta-campo">
            Transportadoras <span className="font-normal text-cacao-suave">(una por línea)</span>
          </label>
          <textarea id="cf-transp" className="campo min-h-32" value={c.transportadoras.join("\n")} onChange={(e) => setC({ ...c, transportadoras: e.target.value.split("\n") })} />
        </div>
      </section>
      <section aria-labelledby="t-portada" className="tarjeta space-y-6 p-6">
        <h2 id="t-portada" className="font-sans text-xl font-extrabold tracking-normal">
          Portada
        </h2>
        <div>
          <label htmlFor="cf-anuncio" className="etiqueta-campo">
            Barra de anuncio
          </label>
          <input id="cf-anuncio" className="campo" maxLength={90} value={c.anuncio} onChange={(e) => setC({ ...c, anuncio: e.target.value })} />
        </div>
        {c.banners.map((b, i) => (
          <fieldset key={i} className="grid gap-4 rounded-2xl border border-linea p-4 sm:grid-cols-2">
            <legend className="px-2 font-bold">{i === 0 ? "Banner principal" : "Banner secundario"}</legend>
            <div className="sm:col-span-2">
              <label htmlFor={`cf-b${i}-t`} className="etiqueta-campo">
                Título <span className="font-normal text-cacao-suave">(la última palabra va en itálica)</span>
              </label>
              <input id={`cf-b${i}-t`} className="campo" maxLength={60} value={b.titulo} onChange={(e) => banner(i, "titulo", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`cf-b${i}-x`} className="etiqueta-campo">
                Texto
              </label>
              <textarea id={`cf-b${i}-x`} className="campo min-h-20" maxLength={200} value={b.texto} onChange={(e) => banner(i, "texto", e.target.value)} />
            </div>
            <div>
              <label htmlFor={`cf-b${i}-b`} className="etiqueta-campo">
                Texto del botón
              </label>
              <input id={`cf-b${i}-b`} className="campo" maxLength={30} value={b.boton} onChange={(e) => banner(i, "boton", e.target.value)} />
            </div>
            <div>
              <label htmlFor={`cf-b${i}-e`} className="etiqueta-campo">
                Página a la que lleva el botón
              </label>
              <input id={`cf-b${i}-e`} className="campo" maxLength={120} value={b.enlace} onChange={(e) => banner(i, "enlace", e.target.value)} placeholder="/tienda" />
            </div>
          </fieldset>
        ))}
      </section>
      {aviso && (
        <p role={aviso.ok ? "status" : "alert"} className={aviso.ok ? "rounded-2xl bg-salvia px-4 py-2 font-bold" : "error-campo"}>
          {aviso.texto}
        </p>
      )}
      <button type="submit" className="boton">
        Guardar configuración
      </button>
    </form>
  );
}
