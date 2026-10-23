"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CLAVE_CONSULTA, CLAVE_ULTIMO_PEDIDO } from "@/lib/claves";
import { SeguimientoPedido } from "@/components/tienda/SeguimientoPedido";
import { useDatos } from "@/lib/hooks";

export function VistaConfirmado() {
  const [ref, setRef] = useState<{ numero: string; correo: string } | null | undefined>(undefined);
  useEffect(() => {
    let r: { numero: string; correo: string } | null = null;
    try {
      r = JSON.parse(sessionStorage.getItem(CLAVE_ULTIMO_PEDIDO) ?? "null");
      if (r) sessionStorage.setItem(CLAVE_CONSULTA, JSON.stringify(r));
    } catch {
      r = null;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRef(r);
  }, []);
  const pedido = useDatos((rp) => (ref ? rp.buscarPedido(ref.numero, ref.correo).then((x) => x ?? null) : Promise.resolve(null)), [ref?.numero]);

  if (ref === undefined || (ref && pedido === undefined)) return <p>Cargando…</p>;
  if (!ref || !pedido) {
    return (
      <div className="tarjeta p-10 text-center">
        <h1 className="text-4xl">No hay un pedido reciente</h1>
        <p className="mt-3 text-cacao-suave">Si ya compraste, consulta tu pedido con el número y tu correo.</p>
        <Link href="/seguimiento" className="boton mt-6">
          Seguir mi pedido
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <p className="sobretitulo">¡Gracias por tu compra!</p>
        <h1 className="mt-2 text-5xl sm:text-6xl">
          Pedido <em className="acento">recibido</em>
        </h1>
        <p className="mt-4 text-lg">
          Tu número de pedido es <strong className="text-rosa">{pedido.numero}</strong>. Guárdalo junto con tu correo ({pedido.contacto.correo}) para seguir el envío. En una tienda real también te llegaría por correo.
        </p>
      </div>
      <SeguimientoPedido pedido={pedido} correo={pedido.contacto.correo} />
      <div className="flex flex-wrap gap-3">
        <Link href="/tienda" className="boton">
          Seguir comprando
        </Link>
        <Link href={pedido.clienteId ? "/cuenta" : "/cuenta/registro"} className="boton-sec">
          {pedido.clienteId ? "Ver mis pedidos" : "Crear una cuenta"}
        </Link>
      </div>
    </div>
  );
}
