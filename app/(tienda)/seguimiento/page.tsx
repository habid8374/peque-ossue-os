import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/tienda/Encabezado";
import { VistaSeguimiento } from "./VistaSeguimiento";

export const metadata: Metadata = {
  title: "Seguir mi pedido",
  description: "Consulta en qué va tu pedido de Pequeños Sueños con tu número de pedido y tu correo.",
  alternates: { canonical: "/seguimiento" },
};

export default function PaginaSeguimiento() {
  return (
    <>
      <EncabezadoPagina
        migas={[{ href: "/", nombre: "Inicio" }, { nombre: "Seguir mi pedido" }]}
        titulo={
          <>
            ¿Dónde va mi <em className="acento">pedido?</em>
          </>
        }
        texto="Escribe tu número de pedido y el correo con el que compraste. No necesitas iniciar sesión."
      />
      <div className="contenedor">
        <VistaSeguimiento />
      </div>
    </>
  );
}
