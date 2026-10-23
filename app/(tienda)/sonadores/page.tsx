import type { Metadata } from "next";
import Link from "next/link";
import { IconoInstagram } from "@/components/Iconos";
import { EncabezadoPagina } from "@/components/tienda/Encabezado";
import { Ilustracion } from "@/components/tienda/Ilustracion";
import { Pendiente, Prosa } from "@/components/tienda/Pendiente";
import { MARCA } from "@/lib/marca";

export const metadata: Metadata = {
  title: "Soñadores",
  description: "Los pequeños soñadores que visten Pequeños Sueños. Comparte tu foto en Instagram.",
  alternates: { canonical: "/sonadores" },
};

const MARCOS = [
  { fondo: "bg-rosa-nube", il: "vestido", color: "#EDB8BE" },
  { fondo: "bg-salvia", il: "camisa", color: "#EFE4D2" },
  { fondo: "bg-lila", il: "mameluco", color: "#D9CBEA" },
  { fondo: "bg-durazno", il: "jardinera", color: "#E9BDBB" },
] as const;

export default function Sonadores() {
  return (
    <>
      <EncabezadoPagina
        migas={[{ href: "/", nombre: "Inicio" }, { nombre: "Soñadores" }]}
        sobretitulo="De nuestras historias destacadas"
        titulo={
          <>
            Nuestros <em className="acento">soñadores</em>
          </>
        }
        texto="Los niños y bebés que estrenan con nosotros. Cada foto es un recuerdo que nos llena el corazón."
      />
      <div className="contenedor">
        {/* TODO(CLIENTE): fotos de clientes con autorización escrita de sus padres o acudientes. */}
        <Pendiente>
          <p>Aquí irá la galería de fotos de los soñadores. Solo se publican fotos de menores con autorización expresa de sus padres o acudientes.</p>
        </Pendiente>
        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4" aria-label="Espacios para fotos">
          {MARCOS.map((m, i) => (
            <li key={i} className={`arco relative aspect-[3/4] overflow-hidden ${m.fondo}`}>
              <Ilustracion tipo={m.il} color={m.color} acento="#FFFDF9" className="absolute inset-[18%_12%_8%] h-[74%] w-[76%] opacity-80" />
            </li>
          ))}
        </ul>
        <Prosa>
          <h2>Comparte tu foto</h2>
          <p>
            Etiquétanos en Instagram como <strong>@{MARCA.instagram}</strong> cuando tu pequeño estrene. Si quieres que aparezca aquí, escríbenos y te pedimos la autorización.
          </p>
          <p>
            <a href={MARCA.instagramUrl} target="_blank" rel="noopener noreferrer" className="boton-sec">
              <IconoInstagram /> Ver Instagram
            </a>
          </p>
          <p>
            ¿Buscas algo para estrenar? <Link href="/tienda" className="enlace">Mira la colección</Link>.
          </p>
        </Prosa>
      </div>
    </>
  );
}
