import type { Metadata } from "next";
import { Suspense } from "react";
import { FormIngreso } from "@/components/cuenta/FormIngreso";
import { EncabezadoPagina } from "@/components/tienda/Encabezado";

export const metadata: Metadata = { title: "Iniciar sesión", description: "Entra a tu cuenta para ver tus pedidos y comprar más rápido.", alternates: { canonical: "/cuenta/ingresar" } };

export default function Ingresar() {
  return (
    <>
      <EncabezadoPagina
        migas={[{ href: "/", nombre: "Inicio" }, { nombre: "Iniciar sesión" }]}
        titulo={
          <>
            Hola de <em className="acento">nuevo</em>
          </>
        }
        texto="Entra para ver tus pedidos y comprar sin volver a escribir tus datos."
      />
      <div className="contenedor">
        <div className="tarjeta max-w-md p-6 sm:p-8">
          <Suspense>
            <FormIngreso />
          </Suspense>
        </div>
      </div>
    </>
  );
}
