"use client";

import { useEffect, useState } from "react";
import { FormConsultaPedido } from "@/components/tienda/FormConsultaPedido";
import { CLAVE_CONSULTA } from "@/lib/claves";
import { SeguimientoPedido } from "@/components/tienda/SeguimientoPedido";
import { useDatos } from "@/lib/hooks";

export function VistaSeguimiento() {
  const [consulta, setConsulta] = useState<{ numero: string; correo: string } | null>(null);
  const [leido, setLeido] = useState(false);

  useEffect(() => {
    let previa: { numero: string; correo: string } | null = null;
    try {
      const crudo = sessionStorage.getItem(CLAVE_CONSULTA);
      if (crudo) previa = JSON.parse(crudo);
    } catch {
      previa = null;
    }
    // Lectura única de sessionStorage al montar.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsulta(previa);
    setLeido(true);
  }, []);

  const pedido = useDatos((r) => (consulta ? r.buscarPedido(consulta.numero, consulta.correo).then((x) => x ?? null) : Promise.resolve(null)), [consulta?.numero, consulta?.correo]);

  function consultar(numero: string, correo: string) {
    const c = { numero, correo };
    try {
      sessionStorage.setItem(CLAVE_CONSULTA, JSON.stringify(c));
    } catch {
      /* sin almacenamiento */
    }
    setConsulta(c);
  }

  if (!leido) return null;

  return (
    <div className="space-y-10">
      <div className="tarjeta max-w-3xl p-6 sm:p-8">
        <FormConsultaPedido compacto alConsultar={consultar} />
      </div>
      {consulta && pedido === null && <NoEncontrado />}
      {consulta && pedido && <SeguimientoPedido pedido={pedido} correo={consulta.correo} />}
    </div>
  );
}

function NoEncontrado() {
  return (
    <p role="alert" className="rounded-2xl bg-rosa-nube px-5 py-4 font-bold">
      No encontramos un pedido con ese número y correo. Revisa los datos o escríbenos por WhatsApp.
    </p>
  );
}
