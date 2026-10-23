import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/tienda/Encabezado";
import { FormCheckout } from "./FormCheckout";

export const metadata: Metadata = { title: "Finalizar compra", description: "Datos de entrega y pago de tu pedido.", robots: { index: false } };

export default function PaginaCheckout() {
  return (
    <>
      <EncabezadoPagina migas={[{ href: "/", nombre: "Inicio" }, { href: "/carrito", nombre: "Carrito" }, { nombre: "Finalizar compra" }]} titulo="Finalizar compra" />
      <div className="contenedor">
        <FormCheckout />
      </div>
    </>
  );
}
