import type { Metadata } from "next";
import { Suspense } from "react";
import { VistaPedidoCuenta } from "./VistaPedidoCuenta";

export const metadata: Metadata = { title: "Detalle del pedido", description: "Seguimiento de tu pedido.", robots: { index: false } };

export default function PaginaPedidoCuenta() {
  return (
    <div className="contenedor pt-6">
      <Suspense fallback={<p>Cargando…</p>}>
        <VistaPedidoCuenta />
      </Suspense>
    </div>
  );
}
