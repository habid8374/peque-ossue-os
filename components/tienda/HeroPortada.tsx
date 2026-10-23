"use client";

import Link from "next/link";
import { IconoWhatsApp } from "@/components/Iconos";
import { CONFIG_INICIAL } from "@/lib/demo/generar";
import { useDatos } from "@/lib/hooks";
import { MARCA, enlaceWhatsApp } from "@/lib/marca";
import { rutaInternaSegura } from "@/lib/seguridad";
import { ArcoirisHeroe } from "./ArcoirisHeroe";

/** Resalta en itálica la última palabra del título, como el "soñar" del lema. */
function TituloConAcento({ texto }: { texto: string }) {
  const partes = texto.trim().split(" ");
  const ultima = partes.pop();
  return (
    <>
      {partes.join(" ")} <em className="acento">{ultima}</em>
    </>
  );
}

export function HeroPortada() {
  const config = useDatos((r) => r.configuracion());
  const b = (config ?? CONFIG_INICIAL).banners[0] ?? CONFIG_INICIAL.banners[0];
  return (
    <section aria-labelledby="titulo-heroe" className="relative overflow-hidden">
      <div className="contenedor grid items-center gap-4 pt-4 pb-14 lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:pt-14 lg:pb-20">
        <div className="order-2 lg:order-1">
          <p className="sobretitulo">
            {MARCA.ciudad} · {MARCA.departamento} · Envíos a toda Colombia
          </p>
          <h1 id="titulo-heroe" className="mt-4 text-[2.7rem] sm:text-6xl xl:text-7xl">
            <TituloConAcento texto={b.titulo} />
          </h1>
          <p className="mt-5 max-w-xl text-lg text-cacao-suave sm:text-xl">{b.texto}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={rutaInternaSegura(b.enlace, "/tienda")} className="boton">
              {b.boton}
            </Link>
            <a href={enlaceWhatsApp("Hola, Pequeños Sueños. Quiero asesoría para escoger una prenda.")} target="_blank" rel="noopener noreferrer" className="boton-sec">
              <IconoWhatsApp tam={22} /> Asesoría por WhatsApp
            </a>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <ArcoirisHeroe />
        </div>
      </div>
    </section>
  );
}

export function BannerSecundario() {
  const config = useDatos((r) => r.configuracion());
  const b = (config ?? CONFIG_INICIAL).banners[1] ?? CONFIG_INICIAL.banners[1];
  return (
    <div>
      <h2 className="text-4xl text-cacao sm:text-5xl">
        <TituloConAcento texto={b.titulo} />
      </h2>
      <p className="mt-4 max-w-md text-lg">{b.texto}</p>
      <Link href={rutaInternaSegura(b.enlace, "/tienda")} className="boton mt-7">
        {b.boton}
      </Link>
    </div>
  );
}
