import { Suspense } from "react";
import { VistaPedidos } from "@/components/admin/VistaPedidos";

export const metadata = { title: "Pedidos" };

export default function PaginaPedidos() {
  return (
    <Suspense fallback={<p>Cargando…</p>}>
      <VistaPedidos />
    </Suspense>
  );
}
