import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/tienda/Encabezado";
import { VistaCarrito } from "./VistaCarrito";

export const metadata: Metadata = { title: "Carrito", description: "Revisa las prendas de tu carrito antes de comprar.", robots: { index: false } };

export default function PaginaCarrito() {
  return (
    <>
      <EncabezadoPagina migas={[{ href: "/", nombre: "Inicio" }, { nombre: "Carrito" }]} titulo="Tu carrito" />
      <div className="contenedor">
        <VistaCarrito />
      </div>
    </>
  );
}
