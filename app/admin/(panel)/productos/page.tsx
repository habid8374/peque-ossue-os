import { Suspense } from "react";
import { VistaProductos } from "@/components/admin/VistaProductos";

export const metadata = { title: "Productos" };

export default function PaginaProductos() {
  return (
    <Suspense fallback={<p>Cargando…</p>}>
      <VistaProductos />
    </Suspense>
  );
}
