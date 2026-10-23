import type { Metadata } from "next";
import { VistaCuenta } from "./VistaCuenta";

export const metadata: Metadata = { title: "Mi cuenta", description: "Tus pedidos y datos de entrega.", robots: { index: false } };

export default function PaginaCuenta() {
  return (
    <div className="contenedor pt-8">
      <VistaCuenta />
    </div>
  );
}
