import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalogo, CatalogoRespaldo } from "@/components/tienda/Catalogo";
import { EncabezadoPagina } from "@/components/tienda/Encabezado";
import { CATALOGO } from "@/lib/catalogo-semilla";

export const metadata: Metadata = {
  title: "Tienda: ropa para bebés y niños",
  description: "Toda la colección de Pequeños Sueños: recién nacido, bebé, niños, bautizo, calzado y accesorios. Filtra por talla, precio y categoría.",
  alternates: { canonical: "/tienda" },
};

export default function PaginaTienda() {
  return (
    <>
      <EncabezadoPagina
        migas={[{ href: "/", nombre: "Inicio" }, { nombre: "Tienda" }]}
        titulo={
          <>
            Toda la <em className="acento">colección</em>
          </>
        }
        texto="Prendas escogidas una a una, del primer body al vestido del cumpleaños."
      />
      <div className="contenedor">
        <Suspense fallback={<CatalogoRespaldo iniciales={CATALOGO} />}>
          <Catalogo iniciales={CATALOGO} />
        </Suspense>
      </div>
    </>
  );
}
