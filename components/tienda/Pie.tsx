import Image from "next/image";
import Link from "next/link";
import { IconoInstagram, IconoUbicacion, IconoWhatsApp } from "@/components/Iconos";
import { CATEGORIAS, MARCA, enlaceWhatsApp } from "@/lib/marca";
import { FormSuscripcion } from "./FormSuscripcion";

const AYUDA = [
  { href: "/seguimiento", nombre: "Seguir mi pedido" },
  { href: "/envios-y-cambios", nombre: "Envíos, cambios y preguntas" },
  { href: "/plan-de-pago", nombre: "Plan de pago" },
  { href: "/cuenta", nombre: "Mi cuenta" },
];
const NOSOTROS = [
  { href: "/quienes-somos", nombre: "Quiénes somos" },
  { href: "/sonadores", nombre: "Soñadores" },
  { href: "/politica-de-datos", nombre: "Política de tratamiento de datos" },
];

export function Pie() {
  return (
    <footer className="mt-24 bg-cacao text-crema">
      <div className="contenedor grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-4">
            <Image src="/marca/logo-pequenos-suenos.webp" alt="Logo de Pequeños Sueños" width={88} height={88} className="size-[88px] shrink-0 rounded-full" />
            <p className="titulo text-2xl">
              Donde vestir también es <em className="font-italica italic text-rosa-nube">soñar.</em>
            </p>
          </div>
          <ul className="mt-6 space-y-2 text-[0.95rem]">
            <li className="flex gap-3">
              <IconoUbicacion className="mt-1 shrink-0" />
              <span>
                {MARCA.direccion}, {MARCA.ciudad}, {MARCA.departamento}
              </span>
            </li>
            <li>
              <a href={enlaceWhatsApp("Hola, Pequeños Sueños. Quiero información.")} className="inline-flex min-h-11 items-center gap-3 font-bold underline-offset-4 hover:underline" rel="noopener noreferrer" target="_blank">
                <IconoWhatsApp tam={22} /> WhatsApp {MARCA.whatsappVisible}
              </a>
            </li>
            <li>
              <a href={MARCA.instagramUrl} className="inline-flex min-h-11 items-center gap-3 font-bold underline-offset-4 hover:underline" rel="noopener noreferrer" target="_blank">
                <IconoInstagram /> @{MARCA.instagram}
              </a>
            </li>
          </ul>
        </div>
        <nav aria-label="Comprar">
          <h2 className="sobretitulo !text-rosa-nube">Comprar</h2>
          <ul className="mt-3">
            <li>
              <Link href="/tienda" className="inline-flex min-h-11 items-center hover:underline">
                Toda la tienda
              </Link>
            </li>
            {CATEGORIAS.map((c) => (
              <li key={c.id}>
                <Link href={`/coleccion/${c.id}`} className="inline-flex min-h-11 items-center hover:underline">
                  {c.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Ayuda">
          <h2 className="sobretitulo !text-rosa-nube">Ayuda</h2>
          <ul className="mt-3">
            {AYUDA.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center hover:underline">
                  {l.nombre}
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="sobretitulo mt-6 !text-rosa-nube">Nosotros</h2>
          <ul className="mt-3">
            {NOSOTROS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center hover:underline">
                  {l.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="sobretitulo !text-rosa-nube">Novedades por correo</h2>
          <p className="mt-3 mb-4 text-[0.95rem]">Te avisamos cuando lleguen prendas nuevas y ofertas. Sin llenarte el buzón.</p>
          <FormSuscripcion oscuro />
        </div>
      </div>
      <div className="border-t border-crema/15">
        <div className="contenedor flex flex-col gap-2 py-5 text-sm text-crema/85 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {MARCA.nombre}. Sitio de demostración: los pagos y pedidos son simulados.</p>
          <p>
            Diseño y desarrollo:{" "}
            <a href="https://axentiatechnologies.com" className="font-bold underline underline-offset-2" rel="noopener" target="_blank">
              Axentia Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
