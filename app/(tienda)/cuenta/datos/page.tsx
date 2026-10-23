import type { Metadata } from "next";
import { VistaDatos } from "./VistaDatos";

export const metadata: Metadata = { title: "Editar datos de entrega", description: "Actualiza tu dirección y tus preferencias.", robots: { index: false } };

export default function PaginaDatos() {
  return (
    <div className="contenedor pt-6">
      <VistaDatos />
    </div>
  );
}
