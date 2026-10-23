import type { Metadata } from "next";
import Image from "next/image";
import { EncabezadoPagina } from "@/components/tienda/Encabezado";
import { Pendiente, Prosa } from "@/components/tienda/Pendiente";
import { MARCA } from "@/lib/marca";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description: "Pequeños Sueños es una tienda de ropa infantil y para bebés en Sabanalarga, Atlántico. Un lugar creado con amor.",
  alternates: { canonical: "/quienes-somos" },
};

export default function QuienesSomos() {
  return (
    <>
      <EncabezadoPagina
        migas={[{ href: "/", nombre: "Inicio" }, { nombre: "Quiénes somos" }]}
        sobretitulo="De nuestras historias destacadas"
        titulo={
          <>
            Un lugar creado con <em className="acento">amor</em>
          </>
        }
      />
      <div className="contenedor grid gap-12 lg:grid-cols-[1fr_360px]">
        <Prosa>
          <p>
            <strong>{MARCA.nombre}</strong> es una tienda de ropa infantil y para bebés en {MARCA.ciudad}, {MARCA.departamento}. Nos encuentras en el {MARCA.direccion}.
          </p>
          <p>Nuestro lema lo dice todo: {MARCA.lema} Escogemos cada prenda pensando en la comodidad de los pequeños y en los momentos que sus familias quieren recordar.</p>
          {/* TODO(CLIENTE): historia real de la tienda, fundadora, año de apertura, fotos del local. */}
          <Pendiente>
            <p>Muy pronto te contaremos aquí cómo nació Pequeños Sueños.</p>
          </Pendiente>
          <h2>Visítanos</h2>
          <p>
            {MARCA.direccion}, {MARCA.ciudad}, {MARCA.departamento}.
          </p>
          {/* TODO(CLIENTE): horario de atención. */}
          <Pendiente>
            <p>Pronto publicaremos nuestro horario de atención. Escríbenos por WhatsApp para confirmar antes de tu visita.</p>
          </Pendiente>
        </Prosa>
        <Image src="/marca/logo-pequenos-suenos.webp" alt="Logo de Pequeños Sueños: arcoíris sobre una nube con luna y estrellas" width={360} height={360} className="mx-auto rounded-full" />
      </div>
    </>
  );
}
