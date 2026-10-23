import type { Metadata } from "next";
import { VistaConfirmado } from "./VistaConfirmado";

export const metadata: Metadata = { title: "¡Pedido recibido!", description: "Confirmación de tu pedido.", robots: { index: false } };

export default function PaginaConfirmado() {
  return (
    <div className="contenedor pt-10">
      <VistaConfirmado />
    </div>
  );
}
