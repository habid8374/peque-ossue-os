"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSesionRequerida } from "@/components/cuenta/useSesion";
import { Migas } from "@/components/tienda/Encabezado";
import { SeguimientoPedido } from "@/components/tienda/SeguimientoPedido";
import { useDatos } from "@/lib/hooks";

export function VistaPedidoCuenta() {
  const numero = useSearchParams().get("n") ?? "";
  const cliente = useSesionRequerida();
  const pedido = useDatos((r) => (cliente ? r.pedidoDeCliente(cliente.id, numero).then((p) => p ?? null) : Promise.resolve(undefined)), [cliente?.id, numero]);
  if (!cliente || pedido === undefined) return <p>Cargando…</p>;
  return (
    <div>
      <Migas items={[{ href: "/", nombre: "Inicio" }, { href: "/cuenta", nombre: "Mi cuenta" }, { nombre: numero || "Pedido" }]} />
      <h1 className="mt-4 mb-8 text-4xl sm:text-5xl">Seguimiento del pedido</h1>
      {pedido ? (
        <SeguimientoPedido pedido={pedido} correo={pedido.contacto.correo} />
      ) : (
        <p role="alert" className="rounded-2xl bg-rosa-nube px-5 py-4 font-bold">
          No encontramos ese pedido en tu cuenta.{" "}
          <Link href="/cuenta" className="enlace">
            Volver a mis pedidos
          </Link>
        </p>
      )}
    </div>
  );
}
