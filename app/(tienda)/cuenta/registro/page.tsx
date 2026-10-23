import type { Metadata } from "next";
import { Suspense } from "react";
import { FormRegistro } from "@/components/cuenta/FormRegistro";
import { EncabezadoPagina } from "@/components/tienda/Encabezado";

export const metadata: Metadata = { title: "Crear cuenta", description: "Crea tu cuenta en Pequeños Sueños para seguir tus pedidos y comprar más rápido.", alternates: { canonical: "/cuenta/registro" } };

export default function Registro() {
  return (
    <>
      <EncabezadoPagina
        migas={[{ href: "/", nombre: "Inicio" }, { href: "/cuenta/ingresar", nombre: "Mi cuenta" }, { nombre: "Crear cuenta" }]}
        titulo={
          <>
            Crea tu <em className="acento">cuenta</em>
          </>
        }
        texto="Guarda tu dirección, sigue tus pedidos y recibe novedades solo si quieres."
      />
      <div className="contenedor">
        <div className="tarjeta max-w-3xl p-6 sm:p-10">
          <Suspense>
            <FormRegistro />
          </Suspense>
        </div>
      </div>
    </>
  );
}
