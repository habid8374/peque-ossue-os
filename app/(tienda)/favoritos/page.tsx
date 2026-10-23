import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/tienda/Encabezado";
import { VistaFavoritos } from "./VistaFavoritos";

export const metadata: Metadata = { title: "Favoritos", description: "Las prendas que guardaste para después.", robots: { index: false } };

export default function PaginaFavoritos() {
  return (
    <>
      <EncabezadoPagina migas={[{ href: "/", nombre: "Inicio" }, { nombre: "Favoritos" }]} titulo="Tus favoritos" texto="Guarda aquí lo que te gusta y decide con calma." />
      <div className="contenedor">
        <VistaFavoritos />
      </div>
    </>
  );
}
