"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSesionRequerida } from "@/components/cuenta/useSesion";
import { Campo, CamposEntrega, CasillaCorreos, ErrorGeneral } from "@/components/Formularios";
import { Migas } from "@/components/tienda/Encabezado";
import { repo } from "@/lib/repositorio";
import type { DatosEntrega } from "@/lib/tipos";
import { validarEnServidor, type Errores } from "@/lib/validar";

export function VistaDatos() {
  const cliente = useSesionRequerida();
  const router = useRouter();
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);
  if (!cliente) return <p>Cargando…</p>;

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cliente) return;
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "");
    setEnviando(true);
    const v = await validarEnServidor<DatosEntrega & { celular: string; autorizaCorreos: boolean }>("/api/cuenta/validar", {
      tipo: "actualizacion",
      datos: { celular: g("celular"), departamento: g("departamento"), ciudad: g("ciudad"), direccion: g("direccion"), complemento: g("complemento") || undefined, autorizaCorreos: f.get("autorizaCorreos") === "on" },
    });
    if (!v.ok) {
      setErrores(v.errores);
      setEnviando(false);
      return;
    }
    await repo().actualizarEntrega(cliente.id, v.datos);
    router.push("/cuenta");
  }

  return (
    <div>
      <Migas items={[{ href: "/", nombre: "Inicio" }, { href: "/cuenta", nombre: "Mi cuenta" }, { nombre: "Datos de entrega" }]} />
      <h1 className="mt-4 mb-8 text-4xl sm:text-5xl">Datos de entrega</h1>
      <form onSubmit={enviar} noValidate className="tarjeta max-w-3xl space-y-6 p-6 sm:p-10">
        <ErrorGeneral errores={errores} />
        <Campo nombre="celular" etiqueta="Celular" type="tel" autoComplete="tel-national" defaultValue={cliente.celular} errores={errores} />
        <CamposEntrega errores={errores} inicial={cliente} />
        <CasillaCorreos inicial={cliente.autorizaCorreos} />
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="boton" disabled={enviando}>
            {enviando ? "Guardando…" : "Guardar cambios"}
          </button>
          <button type="button" className="boton-sec" onClick={() => router.push("/cuenta")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
